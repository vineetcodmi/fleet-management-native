import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAuth} from '../../context/Auth';
import axios from 'axios';
import {baseUrl} from '../../config';
import colors from '../../utlits/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import EventsDetails from '../../components/inputs/EventsDetails';
import UnitDetails from '../../components/inputs/UnitDetails';
import MapBox from '../MapScreen/MapBox';
import MapMyIndia from '../MapScreen/MapMyIndia';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import StatusCodesComponent from '../MapScreen/StatusCode';
interface Marker {
  id: string;
  coordinate: [number, number];
}

interface EventData {}
interface UnitData {}
interface statuscode{
  beat:string
}

const MapScreen = () => {
  const {token, user} = useAuth();
  const [markersEvents, setMarkersEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markersUnit, setMarkersUnit] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [eventData, setEventData] = useState<EventData | null>();
  const [currentLocation, setCurrentLocation] = useState<[number, number]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleStatusCode, setModalVisibleStatusCode] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [unitData, setUnitData] = useState<UnitData | null>();
  const [statusCodeData, setStatusCodeData] = useState<statuscode[]>([]);

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };
  const [selectedOption, setSelectedOption] = useState('mapMyIndia');
  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
  };

  const getUnitStatus = (unit:any) => {
    const currentStatus = statusCodeData?.filter((status:any) => status?.id === unit?.status)?.[0];
    return currentStatus;
  }

  useEffect(() => {
    getCurrentLocation();
  });
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        setCurrentLocation([position.coords.longitude, position.coords.latitude])
      },
      (error: any) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const fetchData = async () => {
    try {
      const toToken = `Bearer ${token}`;
      const [eventResponse, unitResponse] = await Promise.all([
        axios.get(baseUrl + '/cad/api/v2/event/monitor', {
          headers: {
            Authorization: toToken,
          },
        }),
        axios.get(baseUrl + '/cad/api/v2/unit/monitor', {
          headers: {
            Authorization: toToken,
          },
        }),
      ]);
      const eventResponseData = eventResponse?.data;
      const unitResponseData = unitResponse?.data;
      const eventMarkersData = eventResponseData.map((item: any) => {
        const location = item?.location;
        const id = item?.agencyEventId;
        const pattern =
          /LL\(([\d]+:[\d]+:[\d]+\.\d+),([\d]+:[\d]+:[\d]+\.\d+)\)/;
        const match = location.match(pattern);
        if (match) {
          const [latString, lngString] = match.slice(1);
          const latParts = latString.split(':').map(parseFloat);
          const lngParts = lngString.split(':').map(parseFloat);
          const lat = (
            latParts[0] +
            latParts[1] / 60 +
            latParts[2] / 3600
          ).toFixed(2);
          const lng = (
            lngParts[0] +
            lngParts[1] / 60 +
            lngParts[2] / 3600
          ).toFixed(2);
          return {id, coordinate: [parseFloat(lat), parseFloat(lng)]};
        } else {
          return null;
        }
      });
      const filteredEventCoordinates = eventMarkersData.filter(
        (coordinate: any) => coordinate !== null,
      );
      const unitMarkersData = unitResponseData.map((item: any) => {
        const lng = item?.latitude;
        const lat = item?.longitude;
        const id = item?.unitId;
        return {id: id, coordinate: [parseFloat(lat), parseFloat(lng)]};
      });
      setMarkersEvents(filteredEventCoordinates?.slice(0, 10));
      setMarkersUnit(unitMarkersData?.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    StatusCode();
  }, []);

  const onPress = async (event: any) => {
    const {geometry} = event;
    const longitude = geometry.coordinates[0];
    const latitude = geometry.coordinates[1];
    try {
      const response = await fetch(
        `https://apis.mapmyindia.com/advancedmaps/v1/${'b7007d03ff55240db694b0b7563fc5c5'}/rev_geocode?lat=${latitude}&lng=${longitude}`,
      );
      const data = await response.json();
      console.log(data, 'datatat');
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        console.log('Address:', address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const closeModalStatusCode = () => {
    setModalVisibleStatusCode(false);
  };
  const closeUnitModal = () => {
    setUnitModalVisible(false);
  };
  const StatusCode = async () => {
    try {
      const response = await axios.get(
        baseUrl + '/cad/api/v2/unit/statuscodes',
        header,
      );
      setStatusCodeData(response.data); 
    } catch (err) {
      console.log(err, 'my errorr');
    }
  };
  const handleMarkerEventsClick = async (id: string) => {
    try {
      const toToken = `Bearer ${token}`;
      axios
        .get(baseUrl + `/cad/api/v2/event/${id}`, {
          headers: {
            Authorization: toToken,
          },
        })
        .then(res => {
          setEventData(res.data);
          setModalVisible(true);
        });
    } catch (error) {
      console.log(error, 'error');
      setLoading(false);
    }
  };
  const handleMarkerUnitClick = async (id: string) => {
    try {
      const toToken = `Bearer ${token}`;
      axios
        .get(baseUrl + `/cad/api/v2/unit/${id}`, {
          headers: {
            Authorization: toToken,
          },
        })
        .then(res => {
          setUnitData(res.data);
          setUnitModalVisible(true);
          console.log(res.data, 'unit datattata');
        });
    } catch (error) {
      console.log(error, 'error');
      setLoading(false);
    }
  };
  const marker = [
    {
      id: 'marker30',
      coordinate: [80.94, 26.85],
    },
  ];
  const marker1: Marker[] = [
    {
      id: 'marker1',
      coordinate: [79, 26],
    },
    {
      id: 'marker2',
      coordinate: [83.069660604235665, 26.33857106608006],
    },
  ];

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 0.9}}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.black}
            style={{alignContent: 'center'}}
          />
        ) : selectedOption === 'mapMyIndia' ? (
          <MapMyIndia
            eventMarker={markersEvents}
            unitMarker={markersUnit}
            activeTab={activeTab}
            handleMarkerEventsClick={handleMarkerEventsClick}
            handleMarkerUnitClick={handleMarkerUnitClick}
            statusCodeData={statusCodeData}
          />
        ) : (
          <MapBox
            eventMarker={markersEvents}
            unitMarker={markersUnit}
            activeTab={activeTab}
            eventData={eventData}
            handleMarkerEventsClick={handleMarkerEventsClick}
            handleMarkerUnitClick={handleMarkerUnitClick}
            statusCodeData={statusCodeData}
            currentLocation={currentLocation}
          />
        )}
      </View>
      <View
        style={{
          padding: 10,
          flex: 0.14,
          borderTopWidth: 1,
          borderTopColor: '#D0D5DD',
          backgroundColor: colors.white,
        }}>
        <View
          style={{
            height: 44,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#EAECF0',
              borderRadius: 6,
              backgroundColor: '#F9FAFB',
            }}>
            <TouchableOpacity onPress={() => handleTabPress('All')}>
              <Text
                style={{
                  paddingHorizontal: 20,
                  fontSize: 14,
                  height: 36,
                  padding: 8,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                  backgroundColor: activeTab === 'All' ? '#00526F' : '#F9FAFB',
                  borderRadius: activeTab === 'All' ? 4 : 0,
                  color: activeTab === 'All' ? '#FFF' : '#000',
                }}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress('Events')}>
              <Text
                style={{
                  paddingHorizontal: 20,
                  fontSize: 14,
                  height: 36,
                  padding: 8,
                  backgroundColor:
                    activeTab === 'Events' ? '#00526F' : '#F9FAFB',
                  borderRadius: activeTab === 'Events' ? 4 : 0,
                  color: activeTab === 'Events' ? '#FFF' : '#000',
                }}>
                Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress('Units')}>
              <Text
                style={{
                  paddingHorizontal: 20,
                  fontSize: 14,
                  height: 36,
                  padding: 8,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                  backgroundColor:
                    activeTab === 'Units' ? '#00526F' : '#F9FAFB',
                  borderRadius: activeTab === 'Units' ? 4 : 0,
                  color: activeTab === 'Units' ? '#FFF' : '#000',
                }}>
                Units
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', gap: 8}}>
            <TouchableOpacity style={styles.Icon}>
              <AntDesign name="filter" size={22} color="#00526F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.Icon}>
              <MaterialIcons name="sort-by-alpha" color="#00526F" size={22} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 30,
            backgroundColor: colors.white,
            marginTop: 10,
            marginLeft: 2,
          }}>
          <TouchableOpacity onPress={() => handleOptionChange('mapMyIndia')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  marginRight: 10,
                  borderColor:
                    selectedOption === 'mapMyIndia'
                      ? colors.tabBackgroundColor
                      : 'gray',
                  backgroundColor:
                    selectedOption === 'mapMyIndia'
                      ? colors.tabBackgroundColor
                      : 'transparent',
                }}
              />
              <Text>Map My India</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionChange('mapbox')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  marginRight: 10,
                  borderColor:
                    selectedOption === 'mapbox'
                      ? colors.tabBackgroundColor
                      : 'gray',
                  backgroundColor:
                    selectedOption === 'mapbox'
                      ? colors.tabBackgroundColor
                      : 'transparent',
                }}
              />
              <Text>Map Box</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <EventsDetails closeModal={closeModal} data={eventData} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={unitModalVisible}
        onRequestClose={closeUnitModal}>
        <UnitDetails closeModal={closeUnitModal} data={unitData} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleStatusCode}
        onRequestClose={closeModalStatusCode}>
        <StatusCodesComponent closeModal={closeModalStatusCode} statusCodeData={statusCodeData}/>
      </Modal>
      <View
        style={{
          position: 'absolute',
          top: 20,
          left: 10,
          right: 10,
          padding: 6,
          backgroundColor: colors.white,
          zIndex: 1,
          borderRadius: 3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 35,
              width: 35,
              backgroundColor: 'green',
              borderRadius: 3,
            }}>
            <MaterialCommunityIcons
              name="car-outline"
              size={20}
              color={colors.white}
            />
          </View>
          <Text style={{color: colors.grayTextColor,marginHorizontal:20}}>{getUnitStatus(user)?.description||''}</Text>
          <SimpleLineIcons
            name="refresh"
            size={20}
            color={colors.grayBorderColor}
          />
          <TouchableOpacity  onPress={() => setModalVisibleStatusCode(true)}
            style={{
              height: 35,
              width: 35,
              borderRadius: 20,
              backgroundColor: colors.grayBackgroundColor,
              borderColor: colors.grayBorderColor,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal:20,
              
            }}>
            <Entypo
              name="chevron-small-down"
              size={20}
              color={colors.grayBorderColor}
             
            />
          </TouchableOpacity>

          <View
            style={{
              height: 35,
              width: '24%',
              borderRadius: 20,
              backgroundColor: colors.grayBackgroundColor,
              borderColor: colors.grayBorderColor,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'center'}}>
              <Text style={{color: colors.grayTextColor,fontSize:12,marginLeft:10}}>{user?.beat}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={25}
                color={colors.grayBorderColor}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Icon: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
    borderColor: '#EAECF0',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MapScreen;