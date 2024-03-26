import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import colors from '../../../utlits/colors';
import StatusModal from '../StatusModal/StatusModal';
import { STATUS_CODE_COLOR, STATUS_CODE_ICON } from '../../../constant/statusCodeConstant';
import { Image } from 'react-native';
import { useAuth } from '../../../context/Auth';

const StatusBar = ({unit,event,unitsStatusCode}:any) => {
  const {getUser, unitId, token} = useAuth();
  
  const [modalVisibleStatusCode, setModalVisibleStatusCode] = useState(false);
  const [statusToShow, setStatusToShow] = useState<any>([]);
  const statusToUpdate = [7,15,8,9,13,14];

  const getUnitStatus = (unit: any) => {
    const currentStatus = unitsStatusCode?.filter((status: any) => status?.id === unit?.status)?.[0];
    return currentStatus;
  }

  useEffect(() => {
    if (unitsStatusCode) {
      const updateStatusList = unitsStatusCode?.filter((item:any) => statusToUpdate?.includes(item?.id));
      const acknowledgeStatus = unitsStatusCode.filter((item:any) =>
      item?.id === 15,
    )?.[0];
    const remainingStatus = updateStatusList.filter((item:any) =>
      item?.id !== 15 && item?.id !== 7,
    );
    setStatusToShow([updateStatusList?.[0], acknowledgeStatus, ...remainingStatus]);
    }
  },[unitsStatusCode])

  console.log(modalVisibleStatusCode,"jj");
  

  return (
    <View style={{ backgroundColor: colors.white}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleStatusCode}
        onRequestClose={() => setModalVisibleStatusCode(false)}
      >
        <StatusModal unit={unit} event={event} closeModal={() => setModalVisibleStatusCode(false)} statusCodeData={statusToShow} />
      </Modal>
      <View
        style={{
          margin: 6,
          backgroundColor: colors.white,
          zIndex: 1,
          borderRadius: 3,
          borderWidth: 1,
          borderColor: colors.grayBorderColor,
          padding:8
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-around',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 35,
              width: 35,
              backgroundColor: STATUS_CODE_COLOR?.[unit?.status || 0],
              borderRadius: 3,
            }}>
            <Image source={STATUS_CODE_ICON?.[unit?.status || 0]}/>
          </View>
          <Text style={{ color: colors.grayTextColor, marginHorizontal: 20, width: "57%" }}>{getUnitStatus(unit)?.description}</Text>
          <TouchableOpacity
            onPress={() => getUser(unitId, token)}
          >
            <SimpleLineIcons
              name="refresh"
              size={20}
              color={colors.grayBorderColor}
            />
          </TouchableOpacity>
            
          <TouchableOpacity
            onPress={() => setModalVisibleStatusCode(true)}
            style={{
              height: 30,
              width: 30,
              borderRadius: 20,
              backgroundColor: colors.grayBackgroundColor,
              borderColor: colors.grayBorderColor,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 20,

            }}>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={colors.grayBorderColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StatusBar;
