import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../../authContext';
import { DishesModel } from '../_utils/models/dishes';
import { MySwipper } from '../_utils/components/swipper';


export default function HomeScreen({route} : {route : any}) {
  const { apiHandler } = route.params
  const auth = useContext(AuthContext);
  const [allDishes, setAllDishes] = useState<DishesModel[]>([])
  const [isDataFetched, setIsDataFetched] = useState(false)

  if (!auth) return null;

  const { signOut } = auth;

  useEffect(() => {
    const fetchData = async() => {
      try {
        const dataRetrieve = await apiHandler.getData('dishes')
        setAllDishes(dataRetrieve as DishesModel[])
      } catch (error: Error | any) {
        console.error(error.message)
      } finally {
        if (isDataFetched === false)
          setIsDataFetched(true)
      }
    }
    fetchData()
  }, [])

  const filtersValue = [
    { id : 1, value: "Petit-déjeuner"},
    { id: 2, value: "Plats" },
    { id: 3, value: "Végétarien" },
    { id: 4, value: "Poulet" },
    { id: 5, value: "Viande" },
    { id: 6, value: "10'" }
  ]
    
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
        {filtersValue.map((data) => {
          return (
              <TouchableOpacity key={data.id} style={styles.filterButton} onPress={() => onPressFilter(data.id)}>
                <Text style={styles.filterText}>{data.value}</Text>
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