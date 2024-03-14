import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomTabBar = ({state, descriptors, navigation}: any) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#D0D5DD',
        height: 82,
        backgroundColor: '#FFF',
      }}>
      {state.routes.map((route: any, index: any) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isFocused ? '#FFF' : 'transparent',
              borderTopWidth: isFocused ? 2 : 0,
              borderTopColor: isFocused ? '#00526F' : 'transparent',
            }}>
            <MaterialIcons
              name={
                label === 'My Events'
                  ? 'dataset'
                  : label === 'Map'
                  ? 'map'
                  : label === 'Field Events'
                  ? 'add'
                  : label === 'More'
                  ? 'more-horiz'
                  : 'message'
              }
              size={24}
              color={isFocused ? '#00526F' : '#60758D'}
            />
            <Text
              style={{color: isFocused ? '#00526F' : '#60758D', fontSize: 12}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles =StyleSheet.create({
  
})

export default CustomTabBar;
