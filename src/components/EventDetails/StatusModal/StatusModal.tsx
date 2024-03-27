import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Pressable,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../utlits/colors';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from '../../../config';
import { useAuth } from '../../../context/Auth';
import { STATUS_CODE_COLOR, STATUS_CODE_ICON } from '../../../constant/statusCodeConstant';
import { Image } from 'react-native';

interface statuscode {
    id: number;
    text: string;
    color: string;
}

const StatusModal = ({ closeModal, statusCodeData, unit, event, setIsMapLoading }: any) => {
    const { token, getUser } = useAuth();
    const navigation = useNavigation();
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    useEffect(() => {
        setSelectedItemId(unit?.status);
    }, [unit])


    const handleUpdateUnitStatus = async (item: statuscode) => {
        setIsMapLoading(true)
        const header = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const data = {
            ...unit,
            status: item.id,
        };
        try {
            console.log(baseUrl + `/cad/api/v2/unit/${unit?.unitId}/status`, "URL");
            
            await axios.post(baseUrl + `/cad/api/v2/unit/${unit?.unitId}/status`, data, header);
            setSelectedItemId(item.id);
            getUser(unit?.unitId, token);
            setIsMapLoading(false);
            closeModal();
        } catch (err) {
            console.log(err, "ll");
            setIsMapLoading(false);
            Alert.alert('Something went wrong');
        }
    };

    const handleNavigation = () => {
        closeModal();
        navigation.navigate("ClearEvent", { event: event, unit: unit?.unitId });
    }

    const renderItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => handleUpdateUnitStatus(item)}>
            <View style={[styles.contentContainer, selectedItemId === item.id && { borderColor: 'green' }]}>
                <View style={styles.rowContainer}>
                    <View style={[styles.Icon, { backgroundColor: STATUS_CODE_COLOR?.[item?.id || 0] }]}>
                        <Image source={STATUS_CODE_ICON?.[item?.id || 0]} />
                    </View>
                    <Text style={{ marginLeft: 10 }}>{item.description}</Text>
                </View>
                {unit?.status === item.id && (
                    <View
                        style={{
                            height: 32,
                            width: 32,
                            backgroundColor: 'green',
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <MaterialCommunityIcons
                            name="check"
                            size={23}
                            color={colors.white}
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: colors.white,
                    borderTopRightRadius: 8,
                    borderTopLeftRadius: 8,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.grayBorderColor,
                        paddingVertical: 18,
                        paddingHorizontal: 18,
                    }}>
                    <Text style={styles.title}>Set Status</Text>
                    <TouchableOpacity onPress={closeModal} style={styles.closeModal}>
                        <MaterialIcons name="close" color="#00526F" size={22} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingVertical: 18, paddingHorizontal: 18 }}>
                    <FlatList
                        data={statusCodeData}
                        renderItem={renderItem}
                    // keyExtractor={item => item?.}
                    />
                    <TouchableOpacity onPress={() => handleNavigation()}>
                        <View style={styles.contentContainer}>
                            <View style={styles.rowContainer}>
                                <View style={[styles.Icon, { backgroundColor: STATUS_CODE_COLOR?.["clear"] }]}>
                                    <Image source={STATUS_CODE_ICON?.["clear"]} />
                                </View>
                                <Text style={{ marginLeft: 10 }}>Clear</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, position: 'absolute', bottom: 0, width: '100%' },
    title: { fontSize: 20, color: '#101828', fontWeight: 'bold' },
    contentContainer: {
        borderWidth: 1,
        marginTop: 4,
        borderRadius: 4,
        borderColor: colors.grayBorderColor,
        padding: 10,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowContainer: { flexDirection: 'row', alignItems: 'center' },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    Icon: {
        height: 35,
        width: 35,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
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

export default StatusModal;