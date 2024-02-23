import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function SelectBox (props : any) {
  const sort = props.route.params.sort;
 
  const startingLetters = [
    {letter: 'A', length: 784}, {letter: 'B', length: 494},  {letter: 'C', length: 837}, {letter: 'D', length: 480}, {letter: 'E', length: 436}, 
    {letter: 'F', length: 303}, {letter: 'G', length: 258}, {letter: 'H', length: 390}, {letter: 'I', length: 497}, {letter: 'J', length: 55}, 
    {letter: 'K', length: 80}, {letter: 'L', length: 505}, {letter: 'M', length: 531}, {letter: 'N', length: 454}, {letter: 'O', length: 195}, 
    {letter: 'P', length: 531}, {letter: 'Q', length: 32}, {letter: 'R', length: 267}, {letter: 'S', length: 370}, {letter: 'T', length: 370}, 
    {letter: 'U', length: 93}, {letter: 'V', length: 196}, {letter: 'W', length: 76}, {letter: 'X', length: 31}, {letter: 'Y', length: 11}, 
    {letter: 'Z', length: 11}, {letter: '그외', length: 152},
  ];

  const RenderSection = ({ navigation, letter, length }: { navigation: any; letter: string; length: number }) => (
    <TouchableOpacity
      key={letter} // 고유한 키 할당
      style={styles.select}
      onPress={() => {
          length > 60
          ? navigation.navigate('SelectBoxDetail', { length, sort, letter })
          : navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { length, sortko: letter })
      }}
    >
      <View style={{ width: '70%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontSize={18} fontWeightIdx={1}>{letter}</Typography>
        <Typography fontSize={12}>{length}개 단어</Typography>
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
        <Typography>{sort === 'Study' ? '학습하기' : '문제풀기'} 선택 1</Typography>
      </View>

      <Divider />
 
      <View style={{width:'100%', alignItems:'center', marginVertical:10}}>
        <Typography fontSize={14} color='#8C8C8C'>* 편의상 알파벳별로 구분하였습니다.</Typography>
      </View>
      
      <ScrollView style={{paddingHorizontal:20}}>
        <View style={{width:'100%', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
          {
            startingLetters.map((item:any, index:any) => {
              return (
                <RenderSection key={index} navigation={props.navigation} letter={item.letter} length={item.length}/>
              )
            })
          }
        </View>
        <View style={{height:50}}></View>
      </ScrollView>
    
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

