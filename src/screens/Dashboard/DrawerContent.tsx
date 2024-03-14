import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'

const CustomSidebar = ({ navigation }:any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Icon name="menu-fold" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={24} color="black" />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon name="setting" size={24} color="black" />
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: 200, // Customize the width as needed
    paddingTop: 50, // Adjust according to your design
    paddingHorizontal: 10, // Adjust according to your design
  },
  iconContainer: {
    alignItems: 'flex-start',
    marginBottom: 20, // Adjust according to your design
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Adjust according to your design
  },
  text: {
    marginLeft: 10, // Adjust according to your design
  },
});

export default CustomSidebar;
