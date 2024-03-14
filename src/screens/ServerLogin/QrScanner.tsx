import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Linking, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { ValidationError } from 'yup';

const QrScanner = ({route,navigation}:any) => {
  const serverKey =route.params?.serverKey;

  const [productionScanned, setProductionScannedData] = useState('');
  const [educationScannedData, setEducationScannedData] = useState('');

  const onSuccess = (e: any) => {
    const scannedData = e.data;
    if (serverKey === 'production') {
      setProductionScannedData(scannedData); 
    } else if (serverKey === 'education') {
      setEducationScannedData(scannedData); 
    }
    navigation.goBack(); 
    navigation.navigate('ServerLogin', { serverKey, scannedData}); 
  };

  return (
    <View style={{flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth:1}}>
    <QRCodeScanner
      onRead={onSuccess}
      containerStyle={styles.scannerContainer}
      cameraStyle={styles.cameraContainer}
      topContent={<Text style={styles.textBold}>Scan your QR code</Text>}
      // bottomContent={
      //   <TouchableOpacity style={styles.buttonTouchable}>
      //     <Text style={styles.buttonText}>OK. Got it!</Text>
      //   </TouchableOpacity>
      // }
    />
    </View>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  cameraContainer: {
    borderWidth: 2,
    borderRadius: 10, 
    width: '70%', 
    height:'70%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  scannerContainer: {
    width: 300, 
    height: 200, 
    borderRadius: 10,
    overflow: 'hidden',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 26,
    color: 'white',
    marginRight:60
  },
  buttonText: {
    fontSize: 21,
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default QrScanner;
