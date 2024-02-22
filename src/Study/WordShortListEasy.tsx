import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Modal } from 'react-native';
import { Typography } from '../Components/Typography';
import axios from 'axios';
import MainURL from "../../MainURL";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import SelectDropdown from 'react-native-select-dropdown'
import Loading from '../Components/Loading';
import SelectBox from './SelectBoxShort';

export default function WordShortListEasy (props : any) {

  interface WordsProps {
    id: number;
    sort : string;
    short_name : string;
    name_en : string;
    name_ko : string;
  }

  const [words, setWords] = useState<WordsProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);
  const [sort, setSort] = useState('SORT');
  const [wordsLength, setWordsLength] = useState(0);
  
  const fetchPosts = () => {
    axios.get(`${MainURL}/study/getwordshorteasyall/${sort}`)
    .then((res) => {
      if(res.data) {
        setIsResdataFalse(false);
        let data: any = [...res.data];
        setWordsLength(data.length);
        data.sort((a: any, b: any) => a.short_name > b.short_name ? 1 : -1);
        setWords(data);
        setWordsViewList(data);
      } else {
        setIsResdataFalse(true);
      }
    });
  };

  useEffect(() => {
    fetchPosts();
  }, [sort]);
  
  // 종류 ------------------------------------------------------------------------------------------
  // 응급실 ER, 호흡기내과 PD, 순환기내과 CV, 소화기내과 GI, 신경계 NR, 분만실 DR, 중환자실 ICU, 흉부외과 CS, 감염내과 IMI, 
  const optionsSort = ["공통", "진료과", "응급실", "호흡기내과", "순환기내과", "소화기내과", "신경계", "분만실", "중환자실", "흉부외과", "감염내과"];
  const handleSortChange = (selected : any) => {
    setWordsViewList([]);
    setWordsLength(0);
    if (selected === "공통") {setSort('COMMON');}
    else if (selected === "진료과") {setSort('SORT');}
    else if (selected === "응급실") {setSort('ER');}
    else if (selected === "호흡기내과") {setSort('PD');}
    else if (selected === "순환기내과") {setSort('CV');}
    else if (selected === "소화기내과") {setSort('GI');}
    else if (selected === "신경계") {setSort('NR');}
    else if (selected === "분만실") {setSort('DR');}
    else if (selected === "중환자실") {setSort('ICU');}
    else if (selected === "흉부외과") {setSort('CS');}
    else if (selected === "감염내과") {setSort('IMI');}
  };
  
  // 검색 ------------------------------------------------------------------------------------------

  const [wordsViewList, setWordsViewList] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');  
  const [isInputValue, setIsInputValue] = useState<boolean>(false);  
  const [isResdataFalse2, setIsResdataFalse2] = useState<boolean>(false);

  const fetchPostsSearch = (searchAlphabet:string) => {
    setWordsViewList([]);
    axios.get(`${MainURL}/study/getwordshorteasysearch/${searchAlphabet}`)
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
      setIsInputValue(false);
      setIsResdataFalse2(false);
      setWordsViewList(words); 
    } 
    else {
      setIsInputValue(true);
      fetchPostsSearch(inputText);
    }
  };

  const handleResetPress = () => {
    setInputValue('');
    setIsInputValue(false);
    setIsResdataFalse2(false);
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

          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View style={styles.selectDropdown}>
              <Typography fontSize={14} color='#8C8C8C'>분류</Typography>
              <SelectDropdown
                data={optionsSort}
                onSelect={(selectedItem, index) => {
                  handleSortChange(selectedItem);
                }}
                defaultButtonText={optionsSort[1]}
                buttonStyle={{width:90, height:30, backgroundColor:'#fff'}}
                buttonTextStyle={{fontSize:12, fontWeight:'bold'}}
                dropdownStyle={{width:100, borderRadius:10}}
                rowStyle={{ width:100}}
                rowTextStyle={{fontSize:12, fontWeight:'bold'}}
              />
            </View>
            <View style={{width:'48%', alignItems:'flex-end', justifyContent:'center', paddingRight:10}}>
              <Typography fontSize={12} color='#8C8C8C' marginBottom={3}>총 {wordsLength}개의 단어가 있습니다</Typography>
              <Typography fontSize={12} color='#8C8C8C'>* 전체 601개</Typography>
            </View>
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
          
          {isInputValue && (
            <View style={{width:'100%', alignItems:'center', marginBottom:20}}>
              <Typography color='#8C8C8C' fontSize={12}>분류와 상관없이 전체 601개 단어 중에서 검색됩니다.</Typography>
            </View>
          )}
          
          <Divider/>

          <ScrollView>

          {
            wordsViewList.length === 0 && !isResdataFalse2
            ?
            <View style={{flex:1, width:'100%', height:150}}>
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
                          <Typography>{item.name_en}</Typography>
                          <Typography>{item.name_ko}</Typography>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
              </>
            }
            </>
          }
          
        </ScrollView>
      </View>
    
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.studyButton, { bottom: 70}]} 
        onPress={()=>{
          sort === 'COMMON' 
          ? props.navigation.navigate('SelectBoxShort', { data: words, sort: 'Study' })
          : props.navigation.navigate('Study', { data: words });
        }}
      >
        <Image
          source={require("../images/study/orangemiddle.png")}
          style={{width:10, height:20, resizeMode:'cover', opacity:0.5, marginRight:5}}>
        </Image>
        <Typography color='#333' fontWeightIdx={1} fontSize={14}>학습하기 </Typography>
        <AntDesign name='right' color='#333'/>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.studyButton, { bottom: 16}]} 
        onPress={()=>{
          sort === 'COMMON' 
          ? props.navigation.navigate('SelectBoxShort', { data: words, sort: 'Quiz' })
          : props.navigation.navigate('Quiz', { data: words });
        }}
      >
        <Image
          source={require("../images/study/orangemiddle.png")}
          style={{width:10, height:20, resizeMode:'cover', opacity:0.5, marginRight:5}}>
        </Image>
        <Typography color='#333' fontWeightIdx={1} fontSize={14}>문제풀기 </Typography>
        <AntDesign name='right' color='#333'/>
      </TouchableOpacity>

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
  studyButton: {
    width:100,
    height:50,
    borderWidth:1,
    borderColor:"#BDBDBD",
    borderRadius: 25,
    position: 'absolute',
    backgroundColor:'#fff',
    right: 16,
    padding: 12,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'center'
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },
});

