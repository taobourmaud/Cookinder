import React, { useEffect, useState} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { DishesModel } from '../../_utils/models/dishes';
import { MySwipper } from '../components/swipper';
import { TagsModel } from '../../_utils/models/tags';
import { DishesTagModel } from '../../_utils/models/dishes_tag';
import { RequestFilter } from '../../_utils/models/requestFilter';
import { LikesModel } from '../../_utils/models/likes';
import ApiHandler from '../../_utils/api/apiHandler';
import { RouteProp } from '@react-navigation/native';
import "@fontsource/montserrat"; 
import "inter-ui/inter.css";

type HomeScreenRouteProp = RouteProp<{ HomeScreen: { apiHandler: ApiHandler } }, 'HomeScreen'>;

const { height } = Dimensions.get('window');

export default function HomeScreen({route} : {route : HomeScreenRouteProp}) {
  const { apiHandler } = route.params 
  const [dishes, setDishes] = useState<DishesModel[]>([])
  const [tags, setTags] = useState<TagsModel[]>()
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false)
  const [filterApplied, setFilterApplied] = useState<number[]>([])
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    const fetchData = async() => {
      try {
        // Get user to check dishes liked
        const user = await apiHandler.getUser()
        const likes = await apiHandler.getData({ targetTable: 'likes', conditionsEq: new RequestFilter('user_id', user.id) }) as LikesModel[] | []
        // Get all dishes before likes exclude treatment
        let dishes: DishesModel[] = await apiHandler.getData({ targetTable: 'dishes'}) as DishesModel[]
        const tags = await apiHandler.getData({ targetTable: 'tags' })

        if (filterApplied.length > 0) {
          // If filter is applied => Filter dishes by Tag
          const dishesTagFilteredId= await apiHandler.getData({targetTable: 'dishes_tags', conditionsIn: new RequestFilter('tag_id', filterApplied)}) as DishesTagModel[]
          const dishesFilteredIds = dishesTagFilteredId?.map((data: DishesTagModel) => data.dish_id) as string[]
          dishes = await apiHandler.getData({targetTable: 'dishes', conditionsIn: new RequestFilter('id', dishesFilteredIds)})
        }

        if (likes.length > 0) {
          // Keep only likes_ids
          const dishesLiked_ids: string[] = likes.map((like) => like.dish_id)
          dishes = dishes.filter(dish => !dishesLiked_ids.includes(dish.id))
        }
        setDishes(dishes as DishesModel[])
        setTags(tags as TagsModel[])
        setUsername(user.user_metadata.displayName)
      } catch (error: Error | any) {
        console.error(error.message)
      } finally {
        if (isDataFetched === false)
          setIsDataFetched(true)
      }
    }
    fetchData()
  }, [filterApplied])
    
  const onPressFilter = (index: number) => {
    setIsDataFetched(false)
    setFilterApplied(prevFilter => {
      if (filterApplied.includes(index)){
        const filteredNumber = prevFilter.filter(itemIndex => itemIndex !== index)
        return filteredNumber.length === 0 ? [] : filteredNumber
      } else {
        const newFilters = [...prevFilter, index]
        return newFilters
      }
    })
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
            source={require('../../../assets/COOKINDER.png')}
            style={styles.logoImage}
        />
      </View>
      <View style={styles.titleView}>
        <Text style={styles.usernameTitle} >Bonjour {username} !</Text>
        <Text style={styles.subTitle}>Cherche des inspirations pour tes prochaines recettes !</Text>
      </View>
      <View style={styles.filterView}>
        {tags?.map((data) => {
          return (
              <TouchableOpacity key={data.id} style={styles.filterButton} onPress={() => onPressFilter(data['id'])}>
                <Text style={[styles.filterText, { color: data.id && filterApplied.includes(data.id) ? '#FFD700' : 'black' }]}>{data.title}</Text>
              </TouchableOpacity>
          )
        })}
      </View>
        {
          !isDataFetched ? (
            <View style={[styles.content, { marginTop: 100 }]}>
              <ActivityIndicator size="large" color="#EBB502"/>
              <Text style={styles.loaderText}>Chargement des données...</Text>
            </View>
          ) : (isDataFetched && dishes.length === 0) ? (
            <View style={[styles.content, { marginTop: 100 }]}>
              <Text>Aucun donnée disponible</Text>
            </View>
          ) : (
            <View style={styles.content}>
              <MySwipper dishes={dishes} apiHandler={apiHandler}/>
            </View>
          ) 
        }
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: 'column',
    alignItems: "center",
    width: "100%",
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
  logoImage: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
    marginBottom: -30
  },
  titleView: {
    paddingTop: 30,
    width: "100%",
    paddingLeft: 20,
    textAlign: 'left',
  },
  usernameTitle: {
    fontFamily: 'Montserrat',
    fontSize: 24,
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontStyle: 'italic',
    fontSize: 12,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center"
  },
  filterView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // padding: 6,
    width: "94%",
    height: height * 0.1,
    marginTop: 10,
    marginBottom: -40
  },
  filterButton: {
    fontFamily: 'Montserrat',
    backgroundColor: '#F4F5FF',
    opacity: 58,
    height: "40%",
    width: '31%',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  filterText: {
    color: "#000000",
    fontSize: 14,
  },
});