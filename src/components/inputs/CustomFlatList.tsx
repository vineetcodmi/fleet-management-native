import React, {useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import colors from "../../utlits/colors";
import { FlatList } from "react-native";
import DispatchNotifications from "../../screens/Notification/DispatchNotification";
import moment from "moment";
import Event from "../../screens/Notification/Event";
import { useNavigation } from "@react-navigation/native";
import { useEvents } from "../../context/Events";
import { useAuth } from "../../context/Auth";

const FlatListData = ({ data }: any) => {
  const navigation = useNavigation();
  const { eventStatusCode } = useEvents();
  const { user } = useAuth();

  const [ismodalVisible, setIsModalVisible] = useState(false);

  const getUnitStatus = (unit: any) => {
    const currentStatus = eventStatusCode?.filter(
      (status: any) => status?.id === unit?.status
    )?.[0];
    return currentStatus;
  };


  const closeModal = () => {
    setIsModalVisible(false);
  };
  const handleCall = (item: any) => {
    Linking.openURL(`tel:${item?.callerNumber}`);
  };
  const handleNotificationIcon = () => {
    setIsModalVisible(true);
  };
  const handleOpenEventDetails = (item: any) => {
    navigation.navigate("Event", { item: item });
  };
  const handleOpenMap = () => {
    if (Platform.OS === "android") {
      Linking.openURL("https://www.google.com/maps");
    } else if (Platform.OS === "ios") {
      Linking.openURL("maps://");
    } else {
      console.log("Maps are not supported on this platform.");
    }
  };

  const renderItem = (item: any) => { 
    const location = item?.location;
    const pattern = /LL\(([\d]+:[\d]+:[\d]+\.\d+),([\d]+:[\d]+:[\d]+\.\d+)\)/;
    const match = location.match(pattern);
    let latitude = "";
    let longitude = "";
  
    if (match) {
      const [latString, lngString] = match.slice(1);
      const latParts = latString.split(':').map(parseFloat);
      const lngParts = lngString.split(':').map(parseFloat);
      latitude = (
        latParts[0] +
        latParts[1] / 60 +
        latParts[2] / 3600
      ).toFixed(4);
      longitude = (
        lngParts[0] +
        lngParts[1] / 60 +
        lngParts[2] / 3600
      ).toFixed(4);
    }
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeft}>
              <Pressable
                onPress={handleNotificationIcon}
                style={[
                  styles.notificationIcon,
                  { backgroundColor: item?.notificationAlert || "black" },
                ]}
              >
                <MaterialIcons
                  name="notification-important"
                  color={colors.white}
                  size={22}
                />
              </Pressable>
              <Text style={styles.notificationText}>
                {" "}
                {item?.agencyEventId}{" "}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <View style={styles.iconContainer}>
                <Feather
                  name="map"
                  color={colors.tabBackgroundColor}
                  size={18}
                  onPress={handleOpenMap}
                />
              </View>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="open-in-new"
                  color={colors.tabBackgroundColor}
                  size={22}
                  onPress={() => handleOpenEventDetails(item)}
                />
              </View>
            </View>
          </View>
          <View style={styles.details}>
            <Text style={styles.leftText}>Event Type</Text>
            <Text style={styles.rightText}>{item?.agencyEventTypeCode}</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.leftText}>Event Sub Type</Text>
            <Text style={styles.rightText}> {item.agencyEventSubtypeCode}</Text>
          </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  width: "50%",
                }}
              >
                <Text style={styles.latLongText}>LAT</Text>
                <View style={styles.latContainer}>
                  <Text style={{ color: colors.textBlueColor }}>{latitude}</Text>
                </View>
              </View>
              <View
                style={{
                  width: "50%",
                }}
              >
                <Text style={styles.latLongText}>LONG</Text>
                <View style={styles.longContainer}>
                  <Text style={{ color: colors.textBlueColor }}>{longitude}</Text>
                </View>
              </View>
            </View>
          
          <View style={styles.callerContainer}>
            <View>
              <Text style={{ color: colors.textBlueColor }}>
                7989898989
              </Text>
              <Text style={{ color: "#344054" }}>Caller Number</Text>
            </View>
            <Pressable
              style={styles.iconContainer}
              onPress={() => handleCall(item)}
            >
              <MaterialIcons
                name="call"
                color={colors.tabBackgroundColor}
                size={20}
              />
            </Pressable>
          </View>
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
                    size={13}
                  />
                </View>
                <Text style={{ marginLeft: 7, color: colors.textBlueColor }}>
                  P{item?.priority}
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Text style={{ color: colors.textBlueColor }}>
                  {moment(item?.createdTime).format("DD/MM/YYYY - HH:mm")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }: any) => renderItem(item)}
        // keyExtractor={(item) => item.location}
        ListEmptyComponent={<ActivityIndicator color={colors.textBlueColor} />}
      />
      <Modal animationType="slide" transparent={true} visible={ismodalVisible}>
        <DispatchNotifications closeModal={closeModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  contentContainer: {
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 8,
    borderColor: colors.grayBorderColor,
    padding: 10,
  },
  rowContainer: { flexDirection: "row", justifyContent: "space-between" },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  notificationIcon: {
    height: 35,
    width: 35,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 6,
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
  pending: {
    width: "30%",
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
    width: "20%",
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
    alignSelf: "center",
  },
  dateContainer: {
    width: "50%",
    borderWidth: 1,
    borderColor: colors.grayBorderColor,
    borderRadius: 4,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 8,
  },
});
export default FlatListData;
