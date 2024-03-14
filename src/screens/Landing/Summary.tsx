import React from 'react';
import {Text, View, FlatList, SafeAreaView} from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

type ItemProps = {title: string};
const Item = ({title}: ItemProps) => (
  <View
    style={{
      backgroundColor: 'white',
      borderWidth:1,
      padding: 30,
      marginTop:10
    }}>
    <Text style={{}}>{title}</Text>
  </View>
);

const Summary = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default Summary;
