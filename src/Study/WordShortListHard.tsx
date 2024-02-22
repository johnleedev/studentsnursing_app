import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image } from 'react-native';
import { Typography } from '../Components/Typography';
import axios from 'axios';
import MainURL from "../../MainURL";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Title } from '../Components/Title';
import { Divider } from '../Components/Divider';
import SelectDropdown from 'react-native-select-dropdown'
import Loading from '../Components/Loading';

export default function WordShortListHard (props : any) {
  
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
    axios.get(`${MainURL}/study/getwordshorthardall/${page}`)
    .then((res) => {
      if(res.data) {
        setIsResdataFalse(false);
        let data: any = [...res.data.items];
        let wordsCopy = [...words, ...data] 
        wordsCopy.sort((a: any, b: any) => a.short_name > b.short_name ? 1 : -1);
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
    axios.get(`${MainURL}/study/getwordshorthardsearch/${searchAlphabet}`)
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

  const renderPreview = (content : string) => {
    if (content?.length > 12) {
      return content.substring(0, 12) + '...';
    }
    return content;
  };


  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const detailToggleModal = (item:any) => {
    setSelectedItem(item);
    setDetailModalVisible(!isDetailModalVisible);
  };

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
            <Typography fontSize={12} color='#8C8C8C'>총 8389개의 단어가 있습니다.</Typography>
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
                    <View key={index}
                      style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center',
                                  borderWidth:1, borderRadius:10, borderColor:'#DFDFDF', height:70, marginVertical: 10
                      }}>
                      <View style={{width:'30%', justifyContent:'flex-start', flexDirection:'row', alignItems:'center'}}>
                        <Image
                          source={require("../images/study/greenmiddle.png")}
                          style={{width:10, height:20, resizeMode:'cover', opacity:0.5, marginRight:5}}>
                        </Image>
                        <Typography>{item.short_name}</Typography>
                      </View>
                      {
                        item.name_en.length > 12 || item.name_ko.length > 12
                        ? 
                        <TouchableOpacity 
                          style={{width:'70%', flexDirection:'row', justifyContent:'space-between'}}
                          onPress={()=>{detailToggleModal({ short_name: item.short_name, name_ko: item.name_ko, name_en : item.name_en })}}
                        >
                          <View style={{width: '90%', alignItems:'flex-end'}}>
                            <Typography>{renderPreview(item.name_en)}</Typography>
                            <Typography>{renderPreview(item.name_ko)}</Typography>
                          </View>
                          <View style={{width:'10%', alignItems:'flex-end'}}>
                              <AntDesign name='right'/>
                          </View>
                        </TouchableOpacity>
                        :
                        <View style={{width: '70%', alignItems:'flex-end'}}>
                          <Typography>{item.name_en}</Typography>
                          <Typography>{item.name_ko}</Typography>
                        </View>
                      }
                    </View>
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

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.studyButton, { bottom: 80}]} 
        onPress={()=>{
          props.navigation.navigate('SelectBox', { data: words, sort: 'Study' })
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
          props.navigation.navigate('SelectBox', { data: words, sort: 'Quiz' })
        }}
      >
        <Image
          source={require("../images/study/orangemiddle.png")}
          style={{width:10, height:20, resizeMode:'cover', opacity:0.5, marginRight:5}}>
        </Image>
        <Typography color='#333' fontWeightIdx={1} fontSize={14}>문제풀기 </Typography>
        <AntDesign name='right' color='#333'/>
      </TouchableOpacity>

      <Modal
          animationType="slide"
          transparent={true}
          visible={isDetailModalVisible}
          onRequestClose={detailToggleModal}
        >
          <View style={{ width: '100%', position: 'absolute', top:200, borderRadius: 20, backgroundColor: 'white', 
                        padding: 20}}>
            <Typography marginBottom={10} fontWeightIdx={1}>{selectedItem?.short_name}</Typography>
            <TouchableOpacity style={{position:'absolute', top:5, right:10, padding:15}}
              onPress={detailToggleModal}
              > 
                <AntDesign name='close' size={20} color='#000'/>
            </TouchableOpacity>
            <Divider height={3} marginVertical={10}/>
              <Typography marginBottom={10}>{selectedItem?.name_en}</Typography>
              <Typography marginBottom={10}>{selectedItem?.name_ko}</Typography>
          </View>
        </Modal>

        <View style={ isDetailModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>

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
    width:110,
    height:60,
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

