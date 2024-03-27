import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../../utlits/colors";
import moment from "moment";
import { OneSignal } from "react-native-onesignal";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/Auth";
import Sound from "react-native-sound";

const DispatchNotifications = ({ dispatchData, closeModal, data}: any) => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [notificationSound, setNotificationSound] = useState<Sound | null>(null);

  useEffect(() => {
    const pattern = /LL\(([\d]+:[\d]+:[\d]+\.\d+),([\d]+:[\d]+:[\d]+\.\d+)\)/;
    const match = dispatchData?.location?.match(pattern);
    if (match) {
      const [lngString, latString] = match.slice(1);
      const lngParts = lngString.split(':').map(parseFloat);
      const latParts = latString.split(':').map(parseFloat);
      const lat = (latParts[0] + latParts[1] / 60 + latParts[2] / 3600).toFixed(7);
      const lng = (lngParts[0] + lngParts[1] / 60 + lngParts[2] / 3600).toFixed(7);
      setLatitude(lat);
      setLongitude(lng);
    }
  }, [dispatchData]);

  useEffect(() => {
    const sound = new Sound("notification_sound.wav", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load the sound", error);
        return;
      }
      sound.setNumberOfLoops(-1);
      sound.play();
      setNotificationSound(sound);
    });

    return () => {
      if (notificationSound) {
        notificationSound.stop();
        notificationSound.release();
      }
    };
  }, []);
  

  const closeModalSound = () => {
    // if (notificationSound) {
    //   console.log("Before stopping sound: ", notificationSound);
    //   notificationSound.stop();
    //   console.log("After stopping sound: ", notificationSound);
    //   // notificationSound.release();
    //   console.log("After releasing sound: ", notificationSound);
    // }
    if (notificationSound) {
      notificationSound.stop();
      notificationSound.release();
    }
    navigation.navigate("Event", { item: dispatchData, isDispatch: true })
    closeModal();
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "white",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: "hidden",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            paddingVertical: 10,
            backgroundColor: colors.grayBackgroundColor,
            borderBottomWidth: 1,
            borderBottomColor: colors.grayBorderColor,
          }}
        >
          Dispatch Notification
        </Text>
        <View
          style={{
            paddingHorizontal: 18,
            paddingVertical: 18,
          }}
        >
          <Image
            source={require("../../assets/notificationIcon.png")}
            style={{ alignSelf: "center" }}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{dispatchData?.agencyEventId}</Text>
            <View style={styles.details}>
              <Text style={styles.leftText}>Event Type</Text>
              <Text style={styles.rightText}>{dispatchData?.agencyEventTypeCode}</Text>
            </View>
            <View
              style={[
                styles.details,
                { borderTopWidth: 1, borderTopColor: "#EAECF0" },
              ]}
            >
              <Text style={styles.leftText}>Event Sub Type</Text>
              <Text style={styles.rightText}>{dispatchData?.agencyEventSubtypeCode}</Text>
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
                    Dispatched
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
                    P{dispatchData?.priority}
                  </Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={{ color: colors.textBlueColor }}>
                    {moment(dispatchData?.createdTime).format("DD/MM/YYYY - HH:mm:ss")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              color: colors.grayTextColor,
            }}
          >
            Unit {user?.unitId} has been dispatched to an event
          </Text>
          <TouchableOpacity style={styles.button} onPress={closeModalSound}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.buttonText}>Accept</Text>
              <MaterialIcons name="east" size={15} color={colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#00000079",
    top: 0,
    justifyContent: "flex-end",
  },
  title: { fontSize: 25, color: "#101828", textAlign: "center" },
  contentContainer: {
    borderWidth: 1,
    marginTop: 20,
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
  leftText: { color: colors.grayTextColor, paddingTop: 5 },
  rightText: { color: colors.textBlueColor, fontWeight: "bold", paddingTop: 5 },
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
    alignSelf: "center",
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
  closeModal: {
    height: 35,
    width: 35,
    borderWidth: 1,
    borderRadius: 24,
    borderColor: "#EAECF0",
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: "#00526F",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 5,
  },
});

export default DispatchNotifications;
