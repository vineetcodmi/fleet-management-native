import React, { useEffect, useState } from 'react';
import FlatListData from '../../components/inputs/CustomFlatList';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import colors from '../../utlits/colors';
import { useAuth } from '../../context/Auth';
import { baseUrl } from '../../config';
import axios from 'axios';



const Data = [
  {
    id: '1',
    notificationText: 'P535535535',
    notificationAlert: 'blue',
    assignName: 'Current Assign',
    eventType: 'Accident',
    eventSubType: 'Road Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    po: '17/07/2023 -18:033',
  },
  {
    id: '2',
    notificationText: 'P535535535',
    notificationAlert: 'orange',
    assignName: 'Dispatch Assign',
    eventType: 'Accident',
    eventSubType: 'Road Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    po: '17/07/2023 -18:033',
  },
  {
    id: '3',
    notificationText: 'P535535535',
    assignName: 'Dispatch Assign',
    notificationAlert: 'orange',
    eventType: 'Accident',
    eventSubType: 'Road Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    po: '17/07/2023 -18:033',
  },
  {
    id: '4',
    notificationText: 'P53553553e',
    assignName: 'Dispatch Assign',
    notificationAlert: 'orange',
    eventType: 'Accident',
    eventSubType: 'Road Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    po: '17/07/2023 -18:033',
  },
];

const Report = ({dispatchEvents}: any) => {
  const{ user, token }=useAuth();
  const [currentAssignedEvent, setCurrentAssignedEvent] = useState<any>();

  useEffect(()=>{
    if(user){
      const id =user.assignedAgencyEventId || "C01122300001";
      const toToken = `Bearer ${token}`;
       try {
          axios.get(baseUrl +`/cad/api/v2/event/${id}`, {
          headers: {
            Authorization: toToken,
          },
        }).then(((res:any)=>{
          setCurrentAssignedEvent([res?.data])
          console.log(res.data,"res datata");
          
      })) 
      } catch(error) {
        console.log('error eventsss', error);
      }
    }
  },[user])

  
 
  return (
    <ScrollView style={{marginBottom:120}}>
      <Text style={styles.assignText}>Current Assign</Text>
      <FlatListData data={currentAssignedEvent} />
      <Text style={styles.assignText}>Dispatch Assign</Text>
      <FlatListData data={dispatchEvents} />
    </ScrollView>
  );
};

export default Report;

const styles = StyleSheet.create({
  assignText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 8
  },
});
