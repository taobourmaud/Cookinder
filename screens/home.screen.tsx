import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../authContext';
import { useContext } from 'react';

export default function HomeScreen() {    

  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { signOut } = auth;
  
 return (
     <View style={styles.container}>
       <Text>Home</Text>
       <StatusBar style="auto" />
       <Button title="Logout" onPress={signOut} />

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
 