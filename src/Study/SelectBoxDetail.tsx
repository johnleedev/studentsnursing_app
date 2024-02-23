import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import MainURL from '../../MainURL';
import Loading from '../Components/Loading';

interface WordsProps {
  id: number;
  sort: string;
  short_name: string;
  name_en: string;
  name_ko: string;
}

export default function SelectBoxDetail (props : any) {
  
  const sort = props.route.params.sort;
  const letter = props.route.params.letter;

  const [wordsData, setWordsData] = useState< WordsProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);

  const fetchPosts = () => {
    axios.get(`${MainURL}/study/getwordshorthardalphabet/${letter}`)
    .then((res) => {
      if(res.data) {
        setIsResdataFalse(false);
        let data: any = [...res.data];
        setWordsData(data);
      } else {
        setIsResdataFalse(true);
      }
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);
   

  const divideData = [];
  for (let i = 0; i < wordsData.length; i += 50) {
    divideData.push(wordsData.slice(i, i + 50));
  }



  const RenderSection = ({ index, navigation, letter, data }: { index: number, navigation: any; letter: string; data: WordsProps[] }) => (
    <TouchableOpacity
      key={letter} // 고유한 키 할당
      style={styles.select}
      onPress={() => {
          navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { data, sortko: `${letter}${index+1}` })
      }}
    >
      <View style={{ width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontSize={18} fontWeightIdx={1}>{letter}{index+1}</Typography>
        <Typography fontSize={12}>{data.length}개 단어</Typography>
      </View>
      <AntDesign name='right' size={14} color='#000' />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ padding: 15, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingRight:20}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <Typography>{sort === 'Study' ? '학습하기' : '문제풀기'} 선택 2</Typography>
      </View>

      <Divider />
      
      <View style={{width:'100%', alignItems:'center', marginVertical:10}}>
        <Typography fontSize={14} color='#8C8C8C'>* 편의상 50개 단어씩 구분하였습니다.</Typography>
      </View>
      

      { isResdataFalse
      ?  
      <View style={{flex:1, width:'100%', height:'100%'}}>
        <Loading /> 
      </View>
      :
      <ScrollView style={{paddingHorizontal:20}}>
        <View style={{width:'100%', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
          {
            divideData.map((item:any, index:any) => {
              return (
                <RenderSection key={index} navigation={props.navigation} letter={letter} data={item} index={index}/>
              )
            })
          }
        </View>
        <View style={{height:50}}></View>
      </ScrollView>
       }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
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
  select: {
    width:'48%',
    height:50,
    paddingVertical:10,
    paddingHorizontal:20,
    borderWidth:1, 
    borderColor:'#BDBDBD', 
    borderRadius:10, 
    flexDirection:'row',
    alignItems:'center', 
    justifyContent:'space-between',
    marginVertical:10,
  }
  
});

