import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import colors from '../../utlits/colors';
import {useAuth} from '../../context/Auth';
import axios from 'axios';
import {baseUrl} from '../../config';

interface statuscode {
  id: number;
  text: string;
  color: string;
}
type StatusIcons = {
  [key: number]: string; // Status code as key, icon name as value
};
const statusIcons: StatusIcons = {
  0: 'car-outline',
  1: 'user',
  2: 'check-square',
  3: 'run',
  4: 'phone-outline',
  5: 'emergency',
  6: 'home',
};
const StatusCodesComponent = ({ closeModal ,statusCodeData}: any) => {
  
  // const [statusCodeData, setStatusCodeData] = useState<statuscode[]>([]);
  const [updateStatus, setUpdateStatus] = useState<statuscode[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null); // State to track selected item ID
  const { user, token } = useAuth();
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const statusToUpdate = [0, 1, 2, 3, 4, 5, 6];

  const statuscode = async (data: any) => {
    try {
      const response = await axios.post(baseUrl + `/cad/api/v2/unit/status`, data, header);
      console.log(response.data, 'dattatat');
      return response.data;
    } catch (err) {
      console.log(err, 'my errorr');
      throw err;
    }
  };

  const handleUpdateUnitStatus = async (item: statuscode) => {
    const data = {
      ...user,
      status: item.id,
    };
    try {
      await statuscode(data);
      setSelectedItemId(item.id);
      Alert.alert('Status updated successfully');
    } catch (err) {
      Alert.alert('Something went wrong');
    }
  };

  useEffect(() => {
    if (user && statusCodeData) {
      console.log(user,"userr");
      console.log(statusCodeData,"status code datatt");
      
      
      const status = statusCodeData.find((item:any) => item.id === user.status);
      console.log(status,"statuss");
      
      const updateStatusList = statusCodeData.filter((item:any) =>
        statusToUpdate.includes(item.id),
      );
      setUpdateStatus(updateStatusList);
      console.log(updateStatusList,"updateess statusuus");
      
    }
  }, [user,statusCodeData]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleUpdateUnitStatus(item)}>
      <View style={[styles.contentContainer, selectedItemId === item.id && { borderColor: 'green' }]}>
        <View style={styles.rowContainer}>
          <View style={[styles.Icon, { backgroundColor: 'green' }]}>
            <MaterialCommunityIcons
              name={statusIcons[item.id]}
              color={colors.white}
              size={22}
            />
          </View>
          <Text style={{ marginLeft: 10 }}>{item.description}</Text>
        </View>
        {selectedItemId === item.id && ( 
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
            paddingVertical: 18,
            paddingHorizontal: 18,
          }}>
          <Text style={styles.title}>Set Status</Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeModal}>
            <MaterialIcons name="close" color="#00526F" size={22} />
          </TouchableOpacity>
        </View>
        <View style={{paddingVertical: 18, paddingHorizontal: 18}}>
          <FlatList
            data={updateStatus}
            renderItem={renderItem}
            // keyExtractor={item => item?.}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, position: 'absolute', bottom: 0, width: '100%'},
  title: {fontSize: 20, color: '#101828', fontWeight: 'bold'},
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
  rowContainer: {flexDirection: 'row', alignItems: 'center'},
  rowLeft: {flexDirection: 'row', alignItems: 'center'},
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

export default StatusCodesComponent;