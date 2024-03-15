import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TabController } from 'react-native-ui-lib';
import colors from '../../utlits/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import General from '../Notification/General';

const UnitsTabContent = () => <Text>Content of Units Tab</Text>;

const Event = ({navigation}:any) => {
  return (
    <View style={{flex:1}}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingHorizontal:15,paddingVertical:15,alignItems:'center',backgroundColor:colors.white,borderBottomWidth:1,borderBlockColor:colors.grayBorderColor}}>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="west" size={25} color={colors.iconGrayColor} />
       </TouchableOpacity>
          <Text style={{fontSize:18,color:'#101828',marginLeft:15}}>P230731000023</Text>
        </View>
        <View style={{flexDirection:'row',gap:8}}>
        <View style={styles.icon}>
          <MaterialIcons name="file-open" color="#00526F" size={20} />
        </View>
        <View style={styles.icon}>
          <MaterialIcons name="file-upload" color="#00526F" size={20} />
        </View>
        <View style={styles.icon}>
          <MaterialIcons name="refresh" color="#00526F" size={20} />
        </View>
        </View>
      </View>
      <TabController
        items={[
          { label: 'General' },
          { label: 'Media' },
          { label: 'Support' },
          { label: 'STG' },
          { label: 'Lol' },
        ]}>
        <TabController.TabBar
          backgroundColor={colors.white}
          labelColor={colors.iconGrayColor}
          selectedLabelColor={colors.tabBackgroundColor}
          indicatorStyle={{ backgroundColor: colors.black, height: 10 }}
          labelStyle={{ fontWeight: '700', fontSize: 15, color: colors.white }}
          selectedLabelStyle={{
            fontWeight: 'bold',
            fontSize: 16,
            color: colors.white,
          }}
        />
        <View style={styles.tabContent}>
          <TabController.TabPage index={0} lazy>
            < General/>
          </TabController.TabPage>
          <TabController.TabPage index={1} lazy>
            <UnitsTabContent />
          </TabController.TabPage>
          <TabController.TabPage index={2} lazy>
            <UnitsTabContent />
          </TabController.TabPage>
          <TabController.TabPage index={3} lazy>
            <UnitsTabContent />
          </TabController.TabPage>
          <TabController.TabPage index={4} lazy>
            <UnitsTabContent />
          </TabController.TabPage>
        </View>
      </TabController>
       
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  tabContent: {
    flex: 1
  },
  icon:{
    height: 36,
    width: 36,
    borderRadius: 4,
    backgroundColor: colors.grayBackgroundColor,
    borderColor: colors.borderColor,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLeft: {flexDirection: 'row', alignItems: 'center'},
  notificationIcon: {
    height: 35,
    width: 35,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontWeight: 'bold',
    color: colors.textBlueColor,
    marginLeft: 8,
    fontSize: 15,
  },
  rowRight: {flexDirection: 'row', gap: 8},
  iconContainer: {
    height: 35,
    width: 35,
    backgroundColor: colors.grayBackgroundColor,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.tabBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default Event;