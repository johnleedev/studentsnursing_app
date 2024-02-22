import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
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

export default function Study (props : any) {
  
  const wordsList: WordsProps[] = props.route.params.data;
  const wordsLength = wordsList.length;
  const [isViewMeaning, setIsViewMeaning] = useState(Array(wordsList.length).fill(false));

  const handleIsViewMeaning = (index:number, boolean: boolean ) => {
    const copy = [...isViewMeaning];
    copy[index] = boolean;
    setIsViewMeaning(copy);
  }

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
        <Typography>학습하기</Typography>
      </View>

      <Divider />
      
      <ScrollView style={styles.section}>
        <View style={{width:'100%', alignItems:'flex-end', marginBottom:5, paddingRight:5}}>
          <Typography fontSize={14} color='#8C8C8C'>{wordsLength}개 단어</Typography>
        </View>
      {
        wordsList.map((item:any, index:any)=>{

          return ( 
            <View
              key={index} 
              style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:10}}
            >
              <View style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center',
                            borderWidth:1, borderRadius:10, borderColor:'#DFDFDF', height:70
                }}>
                <View style={{width:'30%', justifyContent:'flex-start', flexDirection:'row', alignItems:'center'}}>
                  <Image
                    source={require("../images/study/greenmiddle.png")}
                    style={{width:10, height:20, resizeMode:'cover', opacity:0.5, marginRight:5}}>
                  </Image>
                  <Typography>{item.short_name}</Typography>
                </View>
                
                <View style={{width:'70%', alignItems:'flex-end'}}>
                  { isViewMeaning[index] ?
                    <>
                    <Typography>{item.name_en}</Typography>
                    <Typography>{item.name_ko}</Typography>
                    </>
                    :
                    <TouchableOpacity 
                      style={{paddingVertical:10, paddingHorizontal:30, borderWidth:1, borderColor:'#EAEAEA', borderRadius:5}}
                      onPress={()=>{handleIsViewMeaning(index, !isViewMeaning[index])}}
                    >
                      <Typography color='#8C8C8C'>의미보기</Typography>
                    </TouchableOpacity>
                  }
                </View>
                
              </View>
            </View>
          )
        })
      }
      <View style={{height:50}}></View>
      </ScrollView>
      
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

