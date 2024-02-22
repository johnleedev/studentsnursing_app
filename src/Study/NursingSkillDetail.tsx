import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { Typography } from '../Components/Typography';
import axios from 'axios';
import MainURL from "../../MainURL";
import MainImageURL from "../../MainImageURL";
import { Divider } from '../Components/Divider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loading from '../Components/Loading';


export default function NursingSkillDetail (props : any) {

  const postID = props.route.params.postID;
  const postName = props.route.params.postName;

  interface PostProps {
    orderNum: number;
    orderName : string;
    name : string;
    content : string[];
  }

  const [post, setPost] = useState<PostProps[]>([]);
  const [orderNames, setOrderNames] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(Array(post.length).fill(false));

  const fetchPosts = () => {
    axios.get(`${MainURL}/study/getnursingskill/${postID}`).then((res) => {
      let copy: any = [...res.data];
      setPost(copy);
      const orderNamesCopy = [...new Set(copy.map((item:any) => item.orderName))];
      setOrderNames(orderNamesCopy);
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleIsOpen = (index:number, boolean: boolean ) => {
    const copy = [...isOpen];
    copy[index] = boolean;
    setIsOpen(copy);
  }

  return (
    post.length === 0
    ?  (
    <View style={{flex:1, width:'100%', height:'100%'}}>
      <Loading />
    </View>
    ) : (
    <View style={styles.container}>

      <View style={styles.section}>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              props.navigation.goBack()
            }}>
            <AntDesign name="left" size={20} color="black" />
          </TouchableOpacity>
          <Typography fontWeightIdx={1}>{postName}</Typography>
        </View>
      </View>
      <Divider height={2}/>
      
      <ScrollView style={[styles.section]}>

        {
          orderNames.map((names:any, nameIdx:any)=>{

            const postCopy = post.filter((e:any) => e.orderName === names);

            return (
              <View key={nameIdx} style={{marginVertical:10}}>
                <View style={{alignItems:'center', marginBottom:10}}>
                  <View 
                    style={{flexDirection:'row', alignItems:'center'}}
                  >
                    <Image
                      source={require("../images/study/bluemiddle.png")}
                      style={{width:20, height:20, resizeMode:'cover', opacity:0.7}}>
                    </Image>
                    <View style={{marginHorizontal:5}}>
                      <Typography fontWeightIdx={1}>{names}</Typography>
                    </View>
                    <Image
                      source={require("../images/study/bluemiddle.png")}
                      style={{width:20, height:20, resizeMode:'cover', opacity:0.7}}>
                    </Image>
                  </View>
                </View>
                { 
                  postCopy?.map((item:any, index:any)=>{

                    const contentArray = item.content.split("\",\"");
                    contentArray[0] = contentArray[0].substring(2);
                    contentArray[contentArray.length - 1] = contentArray[contentArray.length - 1].substring(0, contentArray[contentArray.length - 1].length - 2);

                    return(
                      <View
                        key={index} 
                        style={{marginVertical:5}}
                      >
                        <TouchableOpacity 
                          style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}
                          onPress={()=>{handleIsOpen(item.id-1, !isOpen[item.id-1])}}
                        >
                          <Typography fontWeightIdx={1}>{item.name}</Typography>
                          {
                            item.name === '공통'
                            ? <AntDesign name={isOpen[item.id-1] ? 'down' : 'up'} color='#333' size={16}/>
                            : <AntDesign name={isOpen[item.id-1] ? 'up' : 'down'} color='#333' size={16}/>
                          }
                          
                        </TouchableOpacity>
                        {
                          item.name === '공통'
                          ?
                          <>
                            { !isOpen[item.id-1] &&
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={()=>{handleIsOpen(item.id-1, !isOpen[item.id-1])}}
                                style={{paddingHorizontal:10}}
                              >
                                {
                                  contentArray.map((subItem:any, subIndex:any)=>{
                                    const image = subItem.includes('image') && subItem.substring(6);
                                    const youtube = subItem.includes('youtube') && subItem.substring(8);
                                    return(
                                      <View
                                        key={subIndex} 
                                        style={{marginVertical:3}}
                                      >
                                        {image && <Image source={{uri: `${MainImageURL}/images/nursingskill/${image}`}} style={{width:'100%', height:400, resizeMode:'contain'}}/>}
                                        {youtube && 
                                        <TouchableOpacity
                                          onPress={()=>{Linking.openURL(`${youtube}`);}}
                                        >
                                          <Text style={{textDecorationLine:'underline'}}>
                                            <Typography>{youtube}</Typography>
                                          </Text>
                                        </TouchableOpacity>
                                        }
                                        {!image && !youtube && 
                                          !isNaN(parseInt(subItem.charAt(0))) 
                                          ? 
                                          <View style={{marginTop:15, paddingLeft:5}}>
                                            <Image
                                              style={{ position:'absolute', width:20, height:20, resizeMode:'cover', opacity:0.2}}
                                              source={require("../images/study/bluemiddle.png")}>
                                            </Image>
                                            <Typography fontWeightIdx={1}>{subItem}</Typography>
                                          </View>
                                          : <Typography>{subItem}</Typography>
                                        }
                                      </View>
                                    )
                                  })
                                }
                                <View style={{width:'100%', alignItems:'flex-end', marginTop:10}}>
                                  <TouchableOpacity
                                    onPress={()=>{handleIsOpen(item.id-1, !isOpen[item.id-1])}}
                                  >
                                    <Typography color='#8C8C8C'>[닫기]</Typography>
                                  </TouchableOpacity>
                                </View>
                              </TouchableOpacity>
                            }
                          </>
                          :
                          <>
                            { isOpen[item.id-1] &&
                              <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={()=>{handleIsOpen(item.id-1, !isOpen[item.id-1])}}
                                style={{paddingHorizontal:10}}
                              >
                                {
                                  contentArray.map((subItem:any, subIndex:any)=>{
                                    const image = subItem.includes('image') && subItem.substring(6);
                                    const youtube = subItem.includes('youtube') && subItem.substring(8);
                                    return(
                                      <View
                                        key={subIndex} 
                                        style={{marginVertical:3}}
                                      >
                                        {image && <Image source={{uri: `${MainImageURL}/images/nursingskill/${image}`}} style={{width:'100%', height:400, resizeMode:'contain'}}/>}
                                        {youtube && 
                                        <TouchableOpacity
                                          onPress={()=>{Linking.openURL(`${youtube}`);}}
                                        >
                                          <Text style={{textDecorationLine:'underline'}}>
                                            <Typography>{youtube}</Typography>
                                          </Text>
                                        </TouchableOpacity>
                                        }
                                        {!image && !youtube && 
                                          !isNaN(parseInt(subItem.charAt(0))) 
                                          ? 
                                          <View style={{marginTop:15}}>
                                            <Typography fontWeightIdx={1}>{subItem}</Typography>
                                          </View>
                                          : <Typography>{subItem}</Typography>
                                        }
                                      </View>
                                    )
                                  })
                                }
                                <View style={{width:'100%', alignItems:'flex-end', marginTop:10}}>
                                  <TouchableOpacity
                                    onPress={()=>{handleIsOpen(item.id-1, !isOpen[item.id-1])}}
                                  >
                                    <Typography color='#8C8C8C'>[닫기]</Typography>
                                  </TouchableOpacity>
                                </View>
                              </TouchableOpacity>
                            }
                          </>
                        }
                        
                        
                        
                      </View>
                    )
                  })
                }
                <Divider marginVertical={10}/>
              </View>
            )
          })
        }

        
      
      </ScrollView>
      
    </View>
    )
  );
}

const styles = StyleSheet.create({
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
    alignItems:'center',
    justifyContent:'center',
  }
});


