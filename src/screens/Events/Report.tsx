import React, { useEffect, useState } from 'react';
import FlatListData from '../../components/inputs/CustomFlatList';
import {ScrollView, StyleSheet, Text} from 'react-native';
import colors from '../../utlits/colors';
import { useAuth } from '../../context/Auth';
import { useGetEvent } from '../../services/querries/event';

const Report = ({dispatchEvents}: any) => {
  const{ user }=useAuth();
  const [currentAssignedEvent, setCurrentAssignedEvent] = useState<any>();

  const {data: event, refetch: refetchEvent} = useGetEvent(user?.assignedAgencyEventId || "C01122300001");

  useEffect(()=>{
    if(event){
      setCurrentAssignedEvent([event])
    }
  },[event])

  console.log(currentAssignedEvent, "kk");

 
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
