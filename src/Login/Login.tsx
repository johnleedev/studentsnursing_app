import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { login } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import axios from "axios";
import MainURL from '../../MainURL';
import AsyncSetItem from '../AsyncSetItem'
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import GoogleWebClientID from "./GoogleWebClientID";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Login (props : any) {
  
  // 카카오 로그인
  const signInWithKakao = async (): Promise<void> => {
    try {
      const token = await login();
      axios
          .post(`${MainURL}/login/login/kakao`, {
            AccessToken: token.accessToken,
          })
          .then((res: any)=>{
            if (res.data.isUser === true) {
              AsyncSetItem(res.data.refreshToken, res.data.userAccount, res.data.userName, res.data.userSchool, res.data.userSchNum, res.data.userURL);
              props.navigation.replace('Navi_Main');
            } else if (res.data.isUser === false) {
              props.navigation.navigate("Agree", {data: res.data});
            }
          }).catch((err : string)=>{
            console.log('kakao토큰요청_err :', err)
          });
    } catch (err) {
      console.error('login err', err);
    }
  };

  // 네이버 로그인
  const consumerKey = 'rysqYM3QGKuLohRHn6V8';
  const consumerSecret = 'OJPxwQW3Mo';
  const appName = 'com.studentsnursing.app';
  const serviceUrlScheme = 'com.studentsnursing.app';

  const signInWithNaver = async () => {
    
    const {failureResponse, successResponse} = await NaverLogin.login({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlScheme,
    })
    if (successResponse) {
      axios
      .post(`${MainURL}/login/login/naver`, {
        AccessToken: successResponse.accessToken
      })
      .then((res: any)=>{
        if (res.data.isUser === true) {
          AsyncSetItem(res.data.refreshToken, res.data.userAccount, res.data.userName, res.data.userSchool, res.data.userSchNum, res.data.userURL);
          props.navigation.replace('Navi_Main');
        } else if (res.data.isUser === false) {
          props.navigation.navigate("Agree", {data: res.data});
        }
      }).catch((err : string)=>{
        console.log('naver토큰요청_err :', err)
      });
    }
  };

  // Apple 로그인
  async function appleLoginButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      nonceEnabled: false,
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      if (appleAuthRequestResponse.identityToken) {
        const user = jwt_decode(appleAuthRequestResponse.identityToken);
        axios
        .post(`${MainURL}/login/loginsocial/apple`, {
          userInfo: user,
          userFullName : appleAuthRequestResponse.fullName,
          AccessToken : appleAuthRequestResponse.identityToken,
        })
        .then((res: any)=>{
          if (res.data.isUser === true) {
            AsyncSetItem(res.data.refreshToken, res.data.userAccount, res.data.userName, res.data.userSchool, res.data.userSchNum, res.data.userURL);
            props.navigation.replace('Navi_Main');
          } else if (res.data.isUser === false) {
            props.navigation.navigate("Agree", {data: res.data});
          }
        }).catch((err : string)=>{
          console.log('applelogin_err :', err)
        });
      }
    }
  }

  // google 로그인
  async function googleLoginButtonPress() {
    GoogleSignin.configure({
      webClientId: GoogleWebClientID,
      offlineAccess: true,
    });
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const res = await auth().signInWithCredential(googleCredential);
      if (res) {
        axios
          .post(`${MainURL}/login/loginsocial/google`, {
            user: res.user,
            AccessToken: idToken,
          })
          .then((res: any)=>{
            if (res.data.isUser === true) {
              AsyncSetItem(res.data.refreshToken, res.data.userAccount, res.data.userName, res.data.userSchool, res.data.userSchNum, res.data.userURL);
              props.navigation.replace('Navi_Main');
            } else if (res.data.isUser === false) {
              props.navigation.navigate("Agree", {data: res.data});
            }
          }).catch((err : string)=>{
            console.log('applelogin_err :', err)
          });
      }
    } catch (error) {
      console.log('google_error', error);
    }
  };


  return (
    <View style={Platform.OS === 'android' ? styles.android : styles.ios}>
      <View style={styles.container}>
        
        <View style={styles.mainlogo}>
          <Image source={require('../images/login/loginlogo.png')} style={{height:180, resizeMode:'contain'}}/>
        </View>

        <View  style={{width: '100%', alignItems: 'center', marginVertical: 20}}>
          <Image source={require('../images/login/text.png')} 
              style={{resizeMode: 'contain', width: '80%'}}/>
        </View>        
        
        <View style={{flex:1, flexDirection: 'row'}}>
          {/* 카카오톡 로그인 */}
          <TouchableOpacity 
            style={[styles.loginButton]} 
            onPress={()=>{
              signInWithKakao();
            }}>
            <Image source={require('../images/login/kakao.png')} style={styles.img} />
          </TouchableOpacity>

          {/* 네이버 로그인 */}
          <TouchableOpacity 
            style={[styles.loginButton]} 
            onPress={()=>{
              signInWithNaver();
            }}>
            <Image source={require('../images/login/naver.png')} style={styles.img} />
          </TouchableOpacity>

          {/* 애플 로그인 */}
          { 
            Platform.OS === 'ios' &&
            <TouchableOpacity 
            style={[styles.loginButton]} 
            onPress={appleLoginButtonPress}>
              <Image source={require('../images/login/apple.png')} style={styles.img} />
            </TouchableOpacity>
          }

          {/* 구글 로그인 */}
          { 
            Platform.OS === 'android' &&
            <TouchableOpacity 
            style={[styles.loginButton, {borderRadius:28, borderWidth:1, borderColor: '#BDBDBD'}]} 
            onPress={googleLoginButtonPress}>
              <Image source={require('../images/login/google.png')} 
               style={{width: '40%', height: '40%', resizeMode:'center'}} />
            </TouchableOpacity>
          }      
        </View>

        <View style={{width:'100%', height:20, alignItems:'flex-start', marginLeft:10}}>
          <TouchableOpacity
            onPress={()=>{props.navigation.navigate("Admin");}}
          >
            <Ionicons name="information-circle-outline"/>
          </TouchableOpacity>
        </View>

        

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  android: {
    flex: 1,
    backgroundColor: 'black',
  },
  ios : {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: getStatusBarHeight(),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  mainlogo: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loginButton : {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    marginHorizontal: 5
  },
  img: {
    width: '100%',
    height: '100%',
  },
});