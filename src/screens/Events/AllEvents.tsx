import React from 'react';
import FlatListData from '../../components/inputs/CustomFlatList';
import {View} from 'react-native';

const AllEvents = ({data}:any) => {

  
  return (
    <View style={{paddingBottom: 175}}>
      <FlatListData data={data}/>
    </View>
  );
};

export default AllEvents;
