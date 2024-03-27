import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../context/Auth";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ServerLogin = ({ route, navigation }: any) => {
  const { token, user } = useAuth();
  const [productionScannedData, setProductionScannedData] = useState("");
  const [loading, setLoading] = useState(false);
  const [educationScannedData, setEducationScannedData] = useState("");
  const serverKey = route.params?.serverKey || "production";
  const scannedData = route.params?.scannedData || "";

  useEffect(() => {
    const checkServer = async() => {
      const user = await AsyncStorage?.getItem("server");
      const data = JSON?.parse(user || "");
      console.log(data, "serverData");
      if(data?.company){
        navigation.replace("LoginScreen", { productionData: data });
      }
    }
    checkServer();
  },[])

  useEffect(() => {
    if (serverKey === "production") {
      setProductionScannedData(scannedData);
    } else if (serverKey === "education") {
      setEducationScannedData(scannedData);
    }
  }, [serverKey, scannedData]);

  useEffect(() => {
    if (token) {
      navigation.replace("BottomNavigation");
    }
  }, [token]);

  const handleServerProduction = (values:any) => {
    try {
      setLoading(true);
      const toToken = `Bearer${token}`;
      const server = values?.production;
      axios
        .get(server)
        .then(async(res) => {
          const data = res.data;
          const serverData = JSON.stringify(data);
          await AsyncStorage.setItem("server", serverData);
          await AsyncStorage.setItem("serverURL", server)
          navigation.replace("LoginScreen", { productionData: data });
        }).catch((err:any) => {
          setLoading(false);
          Alert.alert("Something went wrong")
        });
    } catch (error) {
      setLoading(false);
      console.log(error, "error to connect production url");
    }
  };

  const handleEducationServer = () => {
    console.log("shhsghhsg");
  };
  const handleProductionQrScanner = () => {
    navigation.navigate("QrScanner", { serverKey: "production" });
  };
  const handleEducationQrScanner = () => {
    navigation.navigate("QrScanner", { serverKey: "education" });
  };
  const validationSchema = Yup.object().shape({
    production: Yup.string().url(),
      // .matches(
      //   /^https:\/\/.*/,
      //   'Production server URL must start with "https://"'
      // )
      // .required("Production server URL is required"),
    education: Yup.string().url(),
      // .matches(
      //   /^https:\/\/.*/,
      //   'Education server URL must start with "https://"'
      // )
      // .required("Education server URL is required"),
  });

  const initialValues = {
    production: productionScannedData || "",
    education: educationScannedData || "",
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/background.png")}
        resizeMode="cover"
        style={{ flex: 0.2 }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/integraphLogo.png")}
            style={styles.logo}
          />
        </View>
      </ImageBackground>
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.heading}>Configure Server Connections</Text>
          <Formik
            onSubmit={handleServerProduction}
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.serverContainer}>
                <View style={styles.serverHeader}>
                  <Text style={styles.serverHeaderText}>PRODUCTION SERVER</Text>
                  <TouchableOpacity onPress={handleProductionQrScanner}>
                    <MaterialIcons name="qr-code-scanner" size={24} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter production server url"
                  value={values.production || productionScannedData}
                  onChangeText={(value) => {
                    setProductionScannedData(value.toLowerCase());
                    handleChange("production")(value.toLowerCase());
                  }}
                  onBlur={handleBlur("production")}
                />
                {errors.production && touched.production && (
                  <Text style={styles.errorText}>{errors.production}</Text>
                )}
                <TouchableOpacity
                  disabled={
                    !values.production &&
                    !productionScannedData &&
                    !errors.production
                  }
                  style={[
                    styles.button,
                    !values.production || errors.production
                      ? styles.disabledButton
                      : null,
                  ]}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.buttonText}>Connect to production</Text>
                  {loading && <ActivityIndicator color="white" />}
                </TouchableOpacity>

                <View style={styles.serverHeader}>
                  <Text style={styles.serverHeaderText}>
                    EDUCATION (TEST) SERVER
                  </Text>
                  <TouchableOpacity onPress={handleEducationQrScanner}>
                    <MaterialIcons name="qr-code-scanner" size={24} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter education server url"
                  value={values.education || educationScannedData}
                  onChangeText={(value) => {
                    setEducationScannedData(value);
                    handleChange("education")(value);
                  }}
                  onBlur={handleBlur("education")}
                />
                {errors.education && touched.education && (
                  <Text style={styles.errorText}>{errors.education}</Text>
                )}
                <TouchableOpacity
                  disabled={
                    !values.education &&
                    !educationScannedData &&
                    !errors.education
                  }
                  style={[
                    styles.button,
                    !values.education || errors.education
                      ? styles.disabledButton
                      : null,
                  ]}
                  // onPress={() => handleSubmit()}
                >
                  <Text style={styles.buttonText}>Connect to Education</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Image
              source={require("../../assets/hexagonLogo.png")}
              style={styles.poweredByLogo}
            />
          </View>
          <Text style={styles.footerText}>
            This program is protected by U.S and international copyright as
            described in the info/About box.
          </Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Versions: 9.4.23120</Text>
            <View style={styles.errorIcon}>
              <MaterialIcons
                name="error-outline"
                color="#00526F"
                size={25}
                style={{}}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    backgroundColor: "#ffffff",
    top: -20,
    flex: 0.8,
  },
  logo: {
    marginTop: 20,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    color: "#101828",
    marginTop: 15,
  },
  serverContainer: {
    padding: 2,
  },
  serverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginHorizontal: 14,
  },
  serverHeaderText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#344054",
    marginTop: 5,
  },
  input: {
    height: 83,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#00526F",
    borderRadius: 6,
  },
  button: {
    paddingHorizontal: 8,
    gap: 5,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    backgroundColor: "#00526F",
    justifyContent: "center",
    alignItems: "center"
  },
  disabledButton: {
    paddingHorizontal: 8,
    gap: 16,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 12,
    opacity: 0.6,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  poweredByContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  poweredByText: {
    color: "#475467",
  },
  poweredByLogo: {
    marginLeft: 13,
  },
  footerText: {
    textAlign: "center",
    margin: 10,
    color: "#475467",
  },
  versionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 13,
    marginTop: 15,
    alignItems: "center",
  },
  versionText: {
    color: "#475467",
  },
  errorIcon: {
    height: 45,
    width: 45,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    borderColor: "#EAECF2",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 10,
  },
});

export default ServerLogin;
