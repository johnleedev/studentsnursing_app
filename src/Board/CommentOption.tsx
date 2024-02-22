import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import MainURL from "../../MainURL";
import AsyncGetItem from '../AsyncGetItem'
import Entypo from 'react-native-vector-icons/Entypo';
import { Typography } from '../Components/Typography';

export default function CommentOption (props : any) {

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

  useEffect(() => {
    asyncFetchData();
  }, []);

  // 댓글 삭제하기
  const deleteComment = () => {
    axios
      .post(`${MainURL}/board/comments/delete`, {
        ID : props.commentSelected.id,
        post_id : props.commentSelected.post_id,
        userAccount: props.commentSelected.userAccount,
      })
      .then((res) => {
        if (res.data === true) {
          props.setRefresh(!props.refresh);
          props.commentOptionToggleModal();
        } else if (res.data === false) {
          Alert.alert('다시 시도해주십시오');
          props.commentOptionToggleModal();
        }
      });
  };

  // 댓글 신고하기
  const handleReport = () => {
    {
      Platform.OS === 'ios' ?
      Alert.alert('신고 사유를 선택해 주세요.', '신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않으며, 누적 신고횟수가 3회 이상인 사용자는 글 작성에 제한이 있게 됩니다.', [
        { text: '잘못된 정보', onPress: () => compeleteReport() },
        { text: '상업적 광고', onPress: () => compeleteReport() },
        { text: '음란물', onPress: () => compeleteReport() },
        { text: '폭력성', onPress: () => compeleteReport() },
        { text: '기타', onPress: () => compeleteReport() },
        { text: '취소', onPress: () => { return }},
      ])
      :
      Alert.alert('신고 사유를 선택해 주세요.', '신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않으며, 신고 사유에 맞는 신고일 경우, 신고된 사용자는 글 작성에 제한이 있게 됩니다.', [
        { text: '잘못된 정보 & 상업적 광고', onPress: () => compeleteReport() },
        { text: '기타', onPress: () => compeleteReport() },
        { text: '취소', onPress: () => { return }},
      ]);
    }
  };

  const compeleteReport = () => { 
    Alert.alert('신고가 접수되었습니다. 검토까지는 최대24시간 소요됩니다.')
  }


  return (
    <View style={styles.container}>
      {
        props.commentSelected.userAccount === asyncGetData.userAccount 
        ?
        <View style={[styles.addCommentContainer]}>
      
          <TouchableOpacity
            style={styles.addCommentButton}
            onPress={() => {
              deleteComment();
              props.commentOptionToggleModal();
            }}
          >
            <Typography color='#fff'>삭제</Typography>  
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              props.commentOptionToggleModal();
            }}
          >
            <Typography color='#fff'>취소</Typography>  
          </TouchableOpacity>
        </View>
        :
        <View style={[styles.addCommentContainer]}>
          <TouchableOpacity
            style={styles.addCommentButton}
            onPress={() => {
              handleReport();
              props.commentOptionToggleModal();
            }}
          > 
            <Typography color='#fff'>댓글신고하기</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              props.commentOptionToggleModal();
            }}
          >
            <Typography color='#fff'>취소</Typography>  
          </TouchableOpacity>
        </View>  
      }
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'flex-end'
  },
  addCommentContainer: {
    padding: 20,
    backgroundColor:'#fff',
  },
  addCommentButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  }
});


