import {FC} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import colors from '../../utlits/colors';
import { Text } from 'react-native';
// import Text from '../Text';

interface InputProps {
  error?: string;
  placeholder: string;
  value?: string;
  onChangeText: (text: string) => void;
  style?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  onBlur?: (e: any) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  onPressIn?: () => void;
  numberOfLines?: number;
  editable?: boolean;
}

const Input: FC<InputProps> = ({error, numberOfLines, style, ...rest}) => {
  return (
    <>
      <TextInput
        style={[styles.input, style]}
        {...rest}
        multiline={Boolean(numberOfLines)}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.placeholderColor}
      />
      {Boolean(error) && <Text style={styles.error}>{error}</Text>}
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.backgroundColor,
    backgroundColor: colors.backgroundColor,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    color: colors.white,
  },
  error: {
    color: colors.error,
    marginBottom: 10,
  },
});
