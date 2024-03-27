import React, { useEffect, useState } from 'react'
import { Pressable, Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import colors from '../../utlits/colors';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from 'moment';
import { useEvents } from '../../context/Events';
import { Formik } from 'formik';
import * as Yup from "yup";
import { useAuth } from '../../context/Auth';
import { baseUrl } from '../../config';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const ClearEvent = ({ navigation, route }: any) => {
    const { token, user, getUser } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [dispositionCodes, setDispositionCodes] = useState<any>([]);
    // const [event, setEvent] = useState<any>();
    const event = route.params.event;
    const unitId = route.params.unit;
    const { unitsStatusCode } = useEvents();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getDispositionCodes()
    }, [])

    // useEffect(() => {
    //     if(eventId){
    //         getDispatchEvent(eventId)
    //     }
    // },[eventId])

    // const getDispatchEvent = async (id: string | null) => {
    //     try {
    //       const toToken = `Bearer ${token}`;
    //       axios
    //         .get(baseUrl + `/cad/api/v2/event/${id}`, {
    //           headers: {
    //             Authorization: toToken,
    //           },
    //         })
    //         .then(res => {
    //           setEvent(res.data);
    //         });
    //     } catch (error) {
    //       console.log(error, 'error');
    //     }
    // };

    const getDispositionCodes = async () => {
        try {
            const header = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            await axios.get(baseUrl + `/cad/api/v2/event/dispositioncodes`, header)
                .then((res: any) => {
                    const data = res?.data?.map((code:any) => {
                        return {
                            label: code?.description,
                            value: code?.code,
                        }
                    });
                    setDispositionCodes(data || []);
                });
        } catch (err) {
            console.log(err, "Error fetching disposition codes");
        }
    };

    const getUnitStatus = (unit: any) => {
        const currentStatus = unitsStatusCode?.filter((status: any) => status?.id === unit?.status)?.[0];
        return currentStatus;
    }

    const initialValues = {
        dispositionCode: "",
        comment: "",
        mileage: "",
    };

    const validationSchema = Yup.object().shape({
        dispositionCode: Yup.string().required("Disposition Code is required"),
        comment: Yup.string().required("Comments is required"),
        mileage: Yup.string(),
    });

    const handleClearEvents = async (values: any) => {
        console.log(values, "values");
        
        try {
            setLoading(true);
            const header = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            await axios.post(baseUrl + `/cad/api/v2/unit/${user?.unitId}/clear`, values, header)
                .then((res) => {
                    console.log("Cleared");
                    getUser(unitId, token);
                    navigation.navigate("BottomNavigation")
                });
        } catch (err) {
            console.log(err, "kk");
            Alert.alert('Something went wrong');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.events}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <MaterialIcons name="close" color="#00526F" size={22} onPress={() => navigation.goBack()}/>
                    <Text style={styles.allEvents}>Clear Event</Text>
                </View>
                <View style={styles.errorIcon}>
                    <MaterialIcons name="error-outline" color="#00526F" size={20} />
                </View>
            </View>
            <View
                style={{
                    borderRadius: 10,
                    marginBottom: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                    borderTopWidth: 1,
                    borderTopColor: colors.grayBorderColor,
                }}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.rowContainer}>
                        <View style={styles.rowLeft}>
                            <Pressable
                                style={[styles.notificationIcon, { backgroundColor: "black" }]}
                            >
                                <MaterialIcons
                                    name="notification-important"
                                    color={colors.white}
                                    size={22}
                                />
                            </Pressable>
                            <Text style={styles.notificationText}>{event?.agencyEventId}</Text>
                        </View>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.leftText}>Event Type</Text>
                        <Text style={styles.rightText}>{event?.agencyEventTypeCode}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.leftText}>Event Sub Type</Text>
                        <Text style={styles.rightText}> {event.agencyEventSubtypeCode}</Text >
                    </View>
                    <View
                        style={{
                            borderTopWidth: 1,
                            marginTop: 10,
                            borderColor: colors.grayBorderColor,
                        }}
                    >
                        <View style={{ flexDirection: "row", marginTop: 5 }}>
                            <View style={styles.POcontainer}>
                                <View style={styles.arrowIcon}>
                                    <MaterialIcons
                                        name="arrow-upward"
                                        color={colors.white}
                                        size={13}
                                    />
                                </View>
                                <Text style={{ marginLeft: 7, color: colors.textBlueColor }}>
                                    P{event?.priority}
                                </Text>
                            </View>
                            <View style={styles.dateContainer}>
                                <Text style={{ color: colors.textBlueColor }}>
                                    {moment(event?.createdTime).format("DD/MM/YYYY - HH:mm:ss")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Formik
                onSubmit={handleClearEvents}
                initialValues={initialValues}
                validationSchema={validationSchema}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue
                }) => (
                    <View style={styles.form}>
                        <Text style={styles.label}>DISPOSITION TYPE</Text>
                        <View style={[styles.input,{ justifyContent: "center"}]}>
                            <RNPickerSelect
                                value={values.dispositionCode}
                                placeholder={{ label: 'Select', value: null }}
                                onValueChange={(value) => setFieldValue("dispositionCode", value)}
                                items={dispositionCodes || []}
                            />
                        </View>
                        {touched.dispositionCode && errors.dispositionCode && (
                            <Text style={styles.errorText}>{errors.dispositionCode}</Text>
                        )}
                        <Text style={styles.label}>COMMENTS</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Here"
                            onChangeText={handleChange("comment")}
                            onBlur={handleBlur("comment")}
                            value={values.comment}
                        />
                        {errors.comment && touched.comment && (
                            <Text style={styles.errorText}>{errors.comment}</Text>
                        )}
                        <View style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            paddingVertical: 10,
                            borderTopWidth: 1,
                            borderTopColor: colors.grayBorderColor,
                        }}>
                            <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSubmit()}
                        >
                            <Text style={styles.buttonText}>Submit & Clear</Text>
                            {loading && <ActivityIndicator color="white" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    map: {
        flex: 1,
    },
    events: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 8,
        alignItems: "center",
        marginTop: 5,
    },
    allEvents: {
        color: colors.textBlueColor,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    errorIcon: {
        height: 36,
        width: 36,
        borderRadius: 4,
        backgroundColor: colors.grayBackgroundColor,
        borderColor: colors.borderColor,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
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
        marginLeft: 15,
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
        width: "50%",
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
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    form: {
        // padding: 5,
        height: '65%',
        borderTopWidth: 1,
        borderTopColor: colors.grayBorderColor,
      },
      label: {
        fontWeight: "bold",
        fontSize: 12,
        marginTop: 10,
        marginLeft: 13,
        color: "#344054",
      },
      input: {
        height: 45,
        marginHorizontal: 12,
        paddingHorizontal: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#00526F",
        borderRadius: 6,
        fontSize: 12,
     
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 6,
        marginRight: 12,
        alignItems: "center",
        marginTop: 6,
      },
      rememberMe: {
        color: "black",
        fontSize: 13,
        marginLeft: 10,
      },
      forgotPassword: {
        color: "#00526F",
        fontSize: 13,
        textDecorationLine: "underline",
      },
      buttonContainer: {
        height: 40,
        borderRadius: 6,
        marginHorizontal: 12,
        marginTop: 12,
      },
      poweredBy: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
      },
      poweredByText: {
        color: "#475467",
      },
      hexagonLogo: {
        marginLeft: 13,
      },
      footerText: {
        textAlign: "center",
        marginHorizontal: 8,
        marginTop: 10,
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
      button: {
        gap: 5,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 6,
        marginHorizontal: 12,
        backgroundColor: "#00526F",
        justifyContent: "center",
        marginTop: 10,
      },
      errorText: {
        color: "red",
        fontSize: 12,
        marginLeft: 12,
      },
      checkBox: {
        height: 36,
        width: 36,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#00526F",
      },
});

export default ClearEvent;