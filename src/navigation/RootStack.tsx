import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/Splash/SplashScreen';
import BottomNavigation from './BottomNavigation';
import routes from '../utlits/routes';
import ServerLogin from '../screens/Login/ServerLogin';
import LoginScreen from '../screens/Login/Login';
import ChangePassword from '../screens/Login/ChangePassword';
import AppDrawer from './Drawer';
import Dashboard from '../screens/Dashboard/Dashboard';
import {Pressable, View, Modal, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapScreen from '../screens/Dashboard/MapScreen';
import LandingScreen from '../screens/Dashboard/LandingScreen';
import Summary from '../screens/Landing/Summary';
import Logout from '../screens/Setting/Logout';
import QrScanner from '../screens/ServerLogin/QrScanner';
import Event from '../screens/Notification/Event';
const Stack = createNativeStackNavigator();

const RootStack = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const handleToggleModal = () => {
    setModalVisible(prevState => !prevState);
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={routes.kSplahScreen}
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={routes.KServerLogin}
          component={ServerLogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={routes.KLoginScreen}
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={routes.KChangePassword}
          component={ChangePassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={routes.KLandingScreen}
          component={LandingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={routes.kSummary}
          component={Summary}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Logout'}
          component={Logout}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={routes.KMapScreen}
          component={MapScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="QrScanner"
          component={QrScanner}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={routes.KDashboard}
          component={Dashboard}
          options={{
            title: 'Available(AV)',
            headerLeft: () => (
              <>
                <Modal
                  visible={isModalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setModalVisible(false)}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: '#ccc',
                        marginTop: 55,
                        height: '30%',
                      }}>
                      <Text>hellololo</Text>
                    </View>
                  </View>
                </Modal>
                <Pressable
                  onPress={handleToggleModal}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginRight: 22,
                  }}>
                  <View>
                    <Entypo
                      name="menu"
                      size={26}
                      color="black"
                      style={{marginLeft: -8}}
                    />
                  </View>
                </Pressable>
              </>
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 22,
                }}>
                <View>
                  <FontAwesome
                    name="refresh"
                    size={26}
                    color="black"
                    style={{marginLeft: -8}}
                  />
                </View>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AppDrawer"
          component={AppDrawer}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="Event"
          component={Event}
          options={{headerShown: false}}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
