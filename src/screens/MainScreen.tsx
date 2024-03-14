import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TabController} from 'react-native-ui-lib';
import colors from '../utlits/colors';

const EventsTabContent = () => <Text>Content of Events Tab</Text>;
const UnitsTabContent = () => <Text>Content of Units Tab</Text>;

const MainScreen = () => {
  return (
    <TabController
      items={[
        {label: 'Events'},
        {label: 'Units'},
      ]}>
      <TabController.TabBar
        backgroundColor={colors.primary}
        labelColor={colors.white}
        selectedLabelColor={colors.white}
        indicatorStyle={{backgroundColor: colors.white, height: 2}}
        labelStyle={{fontWeight: '700', fontSize: 15, color: colors.white}}
        selectedLabelStyle={{
          fontWeight: 'bold',
          fontSize: 16,
          color: colors.white,
        }}
      />
      <View style={styles.tabContent}>
        <TabController.TabPage index={0} lazy>
          <EventsTabContent />
        </TabController.TabPage>
        <TabController.TabPage index={1} lazy>
          <UnitsTabContent />
        </TabController.TabPage>
      </View>
    </TabController>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
