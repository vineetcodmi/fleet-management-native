import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/Splash/SplashScreen";
import BottomNavigation from "./BottomNavigation";
import routes from "../utlits/routes";
import ServerLogin from "../screens/Login/ServerLogin";
import LoginScreen from "../screens/Login/Login";
import ChangePassword from "../screens/Login/ChangePassword";
import AppDrawer from "./Drawer";
import Dashboard from "../screens/Dashboard/Dashboard";
import { Pressable, View, Modal, Text } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MapScreen from "../screens/Dashboard/MapScreen";
import LandingScreen from "../screens/Dashboard/LandingScreen";
import Summary from "../screens/Landing/Summary";
import Logout from "../screens/Setting/Logout";
import QrScanner from "../screens/ServerLogin/QrScanner";
import Event from "../screens/Notification/Event";
import { OneSignal } from "react-native-onesignal";
import { useAuth } from "../context/Auth";
import axios from "axios";
import DispatchNotifications from "../screens/Notification/DispatchNotification";
import Sound from "react-native-sound";
import FieldEvents from "../screens/Dashboard/FieldEvents";
import { EventsProvider } from "../context/Events";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const { user } = useAuth();
  const [showNotification, setshowNotification] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [notificationSoundPlay, setNotificationSoundPlay] = useState<any>(null);
  const handleToggleModal = () => {
    setModalVisible((prevState) => !prevState);
  };

  OneSignal.Notifications.addEventListener("click", (event) => {
    console.log("OneSignal: notification clicked:", event);
    setshowNotification(true);
  });

  OneSignal.Notifications.addEventListener("foregroundWillDisplay", (event) => {
    console.log("OneSignal: notification on foreground:", event);
    setshowNotification(true);
    const notificationSound = new Sound(
      "notification_sound.wav",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("Failed to load the sound", error);
          return;
        }
        console.log("Sound loaded successfully", notificationSound);
        setNotificationSoundPlay(notificationSound);
        notificationSound.play();
        // notificationSound.setVolume(1);
        notificationSound.setNumberOfLoops(1);
      }
    );
  });

  const saveDevice = async (device: any) => {
    try {
      const header = {
        headers: {
          "Content-Type": `application/json`,
        },
      };
      const response = await axios.post(
        `http://localhost:8000/api/users`,
        device,
        header
      );
      return response;
    } catch (error) {
      console.error("Error saving device:", error);
    }
  };

  const closeModal = () => {
    setshowNotification(false);
  };

  useEffect(() => {
    if (user) {
      const deviceId =
        OneSignal.User?.pushSubscription?.getPushSubscriptionId();
      const data = {
        deviceId: deviceId,
        unitId: user?.unitId,
      };
      saveDevice(data);
    }
  }, [user]);

  return (
   <EventsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={routes.kSplahScreen}
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={routes.KServerLogin}
            component={ServerLogin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={routes.KLoginScreen}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={routes.KChangePassword}
            component={ChangePassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={routes.KLandingScreen}
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={routes.kSummary}
            component={Summary}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={"Logout"}
            component={Logout}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={routes.KMapScreen}
            component={MapScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QrScanner"
            component={QrScanner}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={routes.KDashboard}
            component={Dashboard}
            options={{
              title: "Available(AV)",
              headerLeft: () => (
                <>
                  <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          backgroundColor: "#ccc",
                          marginTop: 55,
                          height: "30%",
                        }}
                      >
                        <Text>hellololo</Text>
                      </View>
                    </View>
                  </Modal>
                  <Pressable
                    onPress={handleToggleModal}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginRight: 22,
                    }}
                  >
                    <View>
                      <Entypo
                        name="menu"
                        size={26}
                        color="black"
                        style={{ marginLeft: -8 }}
                      />
                    </View>
                  </Pressable>
                </>
              ),
              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginRight: 22,
                  }}
                >
                  <View>
                    <FontAwesome
                      name="refresh"
                      size={26}
                      color="black"
                      style={{ marginLeft: -8 }}
                    />
                  </View>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="BottomNavigation"
            component={BottomNavigation}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="FieldEvents"
            component={FieldEvents}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AppDrawer"
            component={AppDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Event"
            component={Event}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotification}
      >
        <DispatchNotifications
          closeModal={closeModal}
          notificationSound={notificationSoundPlay}
        />
      </Modal>
      </EventsProvider>
  );
};

export default RootStack;
