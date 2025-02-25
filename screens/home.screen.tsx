import { StyleSheet, Text, View, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../authContext';
import { useContext } from 'react';
import {useNavigation} from "@react-navigation/native";

export default function HomeScreen() {    

  const auth = useContext(AuthContext);
    const navigation = useNavigation();

  if (!auth) return null;

  const { signOut } = auth;

    const goToRecette = () => {
        navigation.navigate('RecipeScreen');
    };
  
 return (
     <View style={styles.container}>
       <Text>Home</Text>
       <StatusBar style="auto" />
       <Button title="Logout" onPress={signOut} />
         <Button title="Recettes" onPress={goToRecette} />
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
 