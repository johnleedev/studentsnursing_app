import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios'
import MainURL from "../../MainURL";
import AsyncGetItem from '../AsyncGetItem'
import Entypo from 'react-native-vector-icons/Entypo';
import { Typography } from '../Components/Typography';
import { SubTitle } from '../Components/SubTitle';
import { ButtonBox } from '../Components/ButtonBox';
import { Divider } from '../Components/Divider';

function Post(props: any) {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 수정기능
  const route : any = useRoute();
  const { post, editMode } = route.params;
  
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
    if (post !== null && editMode !== null) {
      setTitle(post.title);
      setContent(post.content);
    } else {
      return
    }
  }, [editMode, post]);

  const createPost = async () => {
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().slice(0, 19);

    if (post !== null && editMode !== null) {
      // 기존 글 수정 처리
      axios
        .post(`${MainURL}/board/posts/${post.id}/edit`, {
          title: title, content: content
        })
        .then((res) => {
          if (res.data === true) {
            Alert.alert('수정되었습니다.');
            props.navigation.replace('Main');
          } else {
            Alert.alert(res.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post(`${MainURL}/board/posts`, {
          title: title, content: content, date: currentDate,
          userAccount : asyncGetData.userAccount,
          userName: asyncGetData.userName, userSchool: asyncGetData.userSchool, 
          userSchNum : asyncGetData.userSchNum
        })
        .then((res) => {
          if (res.data === true) {
            Alert.alert('입력되었습니다.');
            props.navigation.replace('Main');
          } else {
            Alert.alert(res.data)
          }
        })
        .catch(() => {
          console.log('실패함')
        })
    }    
  };

  const closeDetail = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SubTitle title='글쓰기' enTitle='writing' navigation={props.navigation}/>
      <Divider height={2} />
      <ScrollView style={{flex:1}}>
        <View style={styles.section}>

          <View style={styles.userBox}>
            <Typography><Entypo name="pencil" size={20} color="black"/> </Typography>
            <Typography>{asyncGetData.userName} </Typography>
            <Typography color='#8C8C8C'>{asyncGetData.userSchool}</Typography>
            <Typography color='#8C8C8C'>{asyncGetData.userSchNum} </Typography>
          </View>

          <View style={styles.addPostBox}>
            <TextInput
              style={[styles.input, styles.titleInput]}
              placeholder="제목"
              value={title}
              onChangeText={setTitle}
              multiline
            />
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="내용"
              value={content}
              onChangeText={setContent}
              multiline
            />
          </View>

        </View>
      </ScrollView>

      <ButtonBox leftFunction={closeDetail} leftText='취소' rightFunction={createPost} rightText='작성'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section : {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  addPostBox: {
    marginBottom: 8,
  },
  addTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userBox: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    height: 'auto',
    color: '#333'
  },
  titleInput: {
    minHeight: 40,
  },
  contentInput: {
    minHeight: 280,
    textAlignVertical: 'top',
  }
});

export default Post;
