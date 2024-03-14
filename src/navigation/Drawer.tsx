// AppDrawer.js

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomNavigation from './BottomNavigation';
import CustomDrawer from '../screens/Dashboard/DrawerContent';
import colors from '../utlits/colors';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
    // screenOptions={{ drawerStyle: { width: '80%' } }} // Fixed width of the drawer
      screenOptions={{
        swipeEnabled: true,
        drawerStyle: {
          width: '80%', 
          // backgroundColor:'red'
          padding:10,
          borderWidth:1
          // width: RFValue(240),
        },
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitle: 'Dashboard',
      }}
   
      
      
      drawerContent={props => <CustomDrawer {...props} />}>
      {/* <Drawer.Screen name={Routes.kMAINDASHBOARD} component={MainDashboard} /> */}
      <Drawer.Screen
        name="BottomNavigation"
        component={BottomNavigation}
      />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
