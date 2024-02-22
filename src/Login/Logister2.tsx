import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, Platform, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import MainURL from "../../MainURL";
import AsyncSetItem from '../AsyncSetItem'
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';





function Logister2 (props : any) {

  const [isSchoolModalVisible, setSchoolModalVisible] = useState(false);
  const schoolToggleModal = () => {
    setSchoolModalVisible(!isSchoolModalVisible);
  };

  const [isSchNumModalVisible, setSchNumModalVisible] = useState(false);
  const schNumToggleModal = () => {
    setSchNumModalVisible(!isSchNumModalVisible);
  };
  
  const routeDataSet = () => {
    if(props.route.params === null || props.route.params === undefined) {
      return
    } else {
      const routeData = props.route.params.data;
      setRouteData(routeData);
      setRefreshToken(routeData.refreshToken);
      setUserAccount(routeData.email);
      setUserURL(routeData.userURL);
      {
        routeData.name && setUserName(routeData.name);
      }
    }
  }

  useEffect(()=>{
    routeDataSet();
  }, [])

  const [routeData, setRouteData] = useState({});
  const [refreshToken, setRefreshToken] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [userName, setUserName] = useState('');
  const [userSchool, setUserSchool] = useState('');
  const [userSchNum, setUserSchNum] = useState('');
  const [userURL, setUserURL] = useState('');
  
  const univercitys1 = ["KC대", "가톨릭대", "경희대", "고려대", "삼육대", "서울대", "성신여대", "연세대", "이화여대", "중앙대", "한국성서대", "한양대"]
  const univercitys2 = ["가천대", "대진대", "수원대", "산경대", "신한대", "아주대", "을지대(성남)", "인천가톨릭대", "인하대", "차의과대", "평택대", "한세대"]
  const univercitys3 = ["간호사관학교", "건국대", "건양대", "공주대", "극동대", "꽃동네대", "나사렛대", "남서울대", "대전대", "단국대", "배재대", "백석대", "상명대", "선문대", 
                       "세명대", "순천향대", "우송대", "을지대(대전)", "유원대", "중부대", "중원대", "청주대", "청운대", "충남대", "충북대", "한남대", "한국교통대", "한서대", "한성대", "호서대"]
  const univercitys4 = ["가톨릭관동대", "강릉원주대", "강원대", "삼척강원대", "경동대", "상지대", "원주연세대", "한림대"]
  const univercitys5 = ["경북대", "계명대", "대구가톨릭대", "대구대", "대구한의대", "경운대", "경일대", "경주대", "국립안동대", "김천대", "동국대", "동양대", "위덕대"]
  const univercitys6 = ["가야대", "경남과기대", "경남대", "경상대", "경성대", "고신대", "동명대", "동서대", "동아대", "동의대", "부경대", "부산가톨릭대", "부산대", 
                        "영산대", "창신대", "창원대", "신라대", "울산대", "인제대", "한국국제대"]
  const univercitys7 = ["광주대", "광주여대", "남부대", "동신대", "목포대", "목포가톨릭대",  "송원대", "세한대",  "순천대", "전남대", "조선대", "호남대", "군산대", 
                        "예수대", "우석대", "원광대", "전북대", "전주대", "초당대", "한일장신대", "호원대"]
  const univercitys8 = ["제주대"]
  
  const sch_num = ["25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "~10"]


  // 회원가입하기 함수
  const handleSignup = () => {

    const userData = {
      ...routeData,
      userSchool: userSchool,
      userSchNum: userSchNum,
    }
     
    axios
      .post(`${MainURL}/login/logisterdo`, {
        userData : userData
      })
      .then((res) => {
        if (res.data === userAccount) {
          Alert.alert('회원가입이 완료되었습니다!');
          AsyncSetItem(refreshToken, userAccount, userName, userSchool, userSchNum, userURL);
          props.navigation.navigate('Result');
        } else {
          Alert.alert('다시 시도해 주세요.');
        }
      })
      .catch(() => {
        console.log('실패함');
      });
  };

  const alertSignup = () => { 
    Alert.alert('중요 공지', '간호대학생들은, 효율적인 어플 운영을 위해 회원님들의 정확한 프로필을 필요로 합니다. 가입된 정보가 사실과 다를 경우, 어플 사용에 제한이 있을 수 있습니다.', [
      { text: '가입 취소', onPress: () => { return }},
      { text: '확인', onPress: () => handleSignup() }
    ]);
  }
  
  const alertPageOut = () => { 
    Alert.alert('작성한 모든 내용이 지워집니다.', '나가시겠습니까?', [
      { text: '취소', onPress: () => { return }},
      { text: '나가기', onPress: () => handlePageOut() }
    ]);
  }

  const handlePageOut = () => {
    setUserAccount('');
    setUserName('');
    setUserSchool('');
    setUserSchNum('');
    props.navigation.navigate("Login");
  };

  // Logister 페이지로 전환
  const handleLogister = () => {
    userSchool && userSchNum
    ? alertSignup() 
    : Alert.alert('모든 항목을 선택해주세요')
  };

  const [currentTab, setCurrentTab] = useState(1);

  interface SelectMenuProps {
    tabNum : number;
    title: string;
  }
  const SelectMenu: React.FC<SelectMenuProps> = ({ tabNum, title}) => {
    return (
      <TouchableOpacity
       style={{width:70, alignItems:'center', paddingTop:10}}
       onPress={() => setCurrentTab(tabNum)}
     >
       <Typography fontSize={14} color={currentTab === tabNum ? '#333' : '#8B8B8B'}>{title}</Typography>
       {
         currentTab === tabNum
         ? <View style={{width:60, height:2, backgroundColor:'#333', marginTop:10}}></View>
         : <View style={{width:60, height:2, backgroundColor:'#fff', marginTop:10}}></View>
       }
     </TouchableOpacity>
    )    
  };

  interface SchoolBoxProps {
    item : string[];
  }

  const SchoolsBox : React.FC<SchoolBoxProps> = ({item}) => (
    <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap:'wrap', marginBottom:20}}>
      {
        item.map((item:any, index:any)=>{
          return(
            <TouchableOpacity 
              key={index} 
              onPress={()=>{
                setUserSchool(item);
                schoolToggleModal();
              }} 
              style={{width: '32%', height: 50, borderWidth:1, borderColor: '#EAEAEA'}}
              >
                <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center',backgroundColor: '#fff'}}>
                  <Typography fontWeightIdx={1} color='#333' fontSize={13}>{item}</Typography>
                </View>
            </TouchableOpacity> 
          )
        })
      }
    </View>
  )

  return (
    <View style={Platform.OS === 'android' ? styles.android : styles.ios}>
      <View style={{flex:1, backgroundColor:'#fff'}}>

        <View style={{padding:20, alignItems: 'center', marginTop: 10, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              props.navigation.goBack();
            }}
            >
            <EvilIcons name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Typography>회원가입</Typography>
        </View>

        <Divider/>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}
          style={{flex:1}}
        >
        <ScrollView style={styles.container}>
       
          <View style={{marginBottom: 20}}>
            <View style={{flexDirection:'row'}}>
              <View style={{width:40, height:50, alignItems: 'center', marginBottom:10}}>
                <Typography fontSize={24} fontWeightIdx={1} color='#ccc'>01</Typography>  
              </View>
              <View style={{marginHorizontal:10}}>
                <View style={{width:40, height:15}}></View>
                <View style={{width:40, height:2, backgroundColor: '#ccc'}}></View>
              </View>
              <View style={{width:40, height:50, alignItems: 'center'}}>
                <Typography fontSize={24} fontWeightIdx={1}>02</Typography>  
              </View>
            </View>
            <Typography fontSize={22} fontWeightIdx={1}>
              마지막으로 재학중인{'\n'}
              학교와 학번을 알려주세요.
            </Typography>
          </View>
          
          <View>
            {/* 학교선택 */}
            
            <TouchableOpacity
              onPress={schoolToggleModal}
              style={{height:70}}
            >
              <View style={{flexDirection:'row', width: '90%', alignItems:'center'}}>
                <Typography color='#8C8C8C' fontWeightIdx={1}>학교 <Typography color='#E94A4A'>*</Typography></Typography>
                <View style={[styles.input, {width: '88%'}]}>
                  <Typography fontSize={14} color='#333' fontWeightIdx={1}>
                    {userSchool === '' ? '재학 중인 학교를 선택해 주세요' : userSchool}
                  </Typography>
                </View>
                <AntDesign name="down" size={12} color="black"/> 
              </View>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isSchoolModalVisible}
              onRequestClose={schoolToggleModal}
            >
               <View style={{ width: '100%', height:'60%', position: 'absolute', bottom:0, borderRadius: 20, backgroundColor: 'white', 
                             padding: 20}}>
                <Typography marginBottom={10}>학교선택</Typography>
                <Divider height={3} marginVertical={5}/>
                
                <View style={{width:'100%', flexDirection: 'row', alignItems: 'flex-start', paddingLeft:10,
                      borderBottomWidth:1, borderBottomColor:"#EFEFEF", marginBottom:20}}>
                    <ScrollView horizontal>
                    <SelectMenu tabNum={1} title='서울'/>
                    <SelectMenu tabNum={2} title='인천경기'/>
                    <SelectMenu tabNum={3} title='대전충청'/>
                    <SelectMenu tabNum={4} title='강원'/>
                    <SelectMenu tabNum={5} title='대구경북'/>
                    <SelectMenu tabNum={6} title='부산경남'/>
                    <SelectMenu tabNum={7} title='광주전라'/>
                    <SelectMenu tabNum={8} title='제주'/>
                    </ScrollView>
                </View>
                <ScrollView>
                { currentTab === 1 && <SchoolsBox item={univercitys1}/> } 
                { currentTab === 2 && <SchoolsBox item={univercitys2}/> } 
                { currentTab === 3 && <SchoolsBox item={univercitys3}/> } 
                { currentTab === 4 && <SchoolsBox item={univercitys4}/> } 
                { currentTab === 5 && <SchoolsBox item={univercitys5}/> } 
                { currentTab === 6 && <SchoolsBox item={univercitys6}/> } 
                { currentTab === 7 && <SchoolsBox item={univercitys7}/> } 
                { currentTab === 8 && <SchoolsBox item={univercitys8}/> } 
                </ScrollView>             
              </View>
            </Modal>

            {/* 학번 선택 */}
            <TouchableOpacity
                onPress={schNumToggleModal}
                style={{height:70}}
              >
              <View style={{flexDirection:'row', width: '90%', alignItems:'center'}}>
                <Typography color='#8C8C8C' fontWeightIdx={1}>학번 <Typography color='#E94A4A'>*</Typography></Typography>
                <View style={[styles.input, {width: '88%'}]}>
                  <Typography fontSize={14} color='#333' fontWeightIdx={1}>
                    {userSchNum === '' ? '학번을 선택해 주세요' : userSchNum}
                  </Typography>
                </View>
                <AntDesign name="down" size={12} color="black"/> 
              </View>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isSchNumModalVisible}
              onRequestClose={schNumToggleModal}
            >
              <View style={{ width: '100%', position: 'absolute', bottom:0, borderRadius: 20, backgroundColor: 'white', 
                            padding: 20}}>
                  <Typography marginBottom={10}>학번선택</Typography>
                  <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap:'wrap', }}>
                  {
                    sch_num.map((item, index)=>{
                      return(
                        <TouchableOpacity 
                          key={index}   
                          onPress={()=>{
                            setUserSchNum(item);
                            schNumToggleModal();
                          }} 
                          style={{width: '32%', height: 50, borderWidth:1, borderColor: '#EAEAEA'}}
                          >
                            <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center',
                              backgroundColor: item === '청소년' ? '#EAEAEA' : '#fff'}}>
                              <Typography color='#333' fontSize={13} fontWeightIdx={1}>{item}</Typography>
                            </View>
                        </TouchableOpacity> 
                      )
                    })
                  }
                  </View>
              </View>
            </Modal>

          </View>
          
        </ScrollView>
        </KeyboardAvoidingView>

         {/* 하단 버튼 */}
         <View style={{padding:20, marginBottom:5}}>
            <TouchableOpacity 
              onPress={handleLogister}
              style={
                userSchool && userSchNum ? [styles.nextBtnBox, { backgroundColor: 'black'}] 
                : [styles.nextBtnBox, { backgroundColor: 'gray'}]
              }
              >
              <Text style={styles.nextBtnText}>가입완료</Text>
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={alertPageOut}>
                <Text style={styles.linkButton}>나가기</Text>
              </TouchableOpacity>
            </View>
          </View>

      </View>

      <View style={ isSchoolModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>
      <View style={ isSchNumModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>

    </View>
  );
};



const styles = StyleSheet.create({
  android: {
    flex: 1,
    backgroundColor: '#333',
  },
  ios : {
    flex: 1,
    backgroundColor: '#333',
    paddingTop: getStatusBarHeight(),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24
 },
 backButton: {
  position:'absolute',
  top: 20,
  left: 20,
  width: 30,
  height: 30,
},
  inputContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#DFDFDF',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: '#333'
  },  
  message: {
    marginBottom: 10,
  },
  success: {
    color: '#47C83E',
  },
  error: {
    color: '#F15F5F',
  },
  errorText: {
    color: '#F15F5F',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButton: {
    color: '#333',
    textDecorationLine: 'underline',
  },
  nextBtnBox: {
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },
});

export default Logister2;
