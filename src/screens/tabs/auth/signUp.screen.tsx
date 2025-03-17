import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../App';
import { AuthContext } from '../../../../authContext';
import { supabase } from '../../../../supabase';

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
    <View style={styles.background}>
      <View>
        <Image
          source={require("../../../../assets/images/signIn.png")}
        />
        <View style={styles.textOverlay}>
          <Text style={styles.text}>Inscrivez vous ici !</Text>
        </View>
      </View>
      <View
        style={styles.formContainer}
      >
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
          placeholder="Nom d'utilisateur"
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          placeholder='Email'
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          autoCapitalize="none"
          placeholder='Mot de passe'
          secureTextEntry
        />

        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Inscription</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInLinkText}>Déjà inscrit ? <Text style={{ fontWeight: 'bold' }}>Connectez-vous !</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 10, 
    left: 10, 
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold', 
    width: 200, 
    fontFamily: 'Montserrat'
  },
  formContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
  },
  signUpButton: {
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  signInLink: {
    alignSelf: 'center',
  },
  signInLinkText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000000',
  },
});

export default SignUpScreen;
