import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { User as SupabaseUser } from '@supabase/supabase-js';
import { AuthContext } from '../../authContext';


const ProfileScreen = () => {
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
        style={{
          marginTop: 100,
          marginBottom: 40,
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: "#F4F5FF",
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden', 
        }}
      >
        <Image
          source={require("../../assets/images/etchebest.jpg")}
          style={{
            width: '100%', 
            height: '100%', 
            resizeMode: 'cover', 
          }}
        />
      </View>
      <View style={styles.personalInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.personalInfoTitle}>Informations personnelles</Text>
          <View style={{ flexDirection: 'row', gap: '10' }}>
            {isEditing && (
              <TouchableOpacity onPress={updateUser}>
                <Image style={{ marginTop: 10 }} source={require("../../assets/images/check.png")} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Image style={{ marginRight: 10, marginTop: 10 }} source={require("../../assets/images/edit.png")} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.personalInfoFieldContainer}>
          <Image
              source={require("../../assets/images/profile.png")}
            />
          <View style={styles.personalInfoFieldText}>
            <Text style={styles.personalInfoFieldTitle}>Nom d'utilisateur</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Nom d'utilisateur"
              />
            ) : (
              <Text style={styles.personalInfoFieldField}>{displayName || 'Non renseigné'}</Text>
            )}
          </View>
        </View>
        <View style={styles.personalInfoFieldContainer}>
          <Image
              source={require("../../assets/images/email.png")}
            />
          <View style={styles.personalInfoFieldText}>
            <Text style={styles.personalInfoFieldTitle}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType='email-address'
              />
            ) : (
              <Text style={styles.personalInfoFieldField}>{email || 'Non renseigné'}</Text>
            )}
          </View>
        </View>
        <View style={styles.personalInfoFieldContainer}>
          <Image
              source={require("../../assets/images/phone.png")}
            />
          <View style={styles.personalInfoFieldText}>
            <Text style={styles.personalInfoFieldTitle}>N° téléphone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="N° téléphone"
                keyboardType='phone-pad'
              />
            ) : (
              <Text style={styles.personalInfoFieldField}>{phone || 'Non renseigné'}</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
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
    borderBottomColor: '#EBB502',
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
})

export default ProfileScreen