import React from 'react';
import FlatListData from '../../components/inputs/CustomFlatList';
import {Text, View} from 'react-native';

const AllEvents = ({data}:any) => {

  
  return (
    <View style={{paddingBottom: 175}}>
      {data?.length > 0 
        ? <FlatListData data={data}/>
        : <Text style={{padding: 8}}>There is no any pending events</Text>
      }
    </View>
  );
};

export default AllEvents;
