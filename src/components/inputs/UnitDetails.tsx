import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ValidationError} from 'yup';
import colors from '../../utlits/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const UnitDetails = ({closeModal, data}: any) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 18,
          paddingHorizontal: 18,
          justifyContent: 'flex-end'
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.title}>Units Detail</Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeModal}>
            <MaterialIcons name="close" color="#00526F" size={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeft}>
              <View
                style={[styles.notificationIcon, {backgroundColor: '#FF832C'}]}>
                <MaterialIcons
                  name="directions-run"
                  color={colors.white}
                  size={22}
                />
              </View>
              <Text style={styles.notificationText}> {data?.unitId}</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={styles.iconContainer}>
                <Feather
                  name="map"
                  color={colors.tabBackgroundColor}
                  size={18}
                />
              </View>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="add-comment"
                  color={colors.tabBackgroundColor}
                  size={22}
                />
              </View>
            </View>
          </View>
          <View style={[styles.details]}>
            <Text style={styles.leftText}>{data?.permanentLocation}</Text>
            <Text style={styles.leftText}> 10 KM away</Text>
          </View>
          <View
            style={[
              styles.details,
              {
                borderTopWidth: 1,
                borderColor: colors.grayBorderColor,
              },
            ]}>
            <Text style={[styles.leftText, {marginTop: 10}]}>Unit Type</Text>
            <Text style={[styles.rightText, {marginTop: 10}]}>
              {data?.unitType}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.leftText}>Agency</Text>
            <Text style={styles.rightText}> {data?.agencyId}</Text>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              marginTop: 10,
              borderColor: colors.grayBorderColor,
            }}>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View style={styles.pending}>
                <MaterialIcons name="call-merge" color="#FF832C" size={20} />
                <Text style={{marginLeft: 7, color: colors.textBlueColor}}>
                  Dispatch
                </Text>
              </View>

              <View style={styles.dateContainer}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons
                    name="notification-important"
                    color="#60758D"
                    size={20}
                  />
                  <Text style={{color: colors.textBlueColor, marginLeft: 10}}>
                    hhehh
                    {/* {moment(data?.createdTime).format('DD/MM/YYYY - HH-mm-ss')} */}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1,position:'absolute',bottom:0},
  title: {fontSize: 20, color: '#101828', fontWeight: 'bold'},
  contentContainer: {
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 8,
    borderColor: colors.grayBorderColor,
    padding: 10,
  },
  rowContainer: {flexDirection: 'row', justifyContent: 'space-between'},
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
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  leftText: {color: colors.grayTextColor},
  rightText: {color: colors.textBlueColor, fontWeight: 'bold'},
  longContainer: {
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderRadius: 4,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 8,
  },
  latLongText: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 4,
    color: '#344054',
  },
  latContainer: {
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 8,
  },
  callerContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#D0D5DD',
    marginTop: 10,
    borderRadius: 4,
    padding: 5,
    backgroundColor: colors.grayBackgroundColor,
  },
  pending: {
    width: '40%',
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  arrowIcon: {
    height: 15,
    width: 15,
    borderRadius: 24,
    backgroundColor: colors.redIcon,
    alignItems: 'center',
    alignSelf: 'center',
  },
  dateContainer: {
    width: '60%',
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderRadius: 4,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 8,
  },
  closeModal: {
    height: 35,
    width: 35,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: '#EAECF0',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UnitDetails;
