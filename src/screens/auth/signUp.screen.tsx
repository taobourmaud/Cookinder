import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, ImageBackground} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
<<<<<<<< HEAD:src/screens/tabs/auth/signUp.screen.tsx
import { supabase } from '../../../../supabase';
import { AuthContext } from '../../../../authContext';
import { RootStackParamList } from '../../../../App';
========
import { supabase } from '../../../supabase';
import { AuthContext } from '../../../authContext';
import { RootStackParamList } from '../../../App';
>>>>>>>> swipe_dishes:src/screens/auth/signUp.screen.tsx

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { signIn } = auth;

  async function handleSignUp() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data:{
          displayName: username,
        } 
      }
    });

    if (error) {
      alert(error.message);
    } else {
      if (data.session) {
        await signIn(data.session.access_token);
      } else {
        navigation.navigate('SignIn'); 
      }
    }

    setLoading(false);
  }

  return (
    <ImageBackground 
<<<<<<<< HEAD:src/screens/tabs/auth/signUp.screen.tsx
          source={require('../../../../assets/images/background.png')} 
========
          source={require('../../../assets/images/background.png')} 
>>>>>>>> swipe_dishes:src/screens/auth/signUp.screen.tsx
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.formContainer}>
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
              <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="#fff"
                autoCapitalize="none"
              />
              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>Inscription</Text>
                </TouchableOpacity>
              )}
               <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signUpText}>Déjà inscrit ? Connectez vous ici !</Text>
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
  signUpText: {
    marginTop: 20,
    color: '#EBB502',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SignUpScreen;
