import {Alert, Button, Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../../utlits/colors';
import { useAuth } from '../../context/Auth';

const LogOut = ({unitId}:any) => {
  console.log(unitId,"unit idd is hhererre");
  
  const {deleteAccount} = useAuth();

  const handleDelete = async () => {
    const data = {
      unitId: unitId,
      comment:"Logoff",
    };
    deleteAccount(data);
  };
  

  const onDelete = () => {
    Alert.alert(
      'Delete account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', onPress: handleDelete},
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.delete} >
        <Text style={{color: colors.black, fontWeight: 'bold'}}>
          Delete account
        </Text>
      </Pressable>
      <Button
        onPress={onDelete}
        title="Logout"
        color={colors.black}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logout: {
    backgroundColor: colors.white,
    borderWidth: 1
  },
  delete: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 15,
  },
});

export default LogOut;
