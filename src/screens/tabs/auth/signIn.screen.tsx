import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image,
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../../../../authContext';
import { supabase } from '../../../../supabase';
import { RootStackParamList } from '../../../../App';
import SocialButton from '../../components/inputs/social-button';

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
    <View
      style={styles.background}>
      <View>
        <Image
          source={require("../../../../assets/images/signIn.png")}
        />
        <View style={styles.textOverlay}>
          <Text style={styles.text}>Connectez-vous à votre compte</Text>
        </View>
      </View>
      <View
        style={styles.formContainer}
      >
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
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator />
        ) :  
        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
          <Text style={styles.loginButtonText}>Connexion</Text>
        </TouchableOpacity>}

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Ou avec</Text>
          <View style={styles.dividerLine} />
        </View> 

        <SocialButton
          title='Se connecter avec Facebook'
          sourceImg={require("../../../../assets/images/facebook.png")}
          backgroundColor='#3b5998'
          color='white'
          onPress={() => console.log('Facebook')} 
        />

        <SocialButton
          title='Se connecter avec Apple'
          sourceImg={require("../../../../assets/images/apple.png")}
          backgroundColor='black'
          color='white'
          onPress={() => console.log('Apple')}
        />

        <SocialButton
          title='Se connecter avec Google'
          sourceImg={require("../../../../assets/images/google.png")}
          backgroundColor='FAFAFA'
          color='black'
          onPress={() => console.log('Google')}
          isGoogle
        />

        <TouchableOpacity style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLinkText}>Pas de compte ? <Text style={{ fontWeight: 'bold' }}>Inscrivez-vous !</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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
    marginBottom: 10,
    fontSize: 16,
    color: '#333333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#000000',
    fontSize: 10,
    fontFamily: 'Montserrat-Light',
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
  dividerText: {
    paddingHorizontal: 10,
    color: '#000000',
    fontSize: 11,
    fontFamily: 'Montserrat-Light',
  },
  loginButton: {
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  signupLink: {
    alignSelf: 'center',
    marginTop: 20,
  },
  signupLinkText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
});

export default SignInScreen;
