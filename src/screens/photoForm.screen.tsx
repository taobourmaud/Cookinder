import { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { supabase } from '../../supabase';

type PhotoFormNavigationProp = StackNavigationProp<RootStackParamList, 'PhotoForm'>;
type PhotoFormRouteProp = RouteProp<RootStackParamList, 'PhotoForm'>;

export default function PhotoFormScreen() {
  const navigation = useNavigation<PhotoFormNavigationProp>();
  const route = useRoute<PhotoFormRouteProp>();
  const [imageUri, setImageUri] = useState(route.params?.imageUri || null);

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Intermédiaire');
  const [level, setLevel] = useState(1);
  const [servings, setServings] = useState(4);
  const [time, setTime] = useState(30);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');


  function goToTakePicture() {
    navigation.navigate('TakePicture'); 
  }


  function addIngredient() {
    if (newIngredient.trim() !== '') {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient('');
    }
  }

  function addInstruction() {
    if (newInstruction.trim() !== '') {
      setInstructions([...instructions, newInstruction]);
      setNewInstruction('');
    }
  }

  const handleDifficultyChange = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    switch (selectedDifficulty) {
      case 'Facile':
        setLevel(1);
        break;
      case 'Intermédiaire':
        setLevel(2);
        break;
      case 'Difficile':
        setLevel(3);
        break;
      default:
        setLevel(2);
    }
  };

  async function handleSubmit() {
    setLoading(true);

    // Récupérer l'utilisateur connecté
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      Alert.alert('Erreur', 'Utilisateur non connecté');
      setLoading(false);
      return;
    }

    const userId = user.user.id;

    // Upload de l'image sur Supabase Storage
    const fileName = `dishes_images/${Date.now()}.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('dishes_images') // Nom du bucket Supabase
      .upload(fileName, {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName,
      });

    if (uploadError) {
      Alert.alert('Erreur', 'Échec de l’upload de l’image');
      setLoading(false);
      return;
    }

    const imageUrl = `${supabase.storage.from('dishes_images').getPublicUrl(fileName).data.publicUrl}`;

    // Insérer les données dans la table 'dishes'
    const { error: insertError } = await supabase.from('dishes').insert([
      {
        title,
        description,
        ingredients,
        instructions,
        cooking_time: time,
        number_persons: servings,
        difficulty: level,
        image_url: imageUrl,
        user_id: userId,
      },
    ]);

    if (insertError) {
      console.log(insertError);
      Alert.alert('Erreur', 'Échec de l’enregistrement du plat');
    } else {
      Alert.alert('Succès', 'Plat enregistré avec succès !');
      navigation.navigate('HomeScreen');
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
            source={require('../../assets/COOKINDER.png')}
            style={styles.logoImage}
        />
      </View>
      <Text style={styles.textHeader}>Créer un plat ici !</Text>
      <Text style={styles.subHeader}>Créer un plat pour le partager aux utilisateurs !</Text>
      <TouchableOpacity style={[styles.imageContainer, !imageUri && styles.placeholder]} onPress={goToTakePicture}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>📷 Prendre une photo</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Titre du plat"
        placeholderTextColor={'#000000'}
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.toggleContainer}>
        {['Facile', 'Intermédiaire', 'Difficile'].map(level => (
          <TouchableOpacity
            key={level}
            style={styles.toggleButton}
            onPress={() => handleDifficultyChange(level)}
          >
            <Text style={[styles.toggleText, difficulty === level && styles.selectedToggle, difficulty === level && { color: '#FFD700' }]}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <View style={styles.personsRow}>
          <TouchableOpacity
            onPress={() => setServings(servings - 1)}>
            <Text style={{'fontSize': 20}} >-</Text>
          </TouchableOpacity>
          <Text style={styles.personsText}>{servings} personnes</Text>
          <TouchableOpacity onPress={() => setServings(servings + 1)}>
          <Text style={{'fontSize': 20}}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timeRow}>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            value={String(time)}
            onChangeText={(val) => setTime(Number(val))}
          />
          <Text style={styles.minInput}>min</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputIngredient}
              placeholder="Ajouter un ingrédient"
              value={newIngredient}
              onChangeText={setNewIngredient}
            />
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={ingredients}
            renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
    
        <View style={styles.section}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputIngredient}
              placeholder="Ajouter une instruction"
              value={newInstruction}
              onChangeText={setNewInstruction}
            />
            <TouchableOpacity style={styles.addButton} onPress={addInstruction}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={instructions}
            renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Ajouter ce plat !</Text>
        </TouchableOpacity>
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 40
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'flex-end', 
    paddingHorizontal: 20,
  },
  textHeader: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    paddingTop: 30,
  },
  logoImage: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginBottom: -30
  },
  subHeader: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Montserrat-Light',
  },
  imageContainer: {
    width: '100%',
    height: 175,
    marginTop: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 10,
    marginTop: 20, 
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: 'Montserrat',
    fontSize: 16,
    
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 10,  
    marginHorizontal: 5,  
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#F4F5FF',
    minWidth: 100,
    height: 40,
  },
  selectedToggle: {
    color: '#FFD700',
  },
  toggleText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
  },
  personsRow :{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
    padding: 10,
    width: 200,
    fontFamily: 'Montserrat',
  },
  personsText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
  },

  timeInput: {
    width: 50,
    textAlign: 'center',
    padding: 12,
  },
  minInput: {
    borderLeftWidth: 1,
    borderColor: '#FFD700',
    width: 50,
    textAlign: 'center',
    padding: 12,
  },
  section: {
    flexDirection: 'column',
    // alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIngredient: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Montserrat',
  },
  addButton: {
    padding: 5,
    marginLeft: 10,
  },
  addButtonText: {
    fontSize: 30,
    color: '#000',
    fontFamily: 'Montserrat',
  },
  listItem: {
    backgroundColor: '#F4F5FF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    fontFamily: 'Montserrat',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    marginTop: 10,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
});
