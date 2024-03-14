import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation, route }: any) => {
  const productionData = route.params;
  const { login, getUser, user } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const userId = values?.userId;
      const password = values?.password;
      const unitId = values?.unitId;
      const token = await login(userId, password);
      if (token) {
        getUser(unitId);
        console.log(user, "userr");

        navigation.replace('BottomNavigation');
      } else {
        console.error('Login failed: Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Login Failed',
        'Please check your credentials and try again.',
      );
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const passwordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const initialValues = {
    userId: '',
    unitId: '',
    password: '',
    // userId: 'wgc',
    // unitId: 'ABN1661',
    // password: '112',
  };

  const validationSchema = Yup.object().shape({
    userId: Yup.string().required('User ID is required'),
    unitId: Yup.string().required('Unit ID is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageBackground
          source={require('../../assets/background.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <Image
            source={require('../../assets/integraphLogo.png')}
            style={styles.logo}
          />
        </ImageBackground>
      </View>
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.heading}>INTEGRAPH MOBILE RESPONDER</Text>
          <Formik
            onSubmit={handleLogin}
            initialValues={initialValues}
            validationSchema={validationSchema}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.form}>
                <Text style={styles.label}>USER ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter user ID"
                  onChangeText={handleChange('userId')}
                  onBlur={handleBlur('userId')}
                  value={values.userId}
                />
                {touched.userId && errors.userId && (
                  <Text style={styles.errorText}>{errors.userId}</Text>
                )}

                <Text style={styles.label}>UNIT ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter unit ID"
                  onChangeText={handleChange('unitId')}
                  onBlur={handleBlur('unitId')}
                  value={values.unitId}
                />
                {errors.unitId && touched.unitId && (
                  <Text style={styles.errorText}>{errors.unitId}</Text>
                )}
                <Text style={styles.label}>PASSWORD</Text>
                <View
                  style={{
                    position: 'relative',
                  }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity
                    onPress={passwordVisibility}
                    style={{ position: 'absolute', top: 25, right: 28 }}>
                    <MaterialIcons
                      name="remove-red-eye"
                      size={20}
                      color="#00526F"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <View style={styles.row}>
                  <Pressable style={styles.row} onPress={toggleRememberMe}>
                    <View style={styles.checkBox}>
                      {rememberMe && (
                        <MaterialIcons name="check" size={25} color="#00526F" />
                      )}
                    </View>
                    <Text style={styles.rememberMe}>Remember me</Text>
                  </Pressable>
                  <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot password</Text>
                  </TouchableOpacity>
                </View>
                {loading ? (
                  <ActivityIndicator color="gray" />
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSubmit()}>
                    <Text style={styles.buttonText}>Log in</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Formik>

          <View style={styles.poweredBy}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Image
              source={require('../../assets/hexagonLogo.png')}
              style={styles.hexagonLogo}
            />
          </View>
          <Text style={styles.footerText}>
            This program is protected by U.S and international copyright as
            described in the info/About box.
          </Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Versions:{productionData?.productionData?.version ?? ''}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={styles.errorIcon}>
                <Ionicons name="link-outline" size={20} color="#00526F" />
              </View>
              <View style={styles.errorIcon}>
                <MaterialIcons name="error-outline" color="#00526F" size={20} />
              </View>
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
    backgroundColor: 'white',
  },
  header: {
    flex: 0.2,
  },
  backgroundImage: {
    flex: 1,
  },
  logo: {
    position: 'absolute',
    marginTop: 20,
    alignSelf: 'center',
  },
  content: {
    flex: 0.8,
    padding: 6,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    backgroundColor: '#ffffff',
    top: -20,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: '#101828',
    marginTop: 15,
  },
  form: {
    padding: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 10,
    marginLeft: 13,
    color: '#344054',
  },
  input: {
    height: 45,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#00526F',
    borderRadius: 6,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 6,
    marginRight: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  rememberMe: {
    color: 'black',
    fontSize: 13,
    marginLeft: 10,
  },
  forgotPassword: {
    color: '#00526F',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    height: 40,
    borderRadius: 6,
    marginHorizontal: 12,
    marginTop: 12,
  },
  poweredBy: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  poweredByText: {
    color: '#475467',
  },
  hexagonLogo: {
    marginLeft: 13,
  },
  footerText: {
    textAlign: 'center',
    marginHorizontal: 8,
    marginTop: 10,
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
    height: 36,
    width: 36,
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
    borderColor: '#EAECF0',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    backgroundColor: '#00526F',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 12,
  },
  checkBox: {
    height: 36,
    width: 36,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#00526F',
  },
});

export default LoginScreen;
