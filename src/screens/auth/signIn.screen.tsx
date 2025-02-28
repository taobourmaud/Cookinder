import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  ImageBackground 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
<<<<<<<< HEAD:src/screens/tabs/auth/signIn.screen.tsx
import { AuthContext } from '../../../../authContext';
import { supabase } from '../../../../supabase';
import { RootStackParamList } from '../../../../App';
========
import { supabase } from '../../../supabase';
import { RootStackParamList } from '../../../App';
import { AuthContext } from '../../../authContext';
>>>>>>>> swipe_dishes:src/screens/auth/signIn.screen.tsx

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useContext(AuthContext);

  if (!auth) return null;
  
  const { signIn } = auth;

  async function handleSignIn() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
    } else {
      await signIn(data.session.access_token);
    }
    
    setLoading(false);
  }

  return (
    <ImageBackground 
<<<<<<<< HEAD:src/screens/tabs/auth/signIn.screen.tsx
      source={require('../../../../assets/images/background.png')} 
========
      source={require('../../../assets/images/background.png')} 
>>>>>>>> swipe_dishes:src/screens/auth/signIn.screen.tsx
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.text}>Connexion</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#fff"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#fff"
            autoCapitalize="none"
            secureTextEntry
          />
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Connexion</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signInText}>Pas de compte ? Créez en un ici</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end',
  },
  formContainer: {
    padding: 20,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  text : {
    color: '#EBB502',
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Montserrat'
  },
  button: {
    backgroundColor: '#EBB502',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 20,
    color: '#EBB502',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat'
  },
});

export default SignInScreen;
