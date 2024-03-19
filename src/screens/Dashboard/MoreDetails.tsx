import React from "react";
import { Text, View ,Button} from "react-native";
import { useAuth } from "../../context/Auth";
import colors from "../../utlits/colors";


const Deatils=({navigation}:any)=>{
  const{logout,token}=useAuth()
  const handlelogout=()=>{
    logout();
    if(!token){
      navigation.replace('LoginScreen');
    }
  }
  return(
    <View style={{flex:1,marginTop:30}}>
      <Button  title="logout" onPress={handlelogout} color={colors.tabBackgroundColor}/>
    </View>
  )
}

export default Deatils;