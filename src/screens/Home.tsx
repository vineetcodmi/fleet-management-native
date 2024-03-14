import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LoginScreen from './Login/Login';
import ChangePassword from './Login/ChangePassword';

const Home = () => {
  const [SelectedView, setSelectedView] = useState('');

  const selectView = (view: string) => {
    switch (view) {
      case 'Login':
        return <LoginScreen />;
      case 'changePassword':
        return <ChangePassword/>
    }
  };

  return (
    <View style={{flexDirection: 'row', flex: 1}}>
      <View style={{flex: 0.1, backgroundColor: 'red'}}>
        <TouchableOpacity onPress={() => setSelectedView("Login")}>
          <Text>aaa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedView('changePassword')}>
          <Text>bbb</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedView('ccc')}>
          <Text>ccc</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.9, backgroundColor: 'yellow'}}>
        {selectView(SelectedView)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '18%',
    backgroundColor: 'black',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeMenuItem: {
    backgroundColor: '#ddd',
  },
});

export default Home;

// return (
//   <View style={styles.container}>
//     <TouchableOpacity
//       style={[
//         styles.menuItem,
//         activeMenu === 'Home' && styles.activeMenuItem,
//       ]}
//       onPress={handleData}>
//       <Text style={{color: 'white'}}>Home</Text>
//     </TouchableOpacity>
//     <TouchableOpacity
//       style={[
//         styles.menuItem,
//         activeMenu === 'Profile' && styles.activeMenuItem,
//       ]}
//       onPress={() => handleMenuPress('Profile')}>
//       <Text style={{color: 'white'}}>Profile</Text>
//     </TouchableOpacity>
//     <TouchableOpacity
//       style={[
//         styles.menuItem,
//         activeMenu === 'Settings' && styles.activeMenuItem,
//       ]}
//       onPress={() => handleMenuPress('Settings')}>
//       <Text style={{color: 'white'}}>Settings</Text>
//     </TouchableOpacity>
//     {/* Add more menu items as needed */}
//   </View>
// );
