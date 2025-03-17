import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { supabase } from '../../../supabase'
import { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthContext } from '../../../authContext';
import UserInfos from '../components/userInfos';
import Button from '../components/inputs/button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { signOut } = auth;

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error.message);
      return;
    }

    if (data.user) {
      setUser(data.user);
      setEmail(data.user.email || '');
      setDisplayName(data.user.user_metadata?.displayName || '');
      setPhone(data.user.user_metadata.phone || '');
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  async function updateUser() {
    if (!user) return;

    const { data, error } = await supabase.auth.updateUser({
      data: { displayName, phone, email},
    });

    if (error) {
      console.error('Error updating user:', error.message);
    } else {
      setUser(data.user);
      setIsEditing(false);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.imageContainer}
      >
        <Image
          source={require("../../../assets/images/etchebest.jpg")}
          style={styles.profileImage}
        />
      </View>
      <View style={styles.personalInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.personalInfoTitle}>Informations personnelles</Text>
          <View style={{ flexDirection: 'row', gap: '10' }}>
            {isEditing && (
              <TouchableOpacity onPress={updateUser}>
                <Image style={{ marginTop: 10, }} source={require("../../../assets/images/check.png")} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Image style={{ marginRight: 10, marginTop: 10 }} source={require("../../../assets/images/edit.png")} />
            </TouchableOpacity>
          </View>
        </View>

        <UserInfos
          isEditing={isEditing}
          sourceImg={require("../../../assets/images/profile.png")}
          title="Nom d'utilisateur"
          value={displayName}
          setValue={setDisplayName}
          placeholder="Nom d'utilisateur"
        />

        <UserInfos
          isEditing={isEditing}
          sourceImg={require("../../../assets/images/email.png")}
          title="Email"
          value={email}
          setValue={setEmail}
          placeholder="Email"
        />

        <UserInfos
          isEditing={isEditing}
          sourceImg={require("../../../assets/images/phone.png")}
          title="N° téléphone"
          value={phone}
          setValue={setPhone}
          placeholder="N° téléphone"
        />
      </View>
      <View style={styles.recipeCreated}>
        <View style={styles.recipeContainer}>
          <Image
            style={styles.recipeImage}
            source={require("../../../assets/images/like.png")}
          />
            <Text style={styles.recipeText}>Like reçus : 20</Text>
        </View>
      </View>
      <View style={styles.recipeCreated}>
        <View style={styles.recipeContainer}>
          <Image
            style={styles.recipeImage}
            source={require("../../../assets/images/recipe.png")}
          />
          
          <TouchableOpacity
            onPress={() => { navigation.navigate('DishesCreatedScreen'); }}
          >
            <Text style={styles.recipeText}>Recettes créées</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button onPress={signOut} title="Se déconnecter" color="#EA623D" />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  imageContainer: {
    marginTop: 100,
    marginBottom: 40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F4F5FF",
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
  },
  profileImage: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover', 
  },
  personalInfo: {
    backgroundColor: "#F4F5FF",
    height: 210,
    width: 350,
    borderRadius: 10,
  },
  personalInfoTitle: {
    fontSize: 15,
    color: '#000',
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'Montserrat',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#EA623D', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    width: 250,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  recipeCreated: {
    backgroundColor: "#F4F5FF",
    marginTop: 20,
    width: 350, 
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  recipeImage: {
    width: 30,
    height: 30,
  },
  recipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  recipeText: {
    marginLeft: 10,
    fontFamily: 'Montserrat',
    color: '#000',
    fontSize: 16,
  },

})

export default ProfileScreen