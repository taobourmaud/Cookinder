import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../authContext';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen() {    

  const auth = useContext(AuthContext);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  if (!auth) return null;

  const { signOut } = auth;
  
 return (
     <View style={styles.container}>
       <Text>Home</Text>
       <StatusBar style="auto" />
       <Button title="Logout" onPress={signOut} />
       <Button title="Picture" onPress={() => navigation.navigate("TakePicture")} />
     </View>
   );
 }
 
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
},
});
 