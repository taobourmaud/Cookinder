import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { DishesModel } from '../../_utils/models/dishes';
import { MySwipper } from '../../_utils/components/swipper';
import { TagsModel } from '../../_utils/models/tags';
import { DishesTagModel } from '../../_utils/models/dishes_tag';
import { RequestFilter } from '../../_utils/models/requestFilter';
import { LikesModel } from '../../_utils/models/likes';
import ApiHandler from '../../_utils/api/apiHandler';
import { RouteProp } from '@react-navigation/native';

type HomeScreenRouteProp = RouteProp<{ HomeScreen: { apiHandler: ApiHandler } }, 'HomeScreen'>;


export default function HomeScreen({route} : {route : HomeScreenRouteProp}) {
  const { apiHandler } = route.params 
  const [dishes, setDishes] = useState<DishesModel[]>([])
  const [tags, setTags] = useState<TagsModel[]>()
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false)
  const [filterApplied, setFilterApplied] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async() => {
      try {
        // Get user to check dishes liked
        const user = await apiHandler.getUser()
        // Filter on user likes
        const likes: LikesModel[] = await apiHandler.getData({ targetTable: 'likes', conditionsEq: new RequestFilter('user_id',user.id) })
        // Keep only likes_ids
        const dishesLiked_ids: string[] = likes.map((like) => like.dish_id)
        // Get all dishes before likes exclude treatment
        let dishes: DishesModel[] = await apiHandler.getData({ targetTable: 'dishes'}) as DishesModel[]
        const tags = await apiHandler.getData({ targetTable: 'tags' })

        if (filterApplied.length > 0) {
          // If filter is applied => Filter dishes by Tag
          const dishesTagFilteredId: DishesTagModel[] = await apiHandler.getData({targetTable: 'dishes_tags', conditionsIn: new RequestFilter('tag_id', filterApplied)})
          const dishesFilteredIds: string[] = dishesTagFilteredId?.map((data: DishesTagModel) => data.dish_id)
          dishes = await apiHandler.getData({targetTable: 'dishes', conditionsIn: new RequestFilter('id', dishesFilteredIds)})
        }

        dishes = dishes.filter(dish => !dishesLiked_ids.includes(dish.id))
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
  }, [filterApplied])
    
  const onPressFilter = (index: number) => {
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
      <View>
        <Text>Bonjour Username !</Text>
        <Text>Cherche des inspirations pour tes prochaines recettes !</Text>
      </View>
      <View style={styles.filterView}>
        {tags?.map((data) => {
          return (
              <TouchableOpacity key={data.id} style={styles.filterButton} onPress={() => onPressFilter(data['id'])}>
                <Text style={[styles.filterText, { color: data.id && filterApplied.includes(data.id) ? '#EBB502' : 'black' }]}>{data.title}</Text>
              </TouchableOpacity>
          )
        })}
      </View>
      <View>
        {
          isDataFetched ? ( 
            <MySwipper dishes={dishes} apiHandler={apiHandler}/>
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
});