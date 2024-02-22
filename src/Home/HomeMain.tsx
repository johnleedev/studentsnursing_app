import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, 
        Alert, Linking, KeyboardAvoidingView, Platform, RefreshControl, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { Typography } from '../Components/Typography';
import AsyncGetItem from '../AsyncGetItem'
import { Title } from '../Components/Title';
import Swiper from 'react-native-swiper'
import MainImageURL from "../../MainImageURL";
import axios from 'axios';
import MainURL from "../../MainURL";
import SuggestionBoard from './SuggestionBoard';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { Divider } from '../Components/Divider';
import Clipboard from '@react-native-clipboard/clipboard';

function HomeMain(props : any) {

  // 스크롤뷰 리프레쉬
  const [refresh, setRefresh] = useState<boolean>(false);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 게시판 최신 글 가져오기
  const [posts, setposts] = useState<any>([]);
  const [advs, setAdvs] = useState<any>([]);
  const fetchPosts = () => {
    axios.get(`${MainURL}/board/posts/get`).then((res) => {
      let copy: any = [...res.data];
      copy.reverse();
      setposts(copy);
    });
    axios.get(`${MainURL}/home/getadvertise`).then((res) => {
      let copy: any = [...res.data];
      copy.reverse();
      setAdvs(copy);
    });
   };
  
  useEffect(() => {
    asyncFetchData();
    fetchPosts();
  }, [refresh]);


  // 이벤트 함수
  const handleevent = async () => {
    // Clipboard.setString('https://studentsclassic.page.link/3N7P')
    Alert.alert('초대링크가 복사되었습니다.')
  }  

  // 알림 허용 여부 확인
  const handleCheckNotifications = async () => {
    const check = await checkNotifications();
    if (check.status === 'denied' || check.status === 'blocked'){
      requestNotifications(['alert', 'sound']).then(()=>{
        if (check.status === 'denied' || check.status === 'blocked') {
          Alert.alert('알림을 허용해주세요', '', [
            { text: '취소', onPress: () => {return }},
            { text: '허용', onPress: () => Linking.openSettings() }
          ]);
        }
      })
    } else if (check.status === 'granted') {
      props.navigation.navigate("Navi_Notifi", {screen:"Notification", params: { userAccount: asyncGetData.userAccount }});
    } else {
      return
    }
  }  
  
  // background 상태일 때, 알림 받기
  useEffect(()=>{
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        props.navigation.navigate("Navi_Home", {screen:"Notification"});
      }
    });;
  }, []); 

  // quit 상태일 때, 알림 받기
  useEffect(()=>{
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        props.navigation.navigate("Navi_Home", {screen:"Notification"});
      }
    });;
  }, []); 

  // forground 상태일 때, 알림 받기
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        Toast.show({
          type: 'success',
          text1: remoteMessage.notification?.title,
          text2: remoteMessage.notification?.body,
          onPress() {
            props.navigation.navigate("Navi_Home", {screen:"Notification"});
          }
        })
      }
    });;
    return unsubscribe
  }, []);


  return (
    <View style={styles.container}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 100}
        style={{flex:1}}
      >
      <ScrollView 
        style={{flex:1}}
      >
        <View style={{height:320, backgroundColor:'#fff', padding:20}}>
          <View style={{width:'100%', height:70, flexDirection: 'row', justifyContent:'flex-end', marginBottom:5}}>
            <TouchableOpacity 
              hitSlop={{ top: 15, bottom: 15 }}
              onPress={handleevent}
            >
              <AntDesign name="sharealt" size={24} color="#000" style={{width: 30, marginRight: 5}}/>
            </TouchableOpacity>
            <TouchableOpacity 
              hitSlop={{ top: 15, bottom: 15 }}
              onPress={handleCheckNotifications}
            >
              <AntDesign name="bells" size={24} color="#000" style={{width: 30, marginRight: 5}}/>
            </TouchableOpacity>
          </View>  
          <View style={{position:'absolute', top:50, left:20, zIndex:9}}>
            <Typography color='#000' fontSize={20} marginBottom={5} fontWeightIdx={1}>간호전공 학생들의 </Typography>
            <Typography color='#000' fontSize={20} marginBottom={10} fontWeightIdx={1}>커뮤니티 플랫폼</Typography>
            <Typography color='#000' fontSize={12} marginBottom={5}>"간호대학생들"은</Typography>
            <Typography color='#000' fontSize={12} marginBottom={5}>모든 간호학 학생들을</Typography>
            <Typography color='#000' fontSize={12} marginBottom={5}>응원합니다.</Typography>
          </View>
          <View style={{width:'100%', flexDirection: 'row', justifyContent:'flex-end', }}>
            <Image
              source={require("../images/mainimage.png")}
              style={{width:230,height:220, resizeMode:'contain'}}>
            </Image>
          </View>
        </View>

        <Divider height={5} />

        {/* 광고란 */}
        <Divider height={2} />
          <View style={styles.advBox}>
            <Swiper 
                showsPagination={true}
                paginationStyle={{bottom:0}}
            >
              {
                advs?.map((item:any, index:any)=>{
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={()=>Linking.openURL(item.url)}
                    >
                      <View style={styles.advslide}>
                        <Image style={styles.advimg} source={{uri: `${MainImageURL}/images/advertise/${item.imageName}`}} />
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
            </Swiper>
          </View>
        <Divider height={5} />

        {/* 스터디 */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={{height:230, borderWidth:1, borderColor:'#8C8C8C', borderRadius:5}}
            activeOpacity={0.9}
            onPress={()=>{
              props.navigation.navigate('Navi_Study', {screen : 'Main'})
            }}
          >
              <ImageBackground 
               source={require("../images/desk.jpg")}
               style={{width:"100%",height:"100%", opacity:0.9}}
              >
                <View style={{padding:10, width:"100%",height:"100%"}}>
                  <View style={{backgroundColor:'#fff', width:'100%', padding:10, borderRadius:5}}>
                    <Typography marginBottom={10} fontWeightIdx={1}>간호전공 학생들을 위한 특별한 서비스</Typography>  
                    <Typography fontSize={14} fontWeightIdx={1} marginBottom={3}>간호술기, 의학약어, 의학용어를</Typography>
                    <Typography fontSize={14} fontWeightIdx={1} marginBottom={3}>일일이 찾아볼 필요 없이</Typography>
                    <Typography fontSize={14} fontWeightIdx={1}>쉽고 편하게 학습하세요</Typography>

                  </View>
                  <View style={{backgroundColor:'#fff', paddingHorizontal:10, paddingVertical:5, borderRadius:5,
                                position:'absolute', bottom:10, right:10, flexDirection:'row', alignItems:'center'}}>
                    <Typography fontWeightIdx={1}>스터디 바로가기</Typography>
                    <AntDesign name='right' style={{marginLeft:10}}/>
                  </View>                
                </View>
              </ImageBackground>
          </TouchableOpacity>
        </View>


        <Divider height={5} />

     
        <Title title='최신글' enTitle='Community'/>
        <View style={styles.section}>
          {/* 자유게시판 */}
          {
             posts.slice(0,3).map((item:any, index:any)=>{
                return(
                  <TouchableOpacity
                    key={index}
                    onPress={()=>{
                      props.navigation.navigate("Navi_Board")
                    }}
                  >
                    <View 
                      style={{borderWidth:1, borderColor:'#EAEAEA', borderRadius:10, padding:10, marginBottom:10}}
                    >
                      <Typography marginBottom={10} fontWeightIdx={1}>{item.title}</Typography>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Typography fontSize={14}><Ionicons name="eye-outline" size={14} color="black" /> {item.views} </Typography>
                        <Typography fontSize={14}><Feather name="thumbs-up" size={14} color="black" /> {item.isLiked} </Typography>
                        <Typography fontSize={14}><Ionicons name="chatbubble-ellipses-outline" size={14} color="black" /> {item.commentCount ? item.commentCount : '0' } </Typography>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
        </View>

        {/* 건의하기 게시판 */}
        <SuggestionBoard/>

        
    
      </ScrollView>
      </KeyboardAvoidingView>
     
    </View> 
   );
}
export default HomeMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding:20
  },
  topmenu: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  mainlogo: {
    width: 100,
    height: 50,
    resizeMode:'contain',
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    height: 30,
    margin: 12,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5
  },
  noticeBox : {
    height: 270,
    paddingVertical: 20,
  },
  slide: {
    alignItems: 'center',
  },
  img: {
    width: 320,
    height: 210,
    resizeMode:'contain',
  },
  advBox : {
    height: 95,
  },
  advslide: {
    alignItems: 'center',
  },
  advimg: {
    height: '100%',
    width: '100%',
    resizeMode:'contain',
  },
  button: {
    borderWidth:1,
    borderColor: '#8C8C8C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
});

const contents = StyleSheet.create({
  box: {
    width: '95%',
    backgroundColor: 'white',
    marginVertical : 10,
    padding: 15
  },
  titlebox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 35,
    height: 60,
    color: 'black'
  },
  title2: {
    fontSize: 18,
    letterSpacing: -0.3
  },
  imgbox: {
    height: 500,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    flex: 1,
    width: '100%',
    resizeMode: "cover",
    overflow: 'hidden',
    borderRadius : 10
  },
  contentBox: {
    backgroundColor: 'white'
  },
  contentTitleBox : {
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

