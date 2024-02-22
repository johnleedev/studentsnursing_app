import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Navi_Home from './Navi_Home';
import Navi_Board from './Navi_Board';
import Navi_MyPage from './Navi_MyPage';
import Navi_Study from './Navi_Study';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import axios from "axios";
import MainURL from "../MainURL";
import AsyncGetItem from './AsyncGetItem'
import { useRoute } from '@react-navigation/native';
import MainVersion from '../MainVersion';


const Tab = createBottomTabNavigator();

export default function Main (props : any) {
  
  const route : any = useRoute();
  
  // checkNotificationPermission
  checkNotifications().then(({status, settings}) => {
    if (status === 'denied' || status === 'blocked'){
      requestNotifications(['alert', 'sound']);
    } else if (status === 'granted') {
      return
    } else {
      return
    }
  })

  // AsyncGetData
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      takeFireBaseToken(data?.userAccount);
      versionCheck(data?.userAccount);
    } catch (error) {
      console.error(error);
    }
  };
  
  // firebase notification 토큰 발급 후 저장
  async function takeFireBaseToken(account : string | null | undefined) {
    const token = await messaging().getToken();    // fcm 토큰 저장하기
    axios
      .post(`${MainURL}/notification/savefirebasetoken`, {
        token : token, userAccount: account
      })
      .then((res) => {return})
      .catch((error) => {
        console.log(error);
      });
  }

  // 앱실행시 버전 확인
  function versionCheck (account : string | null | undefined) {
    axios
    .post(`${MainURL}/appversioncheck`, {
      userAccount: account, version: MainVersion,
    })
    .then((res) => {return})
    .catch((error) => {
      console.log(error);
    });
  }

  // 앱실행시 접속수 증가시키기
  const appUseCount = () => {
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().slice(0, 10);
    axios
      .post(`${MainURL}/appusecount`, {
        date : currentDate
      })
      .then((res) => {return})
      .catch((error) => {
        console.log(error);
      });
  }
     
  useEffect(()=>{
    asyncFetchData();
    appUseCount();
  }, []); 

  return (
    <Tab.Navigator 
      sceneContainerStyle = {Platform.OS === 'android' ? styles.android : styles.ios}
      screenOptions={{
        headerShown : false,
        tabBarShowLabel : false,
        tabBarStyle: Platform.OS === 'android' ? styles.barStyle_android : styles.barStyle_ios,
        tabBarActiveTintColor : '#CC5A57',
        unmountOnBlur: true
      }}
    >
      <Tab.Screen name="Navi_Home" component={Navi_Home}
        options={{
          tabBarIcon:({focused})=> 
          <Ionicons name="home" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
      <Tab.Screen  name='Navi_Study' component={Navi_Study}
        options={{
          tabBarIcon:({focused})=> 
          <Ionicons name="document-text-outline" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
      <Tab.Screen name='Navi_Board' component={Navi_Board}
        options={{
          tabBarIcon:({focused})=> 
          <Ionicons name="list" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
      <Tab.Screen name='Navi_MyPage' component={Navi_MyPage}
        options={{
          tabBarIcon:({focused})=> 
          <Ionicons name="person" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
  android: {
    backgroundColor: '#000',
  },
  ios : {
    backgroundColor: '#000',
    paddingTop: getStatusBarHeight()
  },
  barStyle_android: {
    height: 70,
    padding: 5,
    backgroundColor: '#fff',
    elevation: 3,
    borderTopColor: '#8C8C8C',
    borderTopWidth: 0.5,
    paddingBottom: 10
  },
  barStyle_ios : {
    height: 70,
    padding: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingBottom: 10
  }
});



