import React from 'react';
import FlatListData from '../../components/inputs/CustomFlatList';
import {ScrollView, StyleSheet, Text} from 'react-native';
import colors from '../../utlits/colors';

const Report = ({dispatchEvents, currentAssignedEvent}: any) => {
 
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
        : <Text style={{padding: 8}}>There is no event</Text>
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
