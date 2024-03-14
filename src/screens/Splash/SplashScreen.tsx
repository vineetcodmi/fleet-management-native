import React, {useEffect} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
const SplashScreen = ({navigation}: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('ServerLogin');
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={{fontWeight:'bold',fontSize:40}}> 

        Fleet 
        </Text>
      {/* <Image
        source={require('../../assets/download.jpeg')}
        style={styles.splashImage}
        resizeMode="contain"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  splashImage: {
    width: '50%',
  },
});

export default SplashScreen;
