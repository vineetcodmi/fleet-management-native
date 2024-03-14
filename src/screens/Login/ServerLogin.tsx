import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/Auth';
import axios from 'axios';
import {baseUrl} from '../../config';

const ServerLogin = ({route, navigation}: any) => {
  const {token,user} = useAuth();
  const [productionScannedData, setProductionScannedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [educationScannedData, setEducationScannedData] = useState('');
  const serverKey = route.params?.serverKey;
  const scannedData = route.params?.scannedData || '';

  useEffect(() => {
    if (serverKey === 'production') {
      setProductionScannedData(scannedData);
    } else if (serverKey === 'education') {
      setEducationScannedData(scannedData);
    }
  }, [serverKey, scannedData]);

  // useEffect(() => {
  //   console.log(token,"tokennn");
    
  //   if (token) {
  //     navigation.replace('BottomNavigation');
  //   }  
  // },[token]);

  const handleServerProduction = () => {
    try {
      setLoading(true);
      const toToken = `Bearer${token}`;
      axios
        .get(baseUrl + '/cad/', {
          headers: {
            Authorization: toToken,
          },
        })
        .then(res => {
          const data = res.data;
          navigation.replace('LoginScreen', {productionData: data});
        });
    } catch (error) {
      setLoading(false);
      console.log(error, 'error to connect production url');
    }
  };
  const handleProductionQrScanner = () => {
    navigation.navigate('QrScanner', {serverKey: 'production'});
  };
  const handleEducationQrScanner = () => {
    navigation.navigate('QrScanner', {serverKey: 'education'});
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/background.png')}
        resizeMode="cover"
        style={{flex: 0.2}}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/integraphLogo.png')}
            style={styles.logo}
          />
        </View>
      </ImageBackground>
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.heading}>Configure Server Connections</Text>
          <View style={styles.serverContainer}>
            <View style={styles.serverHeader}>
              <Text style={styles.serverHeaderText}>PRODUCTION SERVER</Text>
              <TouchableOpacity onPress={handleProductionQrScanner}>
                <MaterialIcons name="qr-code-scanner" size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter production server url"
              value={productionScannedData}
              onChangeText={setProductionScannedData}
            />
            {loading ? (
              <ActivityIndicator color="gray" />
            ) : (
              <TouchableOpacity
                disabled={!productionScannedData}
                style={[
                  styles.button,
                  productionScannedData ? null : styles.disabledButton,
                ]}
                onPress={handleServerProduction}>
                <Text style={styles.buttonText}>Connect to production</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.serverContainer}>
            <View style={styles.serverHeader}>
              <Text style={styles.serverHeaderText}>
                EDUCATION (TEST) SERVER
              </Text>
              <TouchableOpacity onPress={handleEducationQrScanner}>
                <MaterialIcons name="qr-code-scanner" size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter education server url"
              value={educationScannedData}
              onChangeText={setEducationScannedData}
            />
            <TouchableOpacity
              style={[
                styles.button,
                educationScannedData ? null : styles.disabledButton,
              ]}
              onPress={handleServerProduction}>
              <Text style={styles.buttonText}>Connect to Education</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Image
              source={require('../../assets/hexagonLogo.png')}
              style={styles.poweredByLogo}
            />
          </View>
          <Text style={styles.footerText}>
            This program is protected by U.S and international copyright as
            described in the info/About box.
          </Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Versions: 9.4.23120</Text>
            <View style={styles.errorIcon}>
              <MaterialIcons
                name="error-outline"
                color="#00526F"
                size={25}
                style={{}}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    backgroundColor: '#ffffff',
    top: -20,
    flex: 0.8,
  },
  logo: {
    marginTop: 20,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: '#101828',
    marginTop: 15,
  },
  serverContainer: {
    padding: 2,
  },
  serverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginHorizontal: 14,
  },
  serverHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#344054',
  },
  input: {
    height: 83,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#00526F',
    borderRadius: 6,
  },
  button: {
    paddingHorizontal: 8,
    gap: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    backgroundColor: '#00526F',
    justifyContent: 'center',
  },
  disabledButton: {
    paddingHorizontal: 8,
    gap: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    opacity: 0.6,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  poweredByText: {
    color: '#475467',
  },
  poweredByLogo: {
    marginLeft: 13,
  },
  footerText: {
    textAlign: 'center',
    margin: 10,
    color: '#475467',
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 13,
    marginTop: 15,
    alignItems: 'center',
  },
  versionText: {
    color: '#475467',
  },
  errorIcon: {
    height: 45,
    width: 45,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderColor: '#EAECF2',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServerLogin;
