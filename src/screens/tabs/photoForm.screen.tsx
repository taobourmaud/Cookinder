import { useCallback, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import { supabase } from '../../../supabase';
import { DishesModel } from '../../_utils/models/dishes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TagsModel } from '../../_utils/models/tags';
import { Picker } from '@react-native-picker/picker';
import { DishesTagModel } from '../../_utils/models/dishes_tag';


type PhotoFormNavigationProp = StackNavigationProp<RootStackParamList, 'PhotoForm'>;
type PhotoFormRouteProp = RouteProp<RootStackParamList, 'PhotoForm'>;

export default function PhotoFormScreen({routes} : {routes : HomeScreenRouteProp}) {
  const navigation = useNavigation<PhotoFormNavigationProp>();
  const route = useRoute<PhotoFormRouteProp>();
  const imageUri = route.params?.imageUri;
  const { apiHandler }  = route.params

  const [title, setTitle] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('Intermédiaire');
  const [level, setLevel] = useState<number>(1);
  const [servings, setServings] = useState<number>(4);
  const [time, setTime] = useState<number>(30);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [newIngredient, setNewIngredient] = useState<string>('');
  const [newInstruction, setNewInstruction] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  // Tags option dropdown
  const [tagsOption, setTagsOption] = useState<TagsModel[]>([])
  // Tag selected by user
  const [selectedTag, setSelectedTag] = useState<number>(1);


  useFocusEffect(
    useCallback(() => {
      const fetchTags = async () => {
        const initTags = await apiHandler.getData({ targetTable: 'tags' }) as TagsModel[];
        setTagsOption(initTags);
      };
      fetchTags();
    }, [])
  )

  function goToTakePicture() {
    navigation.navigate('TakePicture', { apiHandler: apiHandler }); 
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
    const user = await apiHandler.getUser()
    const fileName = `dishes_images/${Date.now()}.jpg`;

    const image = await apiHandler.uploadImage(fileName, imageUri)

    const imageUrl = `${supabase.storage.from('dishes_images').getPublicUrl(fileName).data.publicUrl}`;
    const userName = user.app_metadata.provider
    const newDishesData = new DishesModel(
      title, description, imageUrl, time, servings, ingredients, instructions, level, userName
    )
    const newDish = await apiHandler.postData('dishes', newDishesData)
    // Rely dish to tag
    const newdishesTag = new DishesTagModel(newDish[0].id, selectedTag)
    await apiHandler.postData('dishes_tags', newdishesTag)
    navigation.navigate("HomeScreen", { apiHandler: apiHandler });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Image
                  source={require('../../../assets/COOKINDER.png')}
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
            <Picker
              selectedValue={selectedTag}
              onValueChange={(newTags) => setSelectedTag(newTags)}
              style={styles.input}
            >
              {tagsOption.map((item) => (
                <Picker.Item key={item.id} label={item.title} value={item.id} />
              ))}
            </Picker>
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
                  onPress={() => setServings(Math.max(1, servings - 1))}>
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
                  onChangeText={(val) => setTime(Number(val) || 0)}
                />
                <Text style={styles.minInput}>min</Text>
              </View>
            </View>
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
            <View>
              <TextInput 
              style={styles.input}
              placeholder='Description'
              value={description}
              onChangeText={setDescription}
              multiline={true}
              />
            </View>
            <Button title='Ajouter ce plat !' accessibilityLabel="Ajouter ce plat !" onPress={handleSubmit} color="#FFD700"/>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logo: {
    resizeMode: 'contain',
    textAlign: 'right',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'flex-end', 
    paddingHorizontal: 20,
    paddingTop: 10,
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
  picker: {
    width: 200,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
});