import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage 데이터 불러오기

const AsyncGetItem = async () => {
  try {
    const refreshToken : string | null = await AsyncStorage.getItem('token');
    const userAccount : string | null = await AsyncStorage.getItem('account');
    const userName : string | null = await AsyncStorage.getItem('name');
    const userSchool : string | null = await AsyncStorage.getItem('school');
    const userSchNum : string | null = await AsyncStorage.getItem('schNum');
    const userURL : string | null = await AsyncStorage.getItem('URL');
    
    return {
      refreshToken, userAccount, userName, userSchool, userSchNum, userURL
    }
    
  } catch (error) {
    console.log(error);
  }
};

export default AsyncGetItem;