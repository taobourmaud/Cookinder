import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { supabase } from '../../../supabase'
import { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthContext } from '../../../authContext';
import UserInfos from '../components/userInfos';
import Button from '../components/inputs/button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { RouteProp } from '@react-navigation/native';
import ApiHandler from '../../_utils/api/apiHandler';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;
type ProfileScreenRouteProp = RouteProp<{ ProfileScreen: { apiHandler: ApiHandler } }, 'ProfileScreen'>;


const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation } : {route : ProfileScreenRouteProp}) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { apiHandler } = route.params
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [likes, setLikes] = useState<number | null>(null);

  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { signOut } = auth;

  async function getUser() {
    const user = await apiHandler.getUser()

    if (user) {
      setUser(user);
      setEmail(user.email || '');
      setDisplayName(user.user_metadata?.displayName || '');
      setPhone(user.user_metadata.phone || '');
    }
  }

  

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

  async function getNumberOfLikes() {
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('id')
      .eq('user_id', user?.id);

      if (dishesError) {
        console.error('Erreur lors de la récupération des plats:', dishesError.message);
      } else if (dishes.length === 0) {
        console.log("L'utilisateur n'a créé aucun plat.");
      } else {
      const dishIds = dishes.map(dish => dish.id); 

      const { count, error: likesError } = await supabase
        .from('likes')
        .select('id', { count: 'exact', head: true })
        .in('dish_id', dishIds);

      if (likesError) {
        console.error('Erreur lors de la récupération des likes:', likesError.message);
      }
      setLikes(count);
    }
  }

  useEffect(() => {
    getUser();
    if (user?.id) {
      getNumberOfLikes();
    }
  }, [])

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
            <Text style={styles.recipeText}>Like reçus : {likes ?? 0}</Text>
        </View>
      </View>
      <View style={styles.recipeCreated}>
        <View style={styles.recipeContainer}>
          <Image
            style={styles.recipeImage}
            source={require("../../../assets/images/recipe.png")}
          />
          
          <TouchableOpacity
            onPress={() => { navigation.navigate('DishesCreatedScreen', { apiHandler: apiHandler }); }}
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