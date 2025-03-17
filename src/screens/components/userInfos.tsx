import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'

interface UserInfosInterface {
  isEditing: boolean;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  title: string;
  sourceImg : any;
}

const UserInfos = ({isEditing, value, setValue, placeholder, title, sourceImg} : UserInfosInterface ) => {
    return (
      <View style={styles.personalInfoFieldContainer}>
        <Image
            source={sourceImg}
          />
        <View style={styles.personalInfoFieldText}>
          <Text style={styles.personalInfoFieldTitle}>{title}</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
            />
          ) : (
            <Text style={styles.personalInfoFieldField}>{value || 'Non renseigné'}</Text>
          )}
        </View>
      </View>
    )
};


const styles = StyleSheet.create({
  personalInfoFieldContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
    alignItems: 'center',
  },
  personalInfoFieldText: {
    marginLeft: 10,
  },
  personalInfoFieldTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Light',
  },
  personalInfoFieldField: {
    fontSize: 15,
    fontFamily: 'Montserrat',
  },
  input: {
    fontSize: 15,
    fontFamily: 'Montserrat',
    borderBottomWidth: 0.5,
    borderBottomColor: '#FFD700',
  },

})

export default UserInfos;
