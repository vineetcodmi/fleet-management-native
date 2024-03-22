import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../utlits/colors';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {useAuth} from '../../context/Auth';

const EventsDetails = ({closeModal, data}: any) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    console.log(data?.callData?.callerPhoneNumber,"numberrere");
    
    const pattern = /LL\(([\d]+:[\d]+:[\d]+\.\d+),([\d]+:[\d]+:[\d]+\.\d+)\)/;
    const match = data?.location?.match(pattern);
    if (match) {
      const [latString, lngString] = match.slice(1);
      const latParts = latString.split(':').map(parseFloat);
      const lngParts = lngString.split(':').map(parseFloat);
      const lat = (latParts[0] + latParts[1] / 60 + latParts[2] / 3600).toFixed(
        4,
      );
      const lng = (lngParts[0] + lngParts[1] / 60 + lngParts[2] / 3600).toFixed(
        4,
      );
      setLatitude(lat);
      setLongitude(lng);
    }
  }, [data]);


  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 18,
          paddingHorizontal: 18,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.title}>Events Detail</Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeModal}>
            <MaterialIcons name="close" color="#00526F" size={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.notificationIcon,
                  {backgroundColor: colors.black},
                ]}>
                <MaterialIcons
                  name="notification-important"
                  color={colors.white}
                  size={22}
                />
              </View>
              <Text style={styles.notificationText}>
                {' '}
                {data?.agencyEventId}
              </Text>
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
                  name="open-in-new"
                  color={colors.tabBackgroundColor}
                  size={22}
                />
              </View>
            </View>
          </View>
          <View style={styles.details}>
            <Text style={styles.leftText}>Event Type</Text>
            <Text style={styles.rightText}>{data?.agencyEventTypeCode}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.leftText}>Event Sub Type</Text>
            <Text style={styles.rightText}>
              {' '}
              {data?.agencyEventSubtypeCode}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View
              style={{
                width: '50%',
              }}>
              <Text style={styles.latLongText}>LAT</Text>
              <View style={styles.latContainer}>
                <Text style={{color: colors.textBlueColor}}>{latitude}</Text>
              </View>
            </View>
            <View
              style={{
                width: '50%',
              }}>
              <Text style={styles.latLongText}>LONG</Text>
              <View style={styles.longContainer}>
                <Text style={{color: colors.textBlueColor}}>{longitude}</Text>
              </View>
            </View>
          </View>
          <View style={styles.callerContainer}>
            <View>
              <Text style={{color: colors.textBlueColor}}>
                {data?.callData?.callerPhoneNumber}
              </Text>
              <Text style={{color: '#344054'}}>Caller Number</Text>
            </View>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name="call"
                color={colors.tabBackgroundColor}
                size={20}
              
              />
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              marginTop: 10,
              borderColor: colors.grayBorderColor,
            }}>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View style={styles.pending}>
                <MaterialIcons
                  name="warning"
                  color={colors.pendingIconColor}
                  size={17}
                />
                <Text style={{marginLeft: 7, color: colors.textBlueColor}}>
                  Pending
                </Text>
              </View>
              <View style={styles.POcontainer}>
                <View style={styles.arrowIcon}>
                  <MaterialIcons
                    name="arrow-upward"
                    color={colors.white}
                    size={13}
                  />
                </View>
                <Text style={{marginLeft: 7, color: colors.textBlueColor}}>
                  PO
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Text style={{color: colors.textBlueColor}}>
                  {moment(data?.createdTime).format('DD/MM/YYYY - HH-mm-ss')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, position: 'absolute', bottom: 0},
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
    width: '30%',
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  POcontainer: {
    width: '20%',
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '50%',
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

export default EventsDetails;
