import React, { useEffect } from "react";
import { Text, View ,Button} from "react-native";
import { useAuth } from "../../context/Auth";
import colors from "../../utlits/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Deatils=({navigation}:any)=>{
  const{logout}=useAuth()
  const handlelogout=async()=>{
    await logout();
  }

  useEffect(() => {
    const isToken = async() => {
      const token = await AsyncStorage.getItem("token");
      if(!token){
        navigation.replace('LoginScreen');
      }
    }
    isToken();
  },[AsyncStorage.getItem("token")]);

  return(
    <View style={{flex:1,marginTop:30}}>
      <Button  title="logout" onPress={handlelogout} color={colors.tabBackgroundColor}/>
    </View>
  )
}

export default Deatils;