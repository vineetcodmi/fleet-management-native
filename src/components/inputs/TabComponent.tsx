// TabComponent.js

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../../utlits/colors';

const TabComponent = ({activeTab, handleTabPress}: any) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={{width: '50%'}}
          onPress={() => handleTabPress('Report')}>
          <Text
            style={[
              styles.tabText,
              {
                backgroundColor:
                  activeTab === 'Report'
                    ? colors.tabBackgroundColor
                    : '#F9FAFB',
                color: activeTab === 'Report' ? '#FFF' : '#000',
                borderTopLeftRadius: activeTab === 'Report' ? 4 : 0,
                borderBottomLeftRadius: activeTab === 'Report' ? 4 : 0,
                borderTopRightRadius: activeTab === 'Report' ? 4 : 0,
                borderBottomRightRadius: activeTab === 'Report' ? 4 : 0,
              },
            ]}>
            Dispatch Report
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: '50%'}}
          onPress={() => handleTabPress('Events')}>
          <Text
            style={[
              styles.tabText,
              {
                backgroundColor:
                  activeTab === 'Events'
                    ? colors.tabBackgroundColor
                    : '#F9FAFB',
                color: activeTab === 'Events' ? '#FFF' : '#000',
                borderTopLeftRadius: activeTab === 'Events' ? 4 : 0,
                borderBottomLeftRadius: activeTab === 'Events' ? 4 : 0,
                borderTopRightRadius: activeTab === 'Events' ? 4 : 0,
                borderBottomRightRadius: activeTab === 'Events' ? 4 : 0,
              },
            ]}>
            Pending Events(678)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appBackgroundColor,
    flex: 1,
  },
  events: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  allEvents: {color: colors.textBlueColor, fontSize: 18, fontWeight: 'bold'},
  tabContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorderColor,
  },
  tabsContainer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    backgroundColor: colors.grayBackgroundColor,
  },
  tabText: {
    paddingVertical: 7,
    fontSize: 14,
    textAlign: 'center',
  },
});
export default TabComponent;
