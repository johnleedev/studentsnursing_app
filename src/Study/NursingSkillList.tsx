import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Typography } from '../Components/Typography';
import axios from 'axios';
import MainURL from "../../MainURL";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SelectDropdown from 'react-native-select-dropdown'
import Loading from '../Components/Loading';


export default function NursingSkillList (props : any) {

  interface PostsProps {
    id: number;
    name : string;
  }

  const [posts, setPosts] = useState<PostsProps[]>([]);
  const [isResdataFalse, setIsResdataFalse] = useState<boolean>(false);

  const fetchPosts = () => {
    axios.get(`${MainURL}/study/getnursingskillall`).then((res) => {
      if (res.data !== false) {
        setIsResdataFalse(false);
        let copy: any = [...res.data];
        setPosts(copy);
      } else {
        setIsResdataFalse(true);
      }    
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  

  return (
    posts.length === 0 && !isResdataFalse
    ?  (
    <View style={{flex:1, width:'100%', height:'100%'}}>
      <Loading />
    </View>
    ) : (
    <View style={styles.container}>
     
      <View style={{paddingHorizontal:20}}>
        
        <ScrollView>
          
          {
            posts.map((item:any, index:any)=>{
              return(
                <TouchableOpacity
                  key={index} 
                  style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:10}}
                  onPress={()=>{
                    props.navigation.navigate('NursingSkillDetail', { postID : item.id, postName: item.name })
                  }}
                >
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{width:index < 9 ? 22 : 30, marginRight:7}}>
                      <Image
                        source={require("../images/study/bluemiddle.png")}
                        style={{width:index < 9 ? 22 : 30, height:30, resizeMode:'cover', opacity:0.3}}>
                      </Image>
                      <View style={{position:'absolute', bottom:5, left:5}}>
                        <Typography fontWeightIdx={1}>{item.id}.</Typography>
                      </View>
                    </View>
                    <Typography fontSize={18} fontWeightIdx={1}>{item.name}</Typography>
                  </View>
                  <AntDesign name='right' color='#333' size={16}/>
                </TouchableOpacity>
              )
            })
          }
          
          
        </ScrollView>
      </View>

    </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding:20
  },
  selectDropdown : {
    width:'48%',
    borderWidth:1, 
    borderRadius:5, 
    borderColor:'#DFDFDF', 
    paddingHorizontal:15,
    paddingVertical:5,
    flexDirection:'row', 
    alignItems:'center',
  },
  seachBar:{
    borderWidth:1,
    borderRadius:5,
    height: 48,
    borderColor: '#EAEAEA',
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:15,
    marginVertical:10
  },
  flexBox:{
    flexDirection:'row',
    justifyContent:'space-between',
  }

});


