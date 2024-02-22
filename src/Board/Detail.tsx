import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, 
          Platform, TextInput, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import MainURL from "../../MainURL";
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Typography } from '../Components/Typography';
import { Divider } from '../Components/Divider';
import AsyncGetItem from '../AsyncGetItem';
import CommentOption from './CommentOption';
import DateFormmating from '../Components/DateFormmating';


function Detail (props: any) {

  const route : any = useRoute();
  const [asyncGetData, setAsyncGetData] = useState<any>();
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isUser, setIsUser] = useState<boolean>();
  const [postId, setPostId] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [refresh, setRefresh] = useState<boolean>(false);

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 500);
  }, []);

  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const postsCheck = async () => {
    // 좋아요 버튼 눌렀는지 확인
    const postId = route.params.data.id;
    const userAccount = route.params.user.userAccount;
    axios
    .get(`${MainURL}/board/posts/${postId}/${userAccount}`)
    .then((res) => {
      if(res.data === true) {
        setIsLiked(true);
      } else if (res.data === false) {
        setIsLiked(false);
      }
    });
    // 선택글이 자기가 쓴 글인지 확인
    if (route.params.data.userAccount === route.params.user.userAccount) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  };

  const fetchComments = (postId: number) => {
    axios
      .get(`${MainURL}/board/comments/${postId}`)
      .then((res) => {
        const copy = res.data;
        if (copy > 0) {
          copy.reverse();
        }
        setCommentsData(copy);
      });
  };

  useEffect(() => {
    fetchComments(route.params.data.id);
    postsCheck();
    asyncFetchData();
  }, [refresh]);

  const toggleLike = () => {
    axios
      .post(`${MainURL}/board/posts/${postId}/isliked`, {
        isLiked : isLiked,
        postId : route.params.data.id,
        userAccount: asyncGetData.userAccount,
      })
      .then((res) => {
        if (res.data === true) {
          setIsLiked(true);
        } else if (res.data === false) {
          setIsLiked(false);
        }
      });
    setIsLiked(!isLiked);
  };

  const deletePost = () => {
    axios
      .post(`${MainURL}/board/posts/${postId}/delete`, {
        postId : route.params.data.id,
        userAccount: asyncGetData.userAccount,
      })
      .then((res) => {
        if (res.data === true) {
          Alert.alert('삭제 되었습니다.');
          props.navigation.replace('Main');
        } else if (res.data === false) {
          Alert.alert('다시 시도해주십시오');
          props.navigation.replace('Main');
        }
      });
  };

  const handleReport = () => {
    {
      Platform.OS === 'ios' ?
      Alert.alert('신고 사유를 선택해 주세요.', '신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않으며, 누적 신고횟수가 3회 이상인 사용자는 게시판 글 작성에 제한이 있게 됩니다.', [
        { text: '잘못된 정보', onPress: () => compeleteReport('잘못된 정보') },
        { text: '상업적 광고', onPress: () => compeleteReport('상업적 광고') },
        { text: '음란물', onPress: () => compeleteReport('음란물') },
        { text: '폭력성', onPress: () => compeleteReport('폭력성') },
        { text: '기타', onPress: () => compeleteReport('기타') },
        { text: '취소', onPress: () => { return }},
      ])
      :
      Alert.alert('신고 사유를 선택해 주세요.', '신고 사유에 맞지 않는 신고일 경우, 해당 신고는 처리되지 않으며, 신고 사유에 맞는 신고일 경우, 신고된 사용자는 게시판 글 작성에 제한이 있게 됩니다.', [
        { text: '잘못된 정보 & 상업적 광고', onPress: () => compeleteReport('잘못된 정보 & 상업적 광고') },
        { text: '기타', onPress: () => compeleteReport('기타') },
        { text: '취소', onPress: () => { return }},
      ]);
    }
  };

  const compeleteReport = (reportPart : string) => { 
    props.navigation.navigate('Navi_MyPage', {
      screen: 'Report',
      params: { data : reportPart },
    });
  }

  const addComment = () => {
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().slice(0, 19);
    
    if (asyncGetData.userName || asyncGetData.userSchool) {
      axios
        .post(`${MainURL}/board/comments`, {
          postId : route.params.data.id, commentText: commentText, date : currentDate, 
          userAccount: asyncGetData.userAccount,
          userName: asyncGetData.userName, userSchool: asyncGetData.userSchool,
          userSchNum: asyncGetData.userSchNum
        })
        .then((res) => {
          if(res.data) {
            setCommentText('');
            setRefresh(!refresh);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      Alert.alert('로그인이 필요합니다.');
    }
  };

  // 댓글 옵션 모달
  const [isCommentOptionModalVisible, setCommentOptionModalVisible] = useState(false);
  const [commentSelected, setCommentSelected] = useState({});
  const commentOptionToggleModal = (comment : any) => {
    setCommentSelected(comment);
    setCommentOptionModalVisible(!isCommentOptionModalVisible);
  };

  const firstCharacter = route.params.data?.userName.charAt(0);
  const restOfTheString = 'O'.repeat(route.params.data?.userName.length - 1);
  const modifiedName = firstCharacter + restOfTheString;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 100}
        style={{flex:1}}
      >

        <View style={{padding:15}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              props.navigation.goBack()
            }}>
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
        </View>
        
        <Divider/>

        <View style={styles.section}>
          <Typography fontSize={14} marginBottom={10} color='#D76F23'>자유게시판</Typography>
          <View style={{flexDirection: 'row'}}>
            <Typography fontSize={20} marginBottom={10} fontWeightIdx={1}>{route.params.data?.title}</Typography>
            {isUser ? 
            <TouchableOpacity 
              onPress={() => setIsModalVisible(true)}
              style={{position:'absolute', right: 5}}>
              <Typography><Entypo name="dots-three-vertical" size={15} color="black" /></Typography>
            </TouchableOpacity>
            : null}
          </View>
          <View style={[styles.titleContainer, {justifyContent:'space-between'}]}>
            <Typography color='#333' fontSize={13} >{DateFormmating(route.params.data?.date)}</Typography>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Ionicons name="eye-outline" size={14} color="#E7AA0E" />
              <Typography color='#E7AA0E' fontSize={13} > {route.params.data?.views}</Typography>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Typography color='#333' fontSize={13} >{modifiedName} </Typography>
            <Typography color='#8C8C8C' fontSize={13} >{route.params.data?.userSchool}</Typography>
            <Typography color='#8C8C8C' fontSize={13} >{route.params.data?.userSchNum} </Typography>
          </View>
        </View>   
        
        <Divider height={2} />

        <ScrollView 
          style={styles.container}
        >
        <View style={[styles.section, {marginBottom:20}]}>
          <Typography fontSize={14} >{route.params.data?.content}</Typography>
        </View>
        
        <View style={[styles.section, {marginBottom:20, flexDirection:'row', alignItems:'center'}]}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Feather name="thumbs-up" size={14} color="#DD4A4A" />
            <Typography fontSize={14} color='#DD4A4A' > {route.params.data?.isLiked}</Typography>
          </View>
          <View style={{width:2, height:15, backgroundColor:'#BDBDBD', marginHorizontal:7}}></View>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color="#333" />
            <Typography fontSize={14} color='#333' > {route.params.data?.commentCount}</Typography>
          </View>
        </View>
       
        <View style={[styles.section, {backgroundColor:'rgba(215, 111, 35, 0.10)'}]}>
          <Typography fontSize={12} >간호대학생들 커뮤니티에는 불건전하거나, 불법적인 내용 작성시, 서비스 사용에 제한이 있을 수 있습니다. 
            아름답고 건전한 커뮤니티를 만들기 위해 커뮤니티 규정을 지켜주시기 바랍니다.</Typography>
        </View>

        <View style={{width:'100%', height:100, alignItems:'center', justifyContent:'center'}}>
          <TouchableOpacity 
            onPress={toggleLike} 
            style={[styles.Button,  { backgroundColor: isLiked ? 'rgba(221, 74, 74, 0.10)' : '#EAEAEA' }]}>
            <AntDesign name='heart' color={isLiked ? '#DD4A4A' : '#333'} size={18}/>
            <Typography color={isLiked ? '#333' : '#8C8C8C'}>  {isLiked ? '좋아요 1' : '좋아요'}</Typography>
          </TouchableOpacity>
        </View>
       
        <View style={[styles.section, {alignItems:'center'}]}>
          <TextInput
            style={[styles.addCommentInput, {width:'100%'}]}
            placeholder="댓글을 입력하세요"
            placeholderTextColor="#EAEAEA"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity 
            onPress={()=>{ commentText ? addComment() : null}}
            style={[styles.Button, { backgroundColor: commentText ? '#333' : '#EAEAEA' }]}>
            <Typography color={commentText ? '#fff' : '#8C8C8C'}>댓글 쓰기</Typography>
          </TouchableOpacity>
        </View>

        <Divider height={2}/>
        
        {/* Display comments  ----------------------------------------------------------- */}
        <View style={styles.commentContainer}>
          {commentsData ? (
              commentsData.map((comment: any, index: number) => {
                const firstCharacter = comment.userName.charAt(0);
                const restOfTheString = 'O'.repeat(comment.userName.length - 1);
                const modifiedName = firstCharacter + restOfTheString;
                return (
                  <View style={styles.commentItem} key={index}>
                    <View style={styles.commentHeader}>
                      <Typography fontSize={13} >{modifiedName} </Typography>
                      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <View style={{flexDirection: 'row'}}>
                          <Typography color='#8C8C8C' fontSize={12} >{comment.userSchool}</Typography>
                          <Typography color='#8C8C8C' fontSize={12} >{comment.userSchNum} </Typography>
                        </View>
                        <TouchableOpacity
                         style={{padding:10}}
                         onPress={()=>{
                          commentOptionToggleModal(comment);
                         }}
                        >
                          <Entypo name="dots-three-horizontal" size={12} color="#8C8C8C" /> 
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{padding:10, marginBottom:10}}>
                      <Typography fontSize={14} >{comment.content}</Typography>        
                    </View>
                    <Typography color='#8C8C8C' fontSize={12} marginBottom={5} >{DateFormmating(comment.date)}</Typography>
                    <Divider height={2} marginVertical={5}/>
                  </View>
                )
              })
          ) : (
            <Typography><Text></Text></Typography>
          )}
        </View>

        <Modal
          animationType="slide" 
          transparent={true}
          visible={isCommentOptionModalVisible}
          onRequestClose={commentOptionToggleModal}
        >
          <CommentOption
            commentOptionToggleModal={commentOptionToggleModal}
            commentSelected={commentSelected}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        </Modal>  
        
        {/* 수정&삭제 모달 */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
          >
          <View style={styles.modalContainer}>
            
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalEmpty}
              >
              <View></View>
            </TouchableOpacity>
            <View style={styles.modalContents}>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  props.navigation.navigate('Post', {
                    post: route.params.data,
                    editMode: true,
                  });
                }}
                style={styles.modalButton}
              >
                <Typography>수정</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deletePost();
                  setIsModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Typography>삭제</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.modalButton}
              >
                <Typography>취소</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>  

        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15 }}
          style={styles.reportContainer}
          onPress={handleReport}
        >
          <Typography color='#8C8C8C' fontSize={12}>
            <Text style={{textDecorationLine:'underline'}}>이 글 신고하기</Text>
          </Typography>
        </TouchableOpacity> 

        <TouchableOpacity
          hitSlop={{ top: 15, bottom: 15 }}
          style={styles.reportContainer}
          onPress={handleReport}
        >
          <Typography color='#8C8C8C' fontSize={12}>
            <Text style={{textDecorationLine:'underline'}}>이 사용자 차단하기</Text>
          </Typography>
        </TouchableOpacity> 

      </ScrollView>
      </KeyboardAvoidingView>
      <View style={isCommentOptionModalVisible ? styles.modalBackCover :  { display: 'none'}}></View>  

    </View>
  );
};

const styles = StyleSheet.create({
  // posts
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section : {
    padding: 20
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent:'center',
  },
  commentBox: {
    marginTop: 30,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 16,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center'
  },
  postTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  authorText : {
    color: '#8C8C8C'
  },
  postContent: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 25
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5
  },

  // buttons
  commentButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  Button: {
    width: 120,
    height: 50,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  ButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCommentInput: {
    minHeight: 50,
    height: 'auto',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },

  // comments
  commentContainer: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333333',
  },
  commentItem: {
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // modalContainer
  modalContainer: {
    flex: 1,
  },
  modalEmpty: {
    flex: 1,
    backgroundColor: '#8C8C8C',
    opacity: 0.3
  },
  modalContents: {
    height: 200,
    backgroundColor: '#fff',
    paddingBottom: 30,
    elevation: 10,
    borderRadius: 4,
  },
  modalButton: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  reportContainer : {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 20,
    height: 50,
    marginBottom: 30
  },
  modalBackCover : {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    opacity: 0.8
  },
});

export default Detail;
