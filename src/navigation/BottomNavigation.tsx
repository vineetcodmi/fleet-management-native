import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Events from '../screens/Dashboard/Events';
import MapScreen from '../screens/Dashboard/MapScreen';
import FieldEvents from '../screens/Dashboard/FieldEvents';
import Deatils from '../screens/Dashboard/MoreDetails';
import Messages from '../screens/Dashboard/Messages';
import CustomTabBar from '../components/inputs/customTabBar';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{title: 'Map', headerShown: false}}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{title: 'My Events', headerShown: false}}
      />
      <Tab.Screen
        name="FieldEvents"
        component={FieldEvents}
        options={{title: 'Field Events', headerShown: false}}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{title: 'Message', headerShown: false}}
      />
      <Tab.Screen
        name="Deatils"
        component={Deatils}
        options={{title: 'More', headerShown: true}}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
