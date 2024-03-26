import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Platform,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
} from "react-native";
import colors from "../../utlits/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import MapMyIndia from "../MapScreen/MapMyIndia";
import { useEvents } from "../../context/Events";
import { useAuth } from "../../context/Auth";
import Geolocation from "@react-native-community/geolocation";
import MapBox from "../MapScreen/MapBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../config";

interface Event {
  comments: string;
}
const General = ({ data }: any) => {
  const { unitsStatusCode } = useEvents();
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>();
  const [markersEvents, setMarkersEvents] = useState<any>([]);
  const [comment, setComment] = useState("");
  const [selectedMap, setSelectedMap] = useState<string>("mapMyIndia");
  const [eventData, setEventData] = useState<Event>();
  const [loading, setLoading] = useState(false);
  const[isComment,setIscomment]=useState<boolean>();
  // const { latDiff, lngDiff } = extractLatLongDiff(location);
  const [cases, setCases] = useState([
    { label: "Case 1", value: "case1" },
    { label: "Case 2", value: "case2" },
    { label: "Case 3", value: "case3" },
  ]);
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchMap();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (data) {
      const location = data?.location;
      const id = data?.agencyEventId;
      const pattern = /LL\(([\d]+:[\d]+:[\d]+\.\d+),([\d]+:[\d]+:[\d]+\.\d+)\)/;
      const match = location?.match(pattern);
      if (match) {
        const [latString, lngString] = match.slice(1);
        const latParts = latString.split(":").map(parseFloat);
        const lngParts = lngString.split(":").map(parseFloat);
        const lat = (
          latParts[0] +
          latParts[1] / 60 +
          latParts[2] / 3600
        ).toFixed(4);
        const lng = (
          lngParts[0] +
          lngParts[1] / 60 +
          lngParts[2] / 3600
        ).toFixed(4);
        setMarkersEvents([
          {
            id: data?.agencyEventId,
            coordinate: [parseFloat(lat), parseFloat(lng)],
          },
        ]);
      }
    }
  }, [data]);

  const fetchMap = async () => {
    const map: any = await AsyncStorage.getItem("map");
    setSelectedMap(map);
  };

  const handleCaseChange = (value: any) => {
    setSelectedCase(value);
  };

  const getUnitStatus = (unit: any) => {
    const currentStatus = unitsStatusCode?.filter(
      (status: any) => status?.id === unit?.status
    )?.[0];
    return currentStatus;
  };

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position: any) => {
              setCurrentLocation([
                position.coords.latitude,
                position.coords.longitude,
              ]);
            },
            (error: any) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          console.log("Location permission denied");
        }
      } else {
        // For iOS, location permission is requested when the app is in use.
        Geolocation.getCurrentPosition(
          (position: any) => {
            setCurrentLocation([
              position.coords.latitude,
              position.coords.longitude,
            ]);
          },
          (error: any) => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const closeOpenCommentModal = () => {
    setOpenCommentModal(false);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${data?.callerNumber}`);
  };

  useEffect(() => {
    Events();
  }, []);

  const Events = async () => {
    const id = data.agencyEventId;
    try {
      const toToken = `Bearer ${token}`;
      axios
        .get(baseUrl + `/cad/api/v2/event/${id}`, {
          headers: {
            Authorization: toToken,
          },
        })
        .then((res) => {
          setEventData(res.data);
        });
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleSubmit = async () => {
    const id = data.agencyEventId;
    try {
      setLoading(true);
      await axios
        .post(
          baseUrl + `/cad/api/v2/event/${id}/comment`,
          {
            remark: comment,
          },
          header
        )
        .then((res) => {
          setOpenCommentModal(false);
          setIscomment(!isComment)
        });
    } catch (error) {
      setLoading(false);
      console.error("Error logging in:", error);
    }
  };

  const handleOpenMaps=()=>{
    if (Platform.OS === "android") {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${markersEvents?.[0]?.coordinate[1]},${markersEvents?.[0]?.coordinate[0]}&origin=${user?.latitude},${user?.longitude}`);
    } else if (Platform.OS === "ios") {
      Linking.openURL(`https://maps.apple.com/?daddr=${markersEvents?.[0]?.coordinate[1]},${markersEvents?.[0]?.coordinate[0]}&saddr=${user?.latitude},${user?.longitude}`);
    } else {
      console.log("Maps are not supported on this platform.");
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.4 }}>
        {/* {selectedMap === "mapMyIndia" ? ( */}
          <MapMyIndia
            eventMarker={markersEvents}
            unitMarker={[]}
            activeTab={"Events"}
            handleMarkerEventsClick={() => {}}
            handleMarkerUnitClick={() => {}}
            currentLocation={currentLocation}
            isEventDetail={true}
          />
        {/* ) : (
          <MapBox
            eventMarker={markersEvents}
            unitMarker={[]}
            activeTab={"Events"}
            handleMarkerEventsClick={() => {}}
            handleMarkerUnitClick={() => {}}
            currentLocation={currentLocation}
            isEventDetail={true}
          />
        )} */}
      </View>
      <ScrollView style={{ flex: 0.7 }}>
        <View style={styles.container}>
          <Text style={styles.headerTextStyle}>Events Details</Text>
          <View
            style={{
              borderWidth: 1,
              marginTop: 8,
              borderRadius: 8,
              borderColor: colors.grayBorderColor,
              padding: 10,
              gap: 3,
            }}
          >
            <View style={styles.rowContainer}>
              <View style={styles.rowLeft}>
                <View style={[styles.notificationIcon]}>
                  <MaterialIcons
                    name="notification-important"
                    color={colors.white}
                    size={22}
                  />
                </View>
                <Text style={styles.notificationText}>
                  {" "}
                  {data?.agencyEventId}
                </Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleOpenMaps}>
                <Feather name="map" size={18} color={colors.white} />
                <Text style={styles.buttonText}>Open In Maps</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.details}>
              <Text style={styles.leftText}>Event Type</Text>
              <Text style={styles.rightText}>{data?.agencyEventTypeCode}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.leftText}>Event Sub Type</Text>
              <Text style={styles.rightText}>
                {data?.agencyEventSubtypeCode}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.leftText}>Agency</Text>
              <Text style={styles.rightText}>{data?.agencyId}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.leftText}>DGroup</Text>
              <Text style={styles.rightText}>{data?.dispatchGroup}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.leftText}>X-Street 1</Text>
              <Text style={styles.rightText}> -</Text>
            </View>
            <View style={[styles.details, { borderBottomColor: colors.white }]}>
              <Text style={styles.leftText}>X-Street 2</Text>
              <Text style={styles.rightText}> -</Text>
            </View>
            {markersEvents.map((item:any) => (
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: "50%",
                  }}
                >
                  <Text style={styles.latLongText}>LAT</Text>
                  <View style={styles.latContainer}>
                    <Text style={{ color: colors.textBlueColor }}>{item?.coordinate?.[0]}</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: "50%",
                  }}
                >
                  <Text style={styles.latLongText}>LONG</Text>
                  <View style={styles.longContainer}>
                    <Text style={{ color: colors.textBlueColor }}>{item?.coordinate?.[1]}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View
              style={{
                borderTopWidth: 1,
                marginTop: 10,
                borderColor: colors.grayBorderColor,
              }}
            >
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View style={styles.pending}>
                  <MaterialIcons
                    name="warning"
                    color={colors.pendingIconColor}
                    size={17}
                  />
                  <Text style={{ marginLeft: 7, color: colors.textBlueColor }}>
                    {getUnitStatus(user)?.status}
                  </Text>
                </View>
                <View style={styles.POcontainer}>
                  <View style={styles.arrowIcon}>
                    <MaterialIcons
                      name="arrow-upward"
                      color={colors.white}
                      size={12}
                    />
                  </View>
                  <Text style={{ marginLeft: 7, color: colors.textBlueColor }}>
                    P{data?.priority}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={{ color: colors.textBlueColor }}>
                    {moment(data?.createdTime).format("DD/MM/YYYY - HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.headerTextStyle}>Caller Information</Text>
          <View style={styles.contentContainer}>
            <View style={styles.details}>
              <Text style={styles.leftText}>Source</Text>
              <Text style={styles.rightText}>{data?.agencyEventTypeCode}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.leftText}>Name</Text>
              <Text style={styles.rightText}>
                {data?.agencyEventSubtypeCode}
              </Text>
            </View>
            <View style={[styles.details, { borderBottomColor: colors.white }]}>
              <Text style={styles.leftText}>Address</Text>
              <Text style={styles.rightText}> -</Text>
            </View>
            <View style={styles.callerContainer}>
              <View>
                <Text style={{ color: colors.textBlueColor }}>
                  {data?.callData?.callerPhoneNumber}
                  {/* {item?.callData?.callerName} */}
                </Text>
                <Text style={{ color: "#344054" }}>Caller Number</Text>
              </View>
              <Pressable
                style={styles.iconContainer}
                onPress={() => handleCall()}
              >
                <MaterialIcons
                  name="call"
                  color={colors.tabBackgroundColor}
                  size={20}
                />
              </Pressable>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.headerTextStyle}>Assigend Units</Text>
            <View
              style={{
                width: 28,
                height: 23,
                borderWidth: 1,
                borderRadius: 2,
                marginRight: 10,
                backgroundColor: colors.textBlueColor,
              }}
            >
              <Text style={{ color: colors.white, textAlign: "center" }}>
                3
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 1,
              marginTop: 8,
              borderRadius: 8,
              borderColor: colors.grayBorderColor,
            }}
          >
            <View style={{ padding: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  paddingBottom: 8,
                  borderBottomColor: colors.grayBorderColor,
                }}
              >
                <View style={styles.rowLeft}>
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: colors.redIcon },
                    ]}
                  >
                    <MaterialIcons
                      name="notification-important"
                      color={colors.white}
                      size={22}
                    />
                  </View>
                  <Text style={styles.notificationText}> LKWO3</Text>
                </View>
                <View
                  style={{
                    width: "60%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "50%",
                      borderWidth: 1,
                      borderColor: colors.grayBorderColor,
                      borderRadius: 4,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      padding: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <MaterialIcons
                      name="pin-drop"
                      size={22}
                      color={colors.redIcon}
                    />
                    <Text>Arrived</Text>
                  </View>
                  <View
                    style={[
                      styles.longContainer,
                      { width: "50%", alignItems: "center" },
                    ]}
                  >
                    <Text>Police-FRV</Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 8,
                borderTopWidth: 1,
                borderTopColor: colors.grayBorderColor,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#344054" }}>Add Your Unit To Event</Text>
              <TouchableOpacity style={styles.button}>
                <MaterialIcons name="add" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Self Attach</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerTextStyle}>Case Number</Text>
          <View
            style={{
              borderWidth: 1,
              marginTop: 8,
              borderRadius: 8,
              borderColor: colors.grayBorderColor,
            }}
          >
            <View style={{ padding: 10 }}>
              <Text
                style={[
                  styles.leftText,
                  { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
                ]}
              >
                SELECT CASE
              </Text>
              <DropDownPicker
                open={open}
                value={selectedCase}
                items={cases}
                setOpen={setOpen}
                setValue={handleCaseChange}
                setItems={setCases}
                placeholder="Select"
                style={{
                  borderColor: colors.grayBorderColor,
                }}
                placeholderStyle={{ color: colors.grayTextColor }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: colors.grayBorderColor,
                padding: 10,
              }}
            >
              <Text style={{ color: "#344054" }}>Add Another Case Number</Text>
              <TouchableOpacity style={styles.button}>
                <MaterialIcons name="add" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.headerTextStyle}>Comments</Text>
            <View
              style={{
                width: 28,
                height: 23,
                borderWidth: 1,
                borderRadius: 2,
                marginRight: 10,
                backgroundColor: colors.textBlueColor,
              }}
            >
              <Text style={{ color: colors.white, textAlign: "center" }}>
                {eventData?.comments ? eventData.comments.length : 0}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 1,
              marginTop: 8,
              borderRadius: 8,
              borderColor: colors.grayBorderColor,
            }}
          >
            <View style={{}}>
              {eventData?.comments && eventData.comments.length > 0 ? (
                eventData.comments.map((comment: any, index: any) => (
                  <View
                    key={index}
                    style={{
                      padding: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.grayBorderColor,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.rowLeft}>
                        <View
                          style={{
                            height: 35,
                            width: 35,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.redIcon,
                          }}
                        >
                          <MaterialIcons
                            name="info-outline"
                            color={colors.white}
                            size={22}
                          />
                        </View>
                        <Text style={styles.notificationText}>{data?.beat}</Text>
                      </View>
                      <Text>
                        {moment(comment?.createdTime).format(
                          "DD/MM/YYYY - HH:mm"
                        )}
                      </Text>
                    </View>
                    <Text style={{ marginTop: 10 }}>{comment.commentText}</Text>
                  </View>
                ))
              ) : (
                <Text>No comments available</Text>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#344054" }}>Add Comment</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setOpenCommentModal(true)}
              >
                <MaterialIcons name="add" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Text style={styles.headerTextStyle}>Tow Request</Text>
            <View
              style={{
                width: 28,
                height: 23,
                borderWidth: 1,
                borderRadius: 2,
                marginRight: 10,
                backgroundColor: colors.textBlueColor,
              }}
            >
              <Text style={{ color: colors.white, textAlign: "center" }}>
                0
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 1,
              marginTop: 8,
              borderRadius: 8,
              borderColor: colors.grayBorderColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#344054" }}>Add Tow Request</Text>
              <TouchableOpacity style={styles.button}>
                <MaterialIcons name="add" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerTextStyle}>Times</Text>
          <View style={styles.contentContainer}>
            <View style={styles.details}>
              <Text style={styles.leftText}>&#8226; Dispatched</Text>
              <Text style={styles.rightText}>02/02/2024 -17:01:24</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.leftText}>&#8226; First Arrival</Text>
              <Text style={styles.rightText}>-</Text>
            </View>
            <View style={[styles.details, { borderBottomColor: colors.white }]}>
              <Text style={styles.leftText}>&#8226; Closed</Text>
              <Text style={styles.rightText}> -</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openCommentModal}
        onRequestClose={closeOpenCommentModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000079",
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: colors.white,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              bottom: 0,
              position: "absolute",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 17, color: colors.textBlueColor }}>
                Add Comments
              </Text>
              <TouchableOpacity
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 20,
                  backgroundColor: colors.grayBackgroundColor,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.grayBorderColor,
                }}
                onPress={closeOpenCommentModal}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.iconGrayColor}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.grayBorderColor,
                height: 100, // Set the fixed height here
              }}
            >
              <TextInput
                style={{
                  padding: 12,
                  borderColor: colors.grayBorderColor,
                  borderWidth: 1,
                  margin: 12,
                  borderRadius: 3,
                  height: "100%",
                }}
                placeholder="Enter here"
                multiline
                value={comment}
                onChangeText={(text) => setComment(text)}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 15,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: "#667085",
                    borderWidth: 1,
                    borderColor: colors.grayBorderColor,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="error-outline"
                    color={colors.white}
                    size={23}
                  />
                </View>
                <Text style={{ color: "#475467" }}> Critical Comment</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: colors.grayBorderColor }}
                thumbColor={isCritical ? colors.iconGrayColor : "#f4f3f4"}
                ios_backgroundColor={colors.grayBorderColor}
                onValueChange={() =>
                  setIsCritical((previousState) => !previousState)
                }
                value={isCritical}
              />
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 3,
                marginHorizontal: 12,
                backgroundColor: "#00526F",
                justifyContent: "center",
                marginBottom: 40,
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
              {loading && <ActivityIndicator color="white" />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  assignText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentContainer: {
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 8,
    borderColor: colors.grayBorderColor,
    padding: 10,
    gap: 3,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  notificationIcon: {
    height: 35,
    width: 35,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  notificationText: {
    fontWeight: "bold",
    color: colors.textBlueColor,
    marginLeft: 8,
    fontSize: 15,
  },
  rowRight: { flexDirection: "row", gap: 8 },
  iconContainer: {
    height: 35,
    width: 35,
    backgroundColor: colors.grayBackgroundColor,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.tabBackgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorderColor,
    paddingBottom: 8,
  },
  leftText: { color: colors.grayTextColor },
  rightText: { color: colors.textBlueColor, fontWeight: "bold" },
  longContainer: {
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderRadius: 4,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 8,
    justifyContent: "center",
  },
  latLongText: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 4,
    color: "#344054",
  },
  latContainer: {
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 8,
  },
  pending: {
    width: "35%",
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  POcontainer: {
    width: "17%",
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIcon: {
    height: 15,
    width: 15,
    borderRadius: 24,
    backgroundColor: colors.redIcon,
    alignItems: "center",
  },
  dateContainer: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderRadius: 4,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 8,
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 35,
    backgroundColor: "#00526F",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    gap: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  callerContainer: {
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#D0D5DD",
    marginTop: 10,
    borderRadius: 4,
    padding: 5,
    backgroundColor: colors.grayBackgroundColor,
  },
  headerTextStyle: {
    color: colors.black,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 10,
    fontSize: 15,
    padding: 5,
  },
});

export default General;
