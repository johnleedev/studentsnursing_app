import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./Study/Main";
import WordDetail from "./Study/WordDetail";
import NursingSkillDetail from "./Study/NursingSkillDetail";
import Quiz from "./Study/Quiz";
import Study from "./Study/Study";
import SelectBox from "./Study/SelectBox";
import SelectBoxShort from "./Study/SelectBoxShort";
import SelectBoxDetail from "./Study/SelectBoxDetail";

const Stack = createNativeStackNavigator();

function Navi_Study () {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
     >
      <Stack.Screen name={'StudyMain'} component={Main}/>
      <Stack.Screen name={'NursingSkillDetail'} component={NursingSkillDetail}/>
      <Stack.Screen name={'WordDetail'} component={WordDetail}/>
      <Stack.Screen name={'Quiz'} component={Quiz}/>
      <Stack.Screen name={'Study'} component={Study}/>
      <Stack.Screen name={'SelectBox'} component={SelectBox}/>
      <Stack.Screen name={'SelectBoxDetail'} component={SelectBoxDetail}/>
      <Stack.Screen name={'SelectBoxShort'} component={SelectBoxShort}/>
    </Stack.Navigator>
  );
}
export default Navi_Study;