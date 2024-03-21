import React, { useEffect } from "react";
import { Text, View ,Button} from "react-native";
import { useAuth } from "../../context/Auth";
import colors from "../../utlits/colors";


const Deatils=({navigation}:any)=>{
  const{ logout, unitId, token } = useAuth();

  const handlelogout=()=>{
    if(unitId){
      logout({unitId: unitId});
    } else {
      console.log("Unit Id not found");
    }
  }

  useEffect(() => {
    if(!token){
      navigation.replace('LoginScreen');
    }
  },[token])
  
  return(
    <View style={{flex:1,marginTop:30}}>
      <Button  title="logout" onPress={handlelogout} color={colors.tabBackgroundColor}/>
    </View>
  )
}

export default Deatils;