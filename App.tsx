import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {AuthProvider} from './src/context/Auth';
import RootStack from './src/navigation/RootStack';
import colors from './src/utlits/colors';

function App() {
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



