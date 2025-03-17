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
    const userName = user.user.user_metadata.displayName;


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
        username: userName,
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
      <Image source={require('../../assets/images/COOKINDER.png')} style={styles.logo} />
      <Text style={styles.header}>Créer un plat ici !</Text>
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
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.toggleContainer}>
        {['Facile', 'Intermédiaire', 'Difficile'].map(level => (
          <TouchableOpacity
            key={level}
            style={[styles.toggleButton, difficulty === level && styles.selectedToggle]}
            onPress={() => handleDifficultyChange(level)}
          >
            <Text style={styles.toggleText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => setServings(servings - 1)}>
          <Ionicons name="remove-circle-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text>{servings} personnes</Text>
        <TouchableOpacity onPress={() => setServings(servings + 1)}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.timeInput}
          keyboardType="numeric"
          value={String(time)}
          onChangeText={(val) => setTime(Number(val))}
        />
        <Text>min</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
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
              style={styles.input}
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
      </ScrollView>

      <Button title="Soumettre" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  logo: {
    resizeMode: 'contain',
    textAlign: 'right',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    height: 200, // Même hauteur que l’image
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: '#E0E0E0', // Gris clair pour la zone vide
    borderWidth: 2,
    borderColor: '#A0A0A0', // Gris plus foncé pour la bordure
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
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  selectedToggle: {
    backgroundColor: '#FFD700',
  },
  toggleText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 50,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  listItem: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    flex:1,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  }
});
