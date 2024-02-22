import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Typography } from '../Components/Typography';
import axios from 'axios';
import MainURL from "../../MainURL";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import SelectDropdown from 'react-native-select-dropdown'
import Loading from '../Components/Loading';

export default function WordList (props : any) {

  interface WordsProps {
    id: number;
    name_ko : string;
    name_en : string;
    content : string;
  }

  const [words, setWords] = useState<WordsProps[]>([]);
  const [page, setPage] = useState(1);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);
  
  const fetchPosts = () => {
    axios.get(`${MainURL}/study/getworddataall/${page}`)
    .then((res) => {
      if(res.data) {
        setIsResdataFalse(false);
        let data: any = [...res.data.items];
        let wordsCopy = [...words, ...data] 
        wordsCopy.sort((a: any, b: any) => a.name_en > b.name_en ? 1 : -1);
        setWords(wordsCopy);
        setWordsViewList(wordsCopy);
      } else {
        setIsResdataFalse(true);
      }
    });
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const [wordsViewList, setWordsViewList] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');  
  const [isInputValue, setIsInputValue] = useState<boolean>(true);  
  const [inputValueMessage, setInputValueMessage] = useState('');
  const [isResdataFalse2, setIsResdataFalse2] = useState<boolean>(false);

  const fetchPostsSearch = (searchAlphabet:string) => {
    setWordsViewList([]);
    axios.get(`${MainURL}/study/getworddatasearch/${searchAlphabet}`)
    .then((res) => {
      if(res.data) {
        setIsResdataFalse2(false);
        setWordsViewList(res.data);
      } else {
        setIsResdataFalse2(true);
      }
    });
  };

  const changeInputValue = (text: string) => {
    const inputText = text.trim();
    setInputValue(inputText);
    if (inputText.length === 0) {
      setIsInputValue(true);
      setInputValueMessage('');
      setWordsViewList(words); 
    } else if (inputText.length > 0 && inputText.length < 2) {
      setInputValueMessage('2글자 이상으로 입력해주세요.');
      setIsInputValue(false);
    } 
    else {
      setIsInputValue(true);
      setInputValueMessage('');
      fetchPostsSearch(inputText);
    }
  };

  const handleResetPress = () => {
    setInputValue('');
    setIsInputValue(true);
    setWordsViewList(words);
  }
  
  return (
    words.length === 0 && !isResdataFalse
    ?  (
    <View style={{flex:1, width:'100%', height:'100%'}}>
      <Loading /> 
    </View>
    ) : (
    <View style={styles.container}>
     
      <View style={{paddingHorizontal:20, paddingBottom:100}}>

          <View style={{width:'100%', alignItems:'flex-end', paddingRight:10}}>
            <Typography fontSize={12} color='#8C8C8C'>총 2213개의 단어가 있습니다.</Typography>
          </View>
        
          <View style={styles.seachBar}>
            <View style={[styles.flexBox, { alignItems:"center"}]}>
              <Entypo name="magnifying-glass" size={22} color="#8B8B8B" style={{marginRight:13}}/> 
              <TextInput 
                maxLength={20} 
                placeholder="단어"
                placeholderTextColor="#DBDBDB"
                value={inputValue}
                onChangeText={changeInputValue} 
                style={{height:'100%', flex:1}}
              />
              <TouchableOpacity 
                style={{padding:5}}
                onPress={handleResetPress}
              >
                <AntDesign  name="closecircle" size={14} color="#C1C1C1"/> 
              </TouchableOpacity>
            </View>
          </View>
          
          {!isInputValue && (
            <View style={{width:'100%', alignItems:'center', marginBottom:20}}>
            <Typography color='#F15F5F' fontSize={12}>
              {inputValueMessage}
            </Typography>
            </View>
          )}
          
          <Divider/>

          <ScrollView>

          {
            wordsViewList.length === 0 && !isResdataFalse2
            ?
            <View style={{flex:1, width:'100%', height:200}}>
              <Loading />
            </View>
            :
            <>
            {
              isResdataFalse2              
              ?
              <View style={{alignItems:'center', justifyContent:'center', paddingTop:20}}>
                <Typography color="#8B8B8B" marginBottom={20}>검색결과가 없습니다.</Typography>
              </View>
              :              
              <>
              {
                wordsViewList.map((item:any, index:any)=>{

                  return ( 
                    <TouchableOpacity
                      key={index} 
                      style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:10}}
                      onPress={()=>{
                        props.navigation.navigate('WordDetail', { wordID : item.id })
                      }}
                    >
                      <View style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center',
                                    borderWidth:1, borderRadius:10, borderColor:'#DFDFDF', height:70
                        }}>
                        <View style={{width:'80%', justifyContent:'flex-start', flexDirection:'row', alignItems:'center'}}>
                          <Image
                            source={require("../images/study/greenmiddle.png")}
                            style={{width:10, height:20, resizeMode:'cover', opacity:0.5, marginRight:5}}>
                          </Image>
                          <View style={{justifyContent:'center'}}>
                            <Typography>{item.name_en}</Typography>
                            <Typography>{item.name_ko}</Typography>
                          </View>
                        </View>
                        
                        <View style={{width:'20%', alignItems:'flex-end'}}>
                          <AntDesign name='right' color='#333'/>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
              {
                inputValue === '' &&
                <TouchableOpacity
                style={styles.button} 
                onPress={()=>{
                  setPage(prev => prev + 1);
                }}
              >
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Typography color='#8C8C8C'  fontSize={14}>더보기 </Typography>
                  <AntDesign name="down" size={16} color="#8C8C8C"/>
                </View>
              </TouchableOpacity>
              
              }
              </>
            }
            </>
          }
          
        </ScrollView>
      </View>
      

    </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding:20
  },
  selectDropdown : {
    width:'48%',
    borderWidth:1, 
    borderRadius:5, 
    borderColor:'#DFDFDF', 
    paddingHorizontal:15,
    paddingVertical:5,
    flexDirection:'row', 
    alignItems:'center',
  },
  seachBar:{
    borderWidth:1,
    borderRadius:5,
    height: 48,
    borderColor: '#EAEAEA',
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:15,
    marginVertical:10
  },
  flexBox:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  button: {
    borderBottomWidth:1,
    borderColor: '#EAEAEA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
});

