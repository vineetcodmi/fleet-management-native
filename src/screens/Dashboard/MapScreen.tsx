import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid, Platform
} from 'react-native';
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
import { useEvents } from '../../context/Events';
import {useAuth} from '../../context/Auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STATUS_CODE_COLOR, STATUS_CODE_ICON } from '../../constant/statusCodeConstant';
import { Image } from 'react-native';
interface Marker {
  id: string;
  coordinate: [number, number];
}

interface EventData {}
interface UnitData {}

const MapScreen = ({navigation}:any) => {
  const {token,user,getUser} = useAuth();
  const{unitsStatusCode}=useEvents();
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

  // useEffect(() => {
  //   if(user){
  //     const getDispatchEvent = async () => {
  //       if([7,8,9,15]?.includes(user?.status || 0) && user?.assignedAgencyEventId){
  //         try {
  //           const toToken = `Bearer ${token}`;
  //           const response = await axios.get(baseUrl + `/cad/api/v2/event/${user?.assignedAgencyEventId}`, {
  //             headers: {
  //               Authorization: toToken,
  //             },
  //           });
  //           const dispatchData = response.data;
  //           if(dispatchData){
  //             navigation.navigate("Event", { item: dispatchData, isDispatch: true });
  //           }
  //         } catch (error) {
  //           console.error("Error fetching dispatch data:", error);
  //         }
  //       }
  //     };
  //     getDispatchEvent();
  //   }
  // },[user])

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };
  const [selectedOption, setSelectedOption] = useState('mapMyIndia');
  const handleOptionChange = async(option: any) => {
    setSelectedOption(option);
    await AsyncStorage.setItem("map", option);
  };


  const getUnitStatus = (unit:any) => {    
    const currentStatus = unitsStatusCode?.filter((status:any) => status?.id === unit?.status)?.[0];
    return currentStatus;
  }

  useEffect(() => {
    const getUnitLiveLocation = async() => {
      const currentLocationCoords:any = await getCurrentLocation();
      const unitId = await AsyncStorage.getItem("unitId");
      
      const data = {
        unitId: unitId || "",
        deviceId: unitId || "",
        latitude: (currentLocationCoords?.latitude|| "").toString(),
        longitude: (currentLocationCoords?.longitude || "").toString(),
        heading: (currentLocationCoords?.heading|| "0").toString(),
        speedKph: (currentLocationCoords?.speed|| "0").toString(),
      }
      console.log(data, "hh");
      
      await axios.post(baseUrl + `/cad/api/v2/unit/livelocation`, data, header).then((res) => {
        getUser(unitId, token)
      }).catch((err) => {
        console.log(err, "oooo");
      });
    }
    const interval = setInterval(() => {
      getUnitLiveLocation();
    }, 3 * 60 * 1000);
    getUnitLiveLocation();
    return () => clearInterval(interval);
  },[]);

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              (position:any) => {
                const { latitude, longitude, heading, speed } = position.coords;
                const locationData:any = { latitude, longitude, heading, speed };
                setCurrentLocation(locationData);
                resolve(locationData);
              },
              (error:any) => {
                console.log(error.code, error.message);
                resolve(null); // Resolve with null if there's an error
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
          });
        } else {
          console.log('Location permission denied');
          return null;
        }
      } else {
        // For iOS, location permission is requested when the app is in use.
        return new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            (position:any) => {
              const { latitude, longitude, heading, speed } = position.coords;
              const locationData:any = { latitude, longitude, heading, speed };
              setCurrentLocation(locationData);
              resolve(locationData);
            },
            (error:any) => {
              console.log(error.code, error.message);
              resolve(null); // Resolve with null if there's an error
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        });
      }
    } catch (err) {
      console.warn(err);
      return null;
    }
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
        const match = location?.match(pattern);
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
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeModalStatusCode = () => {
    setModalVisibleStatusCode(false);
  };
  const closeUnitModal = () => {
    setUnitModalVisible(false);
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
        });
    } catch (error) {
      console.log(error, 'error');
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.black}
            style={{alignContent: 'center'}}
          />
        ) : (
          <MapMyIndia
            eventMarker={markersEvents}
            unitMarker={markersUnit}
            activeTab={activeTab}
            handleMarkerEventsClick={handleMarkerEventsClick}
            handleMarkerUnitClick={handleMarkerUnitClick}
            currentLocation={currentLocation}
          />
        )}
        {/* // selectedOption === 'mapMyIndia' ? (
        //   <MapMyIndia
        //     eventMarker={markersEvents}
        //     unitMarker={markersUnit}
        //     activeTab={activeTab}
        //     handleMarkerEventsClick={handleMarkerEventsClick}
        //     handleMarkerUnitClick={handleMarkerUnitClick}
        //     currentLocation={currentLocation}
        //   />
        // ) : (
        //   <MapBox
        //     eventMarker={markersEvents}
        //     unitMarker={markersUnit}
        //     activeTab={activeTab}
        //     eventData={eventData}
        //     handleMarkerEventsClick={handleMarkerEventsClick}
        //     handleMarkerUnitClick={handleMarkerUnitClick}
        //     currentLocation={currentLocation}
        //   />
        // )} */}
      </View>
      {/* <View
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
      </View> */}
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
        onRequestClose={closeUnitModal}
       >
        <StatusCodesComponent closeModal={closeModalStatusCode} statusCodeData={unitsStatusCode}/>
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
              backgroundColor: STATUS_CODE_COLOR?.[user?.status || 0],
              borderRadius: 3,
            }}>
            <Image source={STATUS_CODE_ICON?.[user?.status || 0]} />
          </View>
          <Text style={{color: colors.grayTextColor,marginHorizontal:20}}>{getUnitStatus(user)?.description}</Text>
          <SimpleLineIcons
            name="refresh"
            size={20}
            color={colors.grayBorderColor}
          />
          <TouchableOpacity 
           onPress={()=>setModalVisibleStatusCode(true)}
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
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={colors.grayBorderColor}
            />
          </TouchableOpacity>

          <View
            style={{
              height: 35,
              borderRadius: 20,
              backgroundColor: colors.grayBackgroundColor,
              borderColor: colors.grayBorderColor,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'center'}}>
              <Text style={{color: colors.grayTextColor,fontSize:12,marginLeft:20}}>{user?.beat}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={30}
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
