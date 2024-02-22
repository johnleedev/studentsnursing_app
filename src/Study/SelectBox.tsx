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

export default function SelectBox (props : any) {
  const sort = props.route.params.sort;
  const [propsData, setPropsData] = useState< WordsProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(true);

  const fetchPosts = () => {
    axios.get(`${MainURL}/study/getwordshorthardallstudy`)
    .then((res) => {
      if(res.data) {
        setIsResdataFalse(false);
        let data: any = [...res.data];
        setPropsData(data);
      } else {
        setIsResdataFalse(true);
      }
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const startingLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 
                            'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const RenderSection = ({ navigation, letter, data }: { navigation: any; letter: string; data: WordsProps[] }) => (
    <TouchableOpacity
      key={letter} // 고유한 키 할당
      style={styles.select}
      onPress={() => {
          data.length > 50
          ? navigation.navigate('SelectBoxDetail', { data, sort, letter })
          : navigation.navigate(sort === 'Study' ? 'Study' : 'Quiz', { data })
      }}
    >
      <View style={{ width: '70%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontSize={18} fontWeightIdx={1}>{letter}</Typography>
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
        <Typography>선택</Typography>
      </View>

      <Divider />
 
    { isResdataFalse
      ?  
      <View style={{flex:1, width:'100%', height:'100%'}}>
        <Loading /> 
      </View>
     : 
      <ScrollView style={[styles.section]}>
        <View style={{width:'100%', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
          {
            startingLetters.map((letter:any, index:any) => {
              const copy = propsData.filter(word => word.short_name.toLowerCase().startsWith(letter.toLowerCase()));
              return (
                <RenderSection key={index} navigation={props.navigation} letter={letter} data={copy}/>
              )
            })
          }
          <RenderSection navigation={props.navigation} letter={'그외'} 
            data={propsData.filter(word => !/^[a-w]/i.test(word.short_name))}/>
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

