import React, { useEffect, useState } from 'react';
import FlatListData from '../../components/inputs/CustomFlatList';
import {ScrollView, StyleSheet, Text} from 'react-native';
import colors from '../../utlits/colors';
import { useAuth } from '../../context/Auth';
import { baseUrl } from '../../config';
import axios from 'axios';

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
          if(res?.data !== null){
            setCurrentAssignedEvent([res?.data])
          }
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
      {currentAssignedEvent?.length > 0 
        ? <FlatListData data={currentAssignedEvent} />
        : <Text style={{padding: 8}}>Currently no event is assigned</Text>
      }
      <Text style={styles.assignText}>Dispatch Assign</Text>
      {dispatchEvents?.length > 0 
        ? <FlatListData data={dispatchEvents} />
        : <Text style={{padding: 8}}>There is no any dispatched event</Text>
      }
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
