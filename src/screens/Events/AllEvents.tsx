import React from 'react';
import FlatListData from '../../components/inputs/CustomFlatList';
import {View} from 'react-native';
import { useAuth } from '../../context/Auth';

const Data = [
  {
    agencyEventId: '1',
    notificationText: 'P535535535',
    notificationAlert: 'black',
    agencyEventTypeCode: 'Accident',
    agencyEventSubtypeCode: 'Road Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    date: '40/07/2023 -18:033',
  },
  {
    agencyEventId: '2',
    notificationText: 'P535535535',
    notificationAlert: 'black',
    agencyEventTypeCode: 'Bccident',
    agencyEventSubtypeCode: 'Boad Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    date: '30/07/2023 -18:033',
  },
  {
    agencyEventId: '3',
    notificationText: 'P535535535',
    notificationAlert: 'black',
    agencyEventTypeCode: 'ORANFE',
    agencyEventSubtypeCode: 'yellowd Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    date: '29/07/2023 -18:033',
  },
  {
    id: '4',
    notificationText: 'P53553553e',
    notificationAlert: 'black',
    eventType: 'Accident',
    eventSubType: 'Road Accident',
    callerName: 'Subham Kumar',
    callerNumber: '9373738388',
    lat: '2029',
    long: '2029',
    status: 'Pending',
    date: '50/07/2023 -18:033',
  },
];

const AllEvents = ({data}:any) => {

  
  return (
    <View style={{paddingBottom: 175}}>
      <FlatListData data={data}/>
    </View>
  );
};

export default AllEvents;
