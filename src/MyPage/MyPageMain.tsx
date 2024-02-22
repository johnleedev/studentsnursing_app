import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncGetItem from '../AsyncGetItem'
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import axios from 'axios';
import MainURL from "../../MainURL";
import MainVersion from '../../MainVersion';
import { Title } from '../Components/Title';
import { ButtonBox } from '../Components/ButtonBox';

function MyPageMain (props: any) {


  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const profileToggleModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(true);
  const [userName, setUserName] = useState('');
  const [userSchool, setUserSchool] = useState('');
  const [userSchNum, setUserSchNum] = useState('');

  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      axios.get(`${MainURL}/mypage/getprofile/${data?.userAccount}`).then((res) => {
       setUserName(res.data[0].userName);
       setUserSchool(res.data[0].userSchool);
       setUserSchNum(res.data[0].userSchNum);
      });
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    asyncFetchData();
  }, [isProfileModalVisible, refresh]);

  const changeProfile = async () => {
    axios
      .post(`${MainURL}/mypage/changeprofile`, {
        userAccount : asyncGetData.userAccount,
        userName: userName, userSchool: userSchool, 
        userSchNum : userSchNum
      })
      .then((res) => {
        if (res.data === true) {
          AsyncStorage.setItem('name', userName);
          AsyncStorage.setItem('school', userSchool);
          AsyncStorage.setItem('schNum', userSchNum);
          Alert.alert('입력되었습니다.');
          profileToggleModal();
        } else {
          Alert.alert(res.data)
        }
      })
      .catch(() => {
        console.log('실패함')
      })
  };
 
  const handleLogout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('account');
    AsyncStorage.removeItem('name');
    AsyncStorage.removeItem('school');
    AsyncStorage.removeItem('schNum');
    AsyncStorage.removeItem('URL');
    Alert.alert('로그아웃 되었습니다.');
    props.navigation.replace("Navi_Login")
  };

  const deleteAccount = () => {
    props.navigation.navigate("DeleteAccount")
  };
  


  return (
    <View style={{flex:1, backgroundColor:'#fff'}}>

      <Title title='마이페이지' enTitle='My Page' />
      
      <Divider height={2} />

      <ScrollView style={styles.container}>
      
      <View style={styles.section}>
        <Typography fontSize={18} fontWeightIdx={1}>기본 정보</Typography>
        <TouchableOpacity style={{position:'absolute', top:10, right:10, padding:15}}
         onPress={profileToggleModal}
        >
          <AntDesign name='setting' size={20} color='#000'/>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isProfileModalVisible}
          onRequestClose={profileToggleModal}
        >
          <View style={{ width: '100%', position: 'absolute', top:80, borderRadius: 20, backgroundColor: 'white', 
                        padding: 20}}>
            <Typography marginBottom={10} fontWeightIdx={1}>프로필 편집</Typography>
            <TouchableOpacity style={{position:'absolute', top:5, right:10, padding:15}}
              onPress={profileToggleModal}
              > 
                <AntDesign name='close' size={20} color='#000'/>
            </TouchableOpacity>
            <Divider height={3} marginVertical={10}/>
            
              <View style={styles.infoBox}>
                <Typography>이름: </Typography>
                <TextInput
                  style={styles.input}
                  placeholder="이름"
                  value={userName}
                  onChangeText={setUserName}
                /> 
              </View>
              <View style={styles.infoBox}>
                <Typography>학교: </Typography>
                <TextInput
                  style={styles.input}
                  placeholder="학교"
                  value={userSchool}
                  onChangeText={setUserSchool}
                /> 
              </View>
              <View style={styles.infoBox}>
                <Typography>학번: </Typography>
                <TextInput
                  style={styles.input}
                  placeholder="이름"
                  value={userSchNum}
                  onChangeText={setUserSchNum}
                /> 
              </View>
              <View style={{height:100, justifyContent:'flex-end'}}>
                <ButtonBox leftText='취소' leftFunction={profileToggleModal} rightText='변경' rightFunction={changeProfile} />
              </View>
          </View>
        </Modal>

        <View style={styles.infoBox}>
          <View style={styles.infoTextBox}>
            <Typography marginBottom={10} >
              <Entypo name="beamed-note" size={16} color="#000"/> 계정: {asyncGetData.userAccount}
            </Typography>
            <Typography marginBottom={10} >
              <Entypo name="beamed-note" size={16} color="#000"/> 이름: {asyncGetData.userName}
            </Typography>
            <Typography marginBottom={10} >
              <Entypo name="beamed-note" size={16} color="#000"/> 학교: {asyncGetData.userSchool}
            </Typography>
            <Typography marginBottom={10} >
              <Entypo name="beamed-note" size={16} color="#000"/> 학번: {asyncGetData.userSchNum}
            </Typography>
            <Typography marginBottom={10} >
              <Entypo name="beamed-note" size={16} color="#000"/> 로그인 방식: {asyncGetData.userURL}
            </Typography>
          </View>
        </View>
      </View>


      <Divider height={2}/>

      <View style={styles.section}>
        <Typography fontSize={18} marginBottom={10} fontWeightIdx={1}>기타</Typography>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
            props.navigation.navigate('Navi_Notifi', {screen: 'Notice'});
        }}>
          <Feather name="clipboard" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >공지사항</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
           props.navigation.navigate("Question");
        }}>
          <AntDesign name="questioncircleo" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >문의하기</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
           props.navigation.navigate("Report");
        }}>
          <MaterialCommunityIcons name="bullhorn-variant-outline" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >신고하기</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
           props.navigation.navigate("Advertising");
        }}>
          <MaterialCommunityIcons name="advertisements" size={20} color="#000" style={{marginRight:13}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >광고 및 제휴</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
          props.navigation.navigate("Policy");
        }}>
          <MaterialIcons name="policy" size={20} color="#000" style={{marginRight:13}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >약관 및 정책</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
          props.navigation.navigate("PersonInfo");
        }}>
          <Entypo name="info" size={20} color="#000" style={{marginRight:12}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >개인정보처리방침</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={()=>{
          props.navigation.navigate("BusinessInfo");
        }}>
          <FontAwesome name="building-o" size={20} color="#000" style={{marginRight:15}}/>
          <View style={styles.bottomButtonRow}>
            <Typography color='#555' >사업자정보</Typography>
            <AntDesign name="right" size={15} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15 }}
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Typography color='#8C8C8C'>로그아웃</Typography>
        </TouchableOpacity> 
      </View>

      <TouchableOpacity
        hitSlop={{ top: 15, bottom: 15 }}
        style={styles.deleteAccountContainer}
        onPress={deleteAccount}
      >
        <View style={{padding:5, borderWidth:1, borderColor:'#EAEAEA', borderRadius:5}}>
          <Typography fontSize={10} fontWeightIdx={1} color='#8C8C8C'>회원탈퇴를 하시려면 여기를 눌러주세요</Typography>
        </View>
      </TouchableOpacity> 

      <View style={{marginBottom: 30, alignItems:'flex-end', marginRight:20}}>
                                     {/* MainURL확인하기 & splash.tsx & result.tsx(Login) 확인하기 */}
        <Typography fontSize={10} color='#8C8C8C'>버전정보 : {MainVersion}</Typography>
      
      </View>

    </ScrollView>
   
    <View style={ isProfileModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  section : {
    padding: 20,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoImgBox: {
    width: 100,
    height: 100,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoImg: {
    width: 80,
    height: 80,
  },
  infoTextBox: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35
  },
  bottomButtonRow: {
    flex:1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  logoutContainer : {
    flex: 1,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteAccountContainer : {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 20,
    height: 50,
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },
  inputBox : {
    flexDirection:'row', 
    alignItems:'center', 
    height:60
  },
  input: {
    width:'85%',
    height: 40,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#333',
  }
});

export default MyPageMain;
