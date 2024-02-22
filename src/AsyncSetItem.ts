import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage 데이터 저장하기
const AsyncSetItem = async (Token : string, Account: string, Name : string, School : string, SchNum : string, URL : string) => {
    try {
      await AsyncStorage.setItem('token', Token);
      await AsyncStorage.setItem('account', Account);
      await AsyncStorage.setItem('name', Name);
      await AsyncStorage.setItem('school', School);
      await AsyncStorage.setItem('schNum', SchNum);
      await AsyncStorage.setItem('URL', URL);
    } catch (error) {
      console.log('AsycSet_err', error);
    }
  };

  export default AsyncSetItem;