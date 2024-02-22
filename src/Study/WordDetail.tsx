import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Typography } from '../Components/Typography';
import axios from 'axios';
import MainURL from "../../MainURL";
import { Divider } from '../Components/Divider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loading from '../Components/Loading';

export default function WordDetail (props : any) {
  
  const wordID = props.route.params.wordID;
  const currentTime = new Date();
  const currentDate = currentTime.toISOString().slice(0, 19);

  interface WordsProps {
    id: number;
    name_ko : string;
    name_en : string;
    content : string;
  }
  
  const [word, setWord] = useState<WordsProps>();
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);

  const fetchPosts = () => {
    axios.get(`${MainURL}/study/getworddata/${wordID}`)
    .then((res) => {
      if(res.data) {
        setIsResdataFalse(false);
        let copy = res.data;
        setWord(copy[0]);
      } else {
        setIsResdataFalse(true);
      }
    })
    .catch((err:any)=>{
      console.log(err)
    })
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    word === undefined && !isResdataFalse // axios 반응이 없을때
    ?  (
    <View style={{flex:1, width:'100%', height:'100%'}}>
      <Loading /> 
    </View>
    ) : (
    <View style={styles.container}>

      <View style={[styles.section, {flexDirection:'row', justifyContent:'space-between', alignItems:'center'}]}>
        <TouchableOpacity
          onPress={()=>{
            props.navigation.goBack()
          }}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Divider height={2} marginVertical={10}/>
      {
        !isResdataFalse // axios 반응이 있고, res.data가 true일때
        ?
        <ScrollView style={[styles.section]}>
          <Typography fontSize={24} fontWeightIdx={1}>{word?.name_ko}</Typography>
          <Typography fontSize={24} fontWeightIdx={1}>{word?.name_en}</Typography>
          <Divider height={3} marginVertical={10}/>
          <Typography>{word?.content}</Typography>
        <View style={{height:100}}></View>
      </ScrollView>
      :
      // axios 반응이 있지만, res.data가 false일때
      <View style={[styles.section, {flex:1, alignItems:'center', justifyContent:'center'}]}>
        <Typography marginBottom={10} fontSize={24}>"{word}"</Typography>
        <Typography>현재, 이 단어가 없습니다.</Typography>
        <TouchableOpacity 
          style={{padding:5, borderWidth:1, borderColor:'#E5625D', borderRadius:10, marginTop:15}}
          onPress={()=>{
            props.navigation.navigate('Request', { select : 'Word', setword : word})
          }}
        >
          <Typography fontSize={12}  color='#E5625D'>단어 등록 요청</Typography>
        </TouchableOpacity>
      </View>
      }
     
    </View>
    )
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section : {
    padding: 20
  },
  backButton: {
    width: 40,
    height: 40,
  }
});