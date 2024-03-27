import React, { useEffect, useState } from "react";
import { Text, View ,Button, TouchableOpacity, ActivityIndicator, StyleSheet} from "react-native";
import { useAuth } from "../../context/Auth";
import colors from "../../utlits/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { boolean } from "yup";


const Deatils=({navigation}:any)=>{
  const{logout}=useAuth()
  const [loggingOff, setLoggingOff] = useState<boolean>(false)
  const handlelogout=async()=>{
    setLoggingOff(true)
    await logout();
    setLoggingOff(false)
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlelogout()}
      >
        <Text style={styles.buttonText}>Log out</Text>
        {loggingOff && <ActivityIndicator color="white" />}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    backgroundColor: "#00526F",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Deatils;