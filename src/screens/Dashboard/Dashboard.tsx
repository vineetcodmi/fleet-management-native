import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import LandingScreen from './LandingScreen';
import MainScreen from '../MainScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MapScreen from './MapScreen';
import colors from '../../utlits/colors';
import Logout from '../Setting/Logout';
const Dashboard = ({route}:any) => {
  const unitid=route.params.unitId;

  const [SelectedView, setSelectedView] = useState('');

  const selectView = (view: string) => {
    switch (view) {
      case 'LandingScreen':
        return <LandingScreen />;
      case 'MainScreen':
        return <MainScreen />;
      case 'MapScreen':
        return <MapScreen />;
      case 'Logout':
        return <Logout unitId={unitid}/>;
      default:
       return <LandingScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuBar}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            SelectedView === 'LandingScreen' && styles.activeMenuItem,
          ]}
          onPress={() => setSelectedView('LandingScreen')}>
          <Entypo
            name="laptop"
            size={24}
            color={colors.white}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            SelectedView === 'MainScreen' && styles.activeMenuItem,
          ]}
          onPress={() => setSelectedView('MainScreen')}>
          <Entypo
            name="menu"
            size={24}
            color={colors.white}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            SelectedView === '' && styles.activeMenuItem,
          ]}
          onPress={() => setSelectedView('')}>
          <Entypo
            name="star"
            size={24}
            color={colors.white}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <View style={{gap: 400}}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              SelectedView === 'MapScreen' && styles.activeMenuItem,
            ]}
            onPress={() => setSelectedView('MapScreen')}>
            <Entypo
              name="map"
              size={24}
              color={colors.white}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuItem,
              SelectedView === '' && styles.activeMenuItem,
            ]}
            onPress={() => setSelectedView('')}>
            <Entypo
              name="message"
              size={26}
              color={colors.white}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.menuItem,
            SelectedView === '' && styles.activeMenuItem,
          ]}
          onPress={() => setSelectedView('')}>
          <Entypo
            name="eye"
            size={24}
            color={colors.white}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            SelectedView === 'Logout' && styles.activeMenuItem,
          ]}
          onPress={() => setSelectedView('Logout')}>
          <AntDesign
            name="setting"
            size={24}
            color={colors.white}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.menuBarContent}>{selectView(SelectedView)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  menuBar: {
    flex: 0.1,
    backgroundColor: colors.black,
  },
  menuBarContent: {flex: 0.9, backgroundColor: 'white'},
  menuIcon: {
    marginLeft: 8,
  },
  menuItem: {
    paddingVertical: 8,
    // borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  activeMenuItem: {
    backgroundColor: '#ddd',
  },
});

export default Dashboard;
