import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Summary from '../Landing/Summary';
import {TabController} from 'react-native-ui-lib';
import colors from '../../utlits/colors';


const PropertiesTabContent = () => <Text>Content of Properties Tab</Text>;
const TransferTabContent = () => <Text>Content of Transfer Tab</Text>;
const HistoryTabContent = () => <Text>Content of History Tab</Text>;

const LandingScreen = () => {
  return (
    <TabController
      items={[
        {label: 'SUMMARY'},
        {label: 'PROPERTIES'},
        {label: 'TRANSFER'},
        {label: 'HISTORY'},
      ]}
      >
      <TabController.TabBar
        backgroundColor={colors.primary}
        labelColor={colors.white}
        selectedLabelColor={colors.white}
        indicatorStyle={{backgroundColor: colors.white, height: 2}}
        labelStyle={{fontWeight: '100', fontSize: 15, color: colors.white}}
        selectedLabelStyle={{
          fontWeight: 'bold',
          fontSize: 15,
          color: colors.white,
        }}
      />
      <View style={styles.tabContent}>
        <TabController.TabPage index={0} lazy>
          <Summary />
        </TabController.TabPage>
        <TabController.TabPage index={1} lazy>
          <PropertiesTabContent />
        </TabController.TabPage>
        <TabController.TabPage index={2} lazy>
          <TransferTabContent />
        </TabController.TabPage>
        <TabController.TabPage index={3} lazy>
          <HistoryTabContent />
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

export default LandingScreen;
