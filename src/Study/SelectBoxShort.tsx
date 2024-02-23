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

export default function SelectBoxShort (props : any) {
  const sort = props.route.params.sort;

  const propsData: WordsProps[] = props.route.params.data;
  const propsDataAC: WordsProps[] = propsData.filter(word => /^[a-c]/i.test(word.short_name));
  const propsDataDL: WordsProps[] = propsData.filter(word => /^[d-l]/i.test(word.short_name));
  const propsDataMQ: WordsProps[] = propsData.filter(word => /^[m-q]/i.test(word.short_name));
  const propsDataRW: WordsProps[] = propsData.filter(word => /^[r-w]/i.test(word.short_name));
  const propsDataETC: WordsProps[] = propsData.filter(word => !/^[a-w]/i.test(word.short_name));

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
        <Typography>{sort === 'Study' ? '학습하기' : '문제풀기'} 선택</Typography>
      </View>

      <Divider />

      <View style={{width:'100%', alignItems:'center', marginVertical:10}}>
        <Typography fontSize={14} color='#8C8C8C'>* 편의상 알바벳별로 구분하였습니다.</Typography>
      </View>
 
      <View style={{paddingHorizontal:20}}>
        <TouchableOpacity 
          style={styles.select}
          onPress={()=>{
            props.navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { data: propsDataAC, sortko: '공통(기초) A~C' })
          }}
        >
          <View style={{width:'40%', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Typography fontSize={18} fontWeightIdx={1}>A ~ C</Typography> 
            <Typography fontSize={12}>{propsDataAC.length}개 단어</Typography>
          </View>
         <AntDesign name='right' size={20} color='#000'/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.select}
          onPress={()=>{
            props.navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { data: propsDataDL, sortko: '공통(기초) D~L' })
          }}
        >
          <View style={{width:'40%', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Typography fontSize={18} fontWeightIdx={1}>D ~ L</Typography> 
            <Typography fontSize={12}>{propsDataDL.length}개 단어</Typography>
          </View>
         <AntDesign name='right' size={20} color='#000'/>
        </TouchableOpacity >
        <TouchableOpacity 
          style={styles.select}
          onPress={()=>{
            props.navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { data: propsDataMQ, sortko: '공통(기초) M~Q' })
          }}
        >
          <View style={{width:'40%', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Typography fontSize={18} fontWeightIdx={1}>M ~ Q</Typography> 
            <Typography fontSize={12}>{propsDataMQ.length}개 단어</Typography>
          </View>
         <AntDesign name='right' size={20} color='#000'/>
        </TouchableOpacity >
        <TouchableOpacity 
          style={styles.select}
          onPress={()=>{
            props.navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { data: propsDataRW, sortko: '공통(기초) R~W' })
          }}
        >
          <View style={{width:'40%', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Typography fontSize={18} fontWeightIdx={1}>R ~ W</Typography> 
            <Typography fontSize={12}>{propsDataRW.length}개 단어</Typography>
          </View>
         <AntDesign name='right' size={20} color='#000'/>
        </TouchableOpacity >
        <TouchableOpacity 
          style={styles.select}
          onPress={()=>{
            props.navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { data: propsDataETC, sortko: '공통(기초) 그외' })
          }}
        >
          <View style={{width:'40%', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <Typography fontSize={18} fontWeightIdx={1}>그외</Typography> 
            <Typography fontSize={12}>{propsDataETC.length}개 단어</Typography>
          </View>
         <AntDesign name='right' size={20} color='#000'/>
        </TouchableOpacity >
       
      </View>
      
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
    width:'100%', 
    height:70,
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

