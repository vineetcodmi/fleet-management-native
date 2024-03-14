import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../utlits/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { ScrollView } from "react-native-gesture-handler";



const General = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
            <ScrollView style={styles.container}>
                <Text style={{ color: colors.black, fontWeight: 'bold', marginLeft: 10, fontSize: 18, padding: 5 }}>Event Details</Text>
                <View style={styles.contentContainer}>
                    <View style={styles.rowContainer}>
                        <View style={styles.rowLeft}>
                            <View
                                style={[
                                    styles.notificationIcon,
                                ]}>
                                <MaterialIcons
                                    name="notification-important"
                                    color={colors.white}
                                    size={22}
                                />
                            </View>
                            <Text style={styles.notificationText} >
                                {' '}
                                P237073100003
                            </Text>
                        </View>
                        
                        <View style={styles.rowContainer}>

                        </View>
                        <TouchableOpacity
                            style={styles.button}>
                            <Feather name="map" size={18} color={colors.white} />
                            <Text style={styles.buttonText}>Open In Maps</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.leftText}>Event Type</Text>
                        <Text style={styles.rightText}>Accident</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.leftText}>Event Sub Type</Text>
                        <Text style={styles.rightText}>Road Accident</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.leftText}>Agency</Text>
                        <Text style={styles.rightText}>Jaipur Police</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.leftText}>DGroup</Text>
                        <Text style={styles.rightText}>UP</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={styles.leftText}>X-Street 1</Text>
                        <Text style={styles.rightText}> -</Text>
                    </View>
                    <View style={[styles.details, { borderBottomColor: colors.white }]}>
                        <Text style={styles.leftText}>X-Street 2</Text>
                        <Text style={styles.rightText}> -</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <View
                            style={{
                                width: '50%',
                            }}>
                            <Text style={styles.latLongText}>LAT</Text>
                            <View style={styles.latContainer}>
                                <Text style={{ color: colors.textBlueColor }}>80.9998</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: '50%',
                            }}>
                            <Text style={styles.latLongText}>LONG</Text>
                            <View style={styles.longContainer}>
                                <Text style={{ color: colors.textBlueColor }}>81.9998</Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            borderTopWidth: 1,
                            marginTop: 10,
                            borderColor: colors.grayBorderColor,
                        }}>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <View style={styles.pending}>
                                <MaterialIcons
                                    name="warning"
                                    color={colors.pendingIconColor}
                                    size={17}
                                />
                                <Text style={{ marginLeft: 7, color: colors.textBlueColor }}>
                                    Pending
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
                                    P2
                                </Text>
                            </View>
                            <View style={styles.dateContainer}>
                                <Text style={{ color: colors.textBlueColor }}>
                                    17/07/2023 -18:033
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 3,
        position: 'absolute',
        bottom: -10,
    },
    assignText: {
        fontSize: 16,
        color: colors.black,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    contentContainer: {
        borderWidth: 1,
        marginTop: 8,
        borderRadius: 8,
        borderColor: colors.grayBorderColor,
        padding: 10,
    },
    rowContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    notificationIcon: {
        height: 35,
        width: 35,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black
    },
    notificationText: {
        fontWeight: 'bold',
        color: colors.textBlueColor,
        marginLeft: 8,
        fontSize: 15,
    },
    rowRight: { flexDirection: 'row', gap: 8 },
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
        marginVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayBorderColor,
        paddingBottom: 8
    },
    leftText: { color: colors.grayTextColor },
    rightText: { color: colors.textBlueColor, fontWeight: 'bold' },
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
    button: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 8,
        height: 35,
        backgroundColor: '#00526F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        gap: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default General