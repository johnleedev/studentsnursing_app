import React, { Component, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Linking, Platform } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
 
export default function Agree (props : any) {
  
  // 전송된 데이터 셋팅
  const navi_dataSet = () => {
    if(props.route.params === null || props.route.params === undefined) {
      return
    } else {
      const routeData = props.route.params.data;
      setRouteData(routeData);
    }
  }

  useEffect(()=>{
    navi_dataSet();
  }, [])

  const [routeData, setRouteData] = useState({});

  const [isCheck1_usingPolicy, setIsCheck1_usingPolicy] = useState<boolean>(false);
  const [isCheck2_personalInfo, setIsCheck2_personalInfo] = useState<boolean>(false);
  const [isCheck3_contentsRestrict, setIsCheck3_contentsRestrict] = useState<boolean>(false);
  const [isCheck4_infoToOthers, setIsCheck4_infoToOthers] = useState<boolean>(false);
  const [isCheck5_serviceNotifi, setIsCheck5_serviceNotifi] = useState<boolean>(false);
  const [isAllCheck, setIsAllCheck] = useState<boolean>(false);
  
  const AgreeBox = (props: { choice: string, text: string, view: string, isCheck: boolean, setIsCheck: any, link: string }) => {
    return (
      <View style={styles.checkboxItem}>
        <TouchableOpacity onPress={()=>{props.setIsCheck(!props.isCheck)}}>
          { props.isCheck ? <AntDesign name="checkcircle" size={20} color="black" style={styles.checkboxicon} />
          : <AntDesign name="checkcircleo" size={20} color="black" style={styles.checkboxicon} /> }
        </TouchableOpacity>
        <View style={styles.checkboxContent}>
          <TouchableOpacity onPress={()=>{props.setIsCheck(!props.isCheck)}} style={{flexDirection:'row'}}>
            <Text style={styles.checkboxText}>{props.choice} </Text>
            <Text style={styles.checkboxText}>{props.text}</Text>
          </TouchableOpacity>
          {
            props.view
            && 
            <TouchableOpacity 
              style={styles.checkDetail}
              onPress={()=>{
                Linking.openURL(props.link);
              }}  
            >
              <Text style={styles.checkDetailText}>{props.view}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    ) 
  }

  const handleAllAgree = () => {
    if (isAllCheck === true) {
      setIsAllCheck(false)
      setIsCheck1_usingPolicy(false);
      setIsCheck2_personalInfo(false);
      setIsCheck3_contentsRestrict(false);
      setIsCheck4_infoToOthers(false);
      setIsCheck5_serviceNotifi(false);
    } else {
      setIsAllCheck(true);
      setIsCheck1_usingPolicy(true);
      setIsCheck2_personalInfo(true);
      setIsCheck3_contentsRestrict(true);
      setIsCheck4_infoToOthers(true);
      setIsCheck5_serviceNotifi(true);
    }
  };

  // Logister 페이지로 전환
  const goLogisterPage = () => {
    const userData = {
      ...routeData,
      checkUsingPolicy: isCheck1_usingPolicy,
      checkPersonalInfo: isCheck2_personalInfo,
      checkContentsRestrict: isCheck3_contentsRestrict,
      checkInfoToOthers: isCheck4_infoToOthers,
      checkServiceNotifi: isCheck5_serviceNotifi
    };
    props.navigation.navigate("Logister", { data : userData });
  };

  return (
    <View style={Platform.OS === 'android' ? styles.android : styles.ios}>
      <View style={styles.container}>
        <View style={{alignItems: 'center', marginVertical: 20, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              props.navigation.goBack();
            }}
            >
            <EvilIcons name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <Typography>이용 약관 동의</Typography>
        </View>
        
        <View style={{flex:1, marginVertical: 20}}>
          <Image source={require('../images/login/icon.png')} style={{width:60, height:34, marginBottom: 10, resizeMode:'contain'}}/>
          <Typography fontSize={24}>
            간호대학생들에{'\n'}
            오신것을 환영해요!
          </Typography>
          <Typography fontSize={12} >원활한 서비스 이용을 위해, 아래 항목에 동의해 주세요.</Typography>
        </View>

        <View style={{flex:2}}> 

          <View style={styles.allCheckbox}>
            <TouchableOpacity 
                onPress={handleAllAgree}
                style={{flexDirection:'row', alignItems:'center'}}
              >
              { isAllCheck ? <AntDesign name="checkcircle" size={20} color="black" style={styles.checkboxicon} />
              : <AntDesign name="checkcircleo" size={20} color="black" style={styles.checkboxicon} /> }
              <View>
                <Typography fontSize={14}>간호대학생들 이용약관 전체 동의</Typography>
                <Typography fontSize={10} color='gray'>[선택] 개인정보 제3자 정보제공 동의를 포함하여 전체 동의합니다.</Typography>
              </View>
            </TouchableOpacity>
            
          </View>
          <Divider height={2} marginVertical={5}/>
          <View style={styles.inputFieldBox}>
            <AgreeBox choice={'[필수]'} text={'서비스 이용 약관'} view={'보기'} isCheck={isCheck1_usingPolicy} setIsCheck={setIsCheck1_usingPolicy} 
              link='https://www.studentsnursing.com/usingpolicy.html'/>
            <AgreeBox choice={'[필수]'} text={'개인정보 수집 및 이용 동의'} view={'보기'} isCheck={isCheck2_personalInfo} setIsCheck={setIsCheck2_personalInfo} 
              link='http://www.studentsnursing.com/personalinfo.html'/>
            <AgreeBox choice={'[필수]'} text={'유해 컨텐츠에 대한 제재 동의'} view={''} isCheck={isCheck3_contentsRestrict} setIsCheck={setIsCheck3_contentsRestrict} link=''/>
            <AgreeBox choice={'[선택]'} text={'개인정보 제3자 정보제공 동의'} view={''} isCheck={isCheck4_infoToOthers} setIsCheck={setIsCheck4_infoToOthers} link=''/>
            <AgreeBox choice={'[선택]'} text={'서비스 관련 알림 수신 동의'} view={''} isCheck={isCheck5_serviceNotifi} setIsCheck={setIsCheck5_serviceNotifi} link=''/>
          </View>

        </View>

        {
          isCheck1_usingPolicy && isCheck2_personalInfo && isCheck3_contentsRestrict
          ? 
          <TouchableOpacity 
            onPress={goLogisterPage}
            style={[styles.nextBtnBox, { backgroundColor: 'black'}]}
            >
            <Text style={styles.nextBtnText}>다음</Text>
          </TouchableOpacity>
          :
          <View style={[styles.nextBtnBox, { backgroundColor: 'gray'}]}>
            <Text style={styles.nextBtnText}>다음</Text>
          </View>
        }
      </View>
    </View>
  );
}

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
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 24
  },
  backButton: {
    position:'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
  },
  inputFieldBox: {
    width: '90%',
    height: 300,
    marginBottom: 30,
  },
  checkboxGroup: {
    marginTop: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxContent: {
    flexDirection: 'row',
    marginVertical: 3
  },
  checkboxicon: {
    paddingVertical: 3,
    marginRight: 10
  },
  checkboxText: {
    color: '#6F6F6F',
    fontSize: 14,
    lineHeight: 20
  },
  checkDetail: {
    marginLeft: 8,
    justifyContent: 'center'
  },
  checkDetailText: {
    fontSize: 12,
    textDecorationLine: 'underline',
    color: '#3d3d3d',
    fontWeight: '500',
  },
  divider: {
    width: '100%',
    height: 3,
    backgroundColor: '#F5F4F3',
    marginBottom: 16,
  },
  allCheckbox: {
    flexDirection: 'row',
    marginVertical: 10
  },
  allCheckboxText: {
    fontSize: 18,
    color: '#1B1B1B',
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
  }
});
