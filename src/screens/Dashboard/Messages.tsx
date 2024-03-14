
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import MapView from 'react-native-open-street-map';

const Messages = () => {
  return (
    <View style={styles.container}>
      <Text>hdhdhhdhd</Text>
      {/* <MapView
        style={styles.map}
        zoom={15}
        centerCoordinate={{ latitude: 37.78825, longitude: -122.4324 }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Messages;








