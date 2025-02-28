import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../../authContext';
import { DishesModel } from '../_utils/models/dishes';
import { MySwipper } from '../_utils/components/swipper';
import { TagsModel } from '../_utils/models/tags';


export default function HomeScreen({route} : {route : any}) {
  const { apiHandler } = route.params
  const auth = useContext(AuthContext);
  const [allDishes, setDishes] = useState<DishesModel[]>([])
  const [tags, setTags] = useState<TagsModel[]>()
  const [isDataFetched, setIsDataFetched] = useState(false)

  if (!auth) return null;

  const { signOut } = auth;

  useEffect(() => {
    const fetchData = async() => {
      try {
        const dishes = await apiHandler.getData('dishes')
        const tags = await apiHandler.getData('tags')
        setDishes(dishes as DishesModel[])
        setTags(tags as TagsModel[])
      } catch (error: Error | any) {
        console.error(error.message)
      } finally {
        if (isDataFetched === false)
          setIsDataFetched(true)
      }
    }
    fetchData()
  }, [])
    
  // TODO Faire un composant pour les filtres et réadapter la fonction onPressFilter
  const onPressFilter = (index: number) => {
    console.log(index)
  }

  return (
    <View style={styles.screen}>
      <View>
        <Text>Bonjour Username !</Text>
        <Text>Cherche des inspirations pour tes prochaines recettes !</Text>
      </View>
      <View style={styles.filterView}>
        {tags?.map((data) => {
          return (
              <TouchableOpacity key={data.id} style={styles.filterButton} onPress={() => onPressFilter(data?.id)}>
                <Text style={styles.filterText}>{data.title}</Text>
              </TouchableOpacity>
          )
        })}
      </View>
      <View>
        {
          isDataFetched ? ( 
            <MySwipper dishes={allDishes} apiHandler={apiHandler}/>
          ) : (
            <View>
              <Text>Chargement des données...</Text>
            </View>
          )
        }
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff'
  },
  filterView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  filterButton: {
    backgroundColor: '#F4F5FF94',
    width: '30%',
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 8
  },
  filterText: {
    color: "#000000",
    fontSize: 16
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,    
    backgroundColor: "#fff",
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  image: {
    width: '60%',
    height: '60%',
    borderRadius: 10,
  },
});