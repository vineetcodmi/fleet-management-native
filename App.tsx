import React, { useEffect } from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {AuthProvider} from './src/context/Auth';
import RootStack from './src/navigation/RootStack';
import colors from './src/utlits/colors';
import { LogLevel, OneSignal } from 'react-native-onesignal';

function App() {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize("9ca5757c-3454-48e9-88b7-3fbca64b174a");
  OneSignal.Notifications.requestPermission(true);
  return (
    <AuthProvider>
     <StatusBar backgroundColor={colors.black} />
     <GestureHandlerRootView style={{flex:1}}>
      <SafeAreaView style={{flex:1}}>
      <RootStack/>
      </SafeAreaView>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

export default App;



