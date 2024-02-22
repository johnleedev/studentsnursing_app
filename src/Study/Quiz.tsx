import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface WordsProps {
  id: number;
  sort: string;
  short_name: string;
  name_en: string;
  name_ko: string;
}

export default function Quiz (props : any) {
  const sortko : string = props.route.params.sortko ?? '';
  const propsData: WordsProps[] = props.route.params.data;
  const [shuffledQuizs, setShuffledQuizs] = useState<WordsProps[]>([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [isAnswer, setIsAnswer] = useState<boolean | null>(null);
  const [answerNum, setAnswerNum] = useState<number>(0);
  const [isResult, setIsResult] = useState<boolean>(false);
  
  // 정답이 아닌 선택지 생성
  const shuffle = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  // 퀴즈 생성 함수
  const generateQuiz = (correctAnswer: any, allAnswers: any) => {
    const wrongAnswers = shuffle(allAnswers.filter((answer: any) => answer.short_name !== correctAnswer.short_name)).slice(0, 3);
    const shuffledAnswers = shuffle(wrongAnswers.concat(correctAnswer));
    return shuffledAnswers;
  };

  // 생성된 퀴즈 배열
  useEffect(()=>{
    const shuffledQuizs = generateQuiz(propsData[currentQuizIndex], propsData);
    setShuffledQuizs(shuffledQuizs)
  }, []);

  // 답선택 함수
  const handleAnswerPress = (answer: WordsProps) => {
    const isCorrect = answer === propsData[currentQuizIndex];
    setIsAnswer(isCorrect)

    // 정답/오답에 따른 함수
    if(isCorrect) {
      setAnswerNum(answerNum+1);
    }
    // 다음 문제로 넘어감
    const nextQuizIndex = currentQuizIndex + 1;
    if (nextQuizIndex < propsData.length) {
      setTimeout(() => {
        setIsAnswer(null)
        setCurrentQuizIndex(nextQuizIndex);
      }, 1000); 
      setTimeout(() => {
        const shuffledQuizs = generateQuiz(propsData[nextQuizIndex], propsData);
        setShuffledQuizs(shuffledQuizs);
      }, 1000);
    } else {
      setIsResult(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ padding: 15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingRight:20}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setIsResult(false);
            props.navigation.goBack();
          }}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Typography >문제풀기</Typography>
      </View>

      <Divider />

      {
        !isResult
        ?
        <>
        <View style={styles.section}>
          <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10, paddingHorizontal:7}}>
            <Typography fontSize={14} color='#8C8C8C'>{sortko}</Typography>
            <Typography fontSize={14} color='#8C8C8C'>{currentQuizIndex+1}/{propsData.length}문제</Typography>
          </View>

          <View style={{height:150, borderWidth:2, borderColor:'#BDBDBD', borderRadius:10, alignItems:'center', justifyContent:'center', padding:15}}>
            { isAnswer !== null 
            ? <Typography fontSize={18} fontWeightIdx={1}>{propsData[currentQuizIndex].name_en}</Typography>
            : <Typography fontSize={18} fontWeightIdx={1}  marginBottom={5}>{propsData[currentQuizIndex].name_ko}</Typography>
            }
            <View style={{position:'absolute', top:5, left:5}}>
              <Typography>QUIZ</Typography>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {
              shuffledQuizs.map((item: WordsProps, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswerPress(item)}
                >
                  <Image
                    source={require("../images/study/orangemiddle.png")}
                    style={{width:10, height:20, resizeMode:'cover', opacity:0.3, marginRight:5}}>
                  </Image>
                  <Typography fontSize={18}>{item.short_name}</Typography>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
        { isAnswer !== null &&
          <View style={{position:'absolute', width:'100%', height:'100%', alignItems:'center', justifyContent:'center', opacity:0.5}}>
            {isAnswer ? <Typography fontSize={200} color='#47C83E'>O</Typography> : <Typography fontSize={200} color='#FF0000'>X</Typography>}
          </View>
        }
        </>
        :
        <View style={styles.section}>
          <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10, paddingHorizontal:7}}>
            <Typography fontSize={14} color='#8C8C8C'>{sortko}</Typography>
            <Typography fontSize={14} color='#8C8C8C'>{currentQuizIndex+1}/{propsData.length}문제</Typography>
          </View>

          <View style={{height:150, borderWidth:2, borderColor:'#BDBDBD', borderRadius:10, alignItems:'center', justifyContent:'center'}}>
            <Typography fontWeightIdx={1} fontSize={18}>문제를 모두 풀었습니다.</Typography>
          </View>
          
          <View style={{alignItems:'center', marginTop:30}}>
            <Typography fontWeightIdx={1} fontSize={18} marginBottom={5}>총 {propsData.length}문제 중,</Typography>
            <Typography fontWeightIdx={1} fontSize={18}>정답을 맞춘 문제는 {answerNum}개입니다.</Typography>
            <View style={{marginTop:30, width:150, height:150, borderWidth:5, borderRadius:75, borderColor:'#F15F5F', opacity:0.5,
                        alignItems:'center', justifyContent:'center'}}>
              <Typography color='#F15F5F' fontSize={25} fontWeightIdx={0}>
                { answerNum/propsData.length*100 === 100 && 'PERPECT!'}
                { answerNum/propsData.length*100 >= 90 && answerNum/propsData.length*100 < 100 && 'GREAT!'}
                { answerNum/propsData.length*100 >= 80 && answerNum/propsData.length*100 < 90 && 'GOOD!'}
                { answerNum/propsData.length*100 >= 70 && answerNum/propsData.length*100 < 80 && 'NOT BAD!'}
                { answerNum/propsData.length*100 >= 60 && answerNum/propsData.length*100 < 70 && 'NOT GOOD..'}
                { answerNum/propsData.length*100 < 60 && 'Try Again!'}
              </Typography>
            </View>
          </View>
        </View>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    marginTop:20,
  },
  optionButton: {
    height:50,
    marginVertical: 10,
    padding: 10,
    borderWidth:1,
    borderColor:'#BDBDBD',
    borderRadius: 5,
    flexDirection:'row',
    alignItems:'center'
  },
  
});

