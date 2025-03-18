import React, { useContext, useEffect, useState } from "react";
import DishesList from "../components/dishes.list";
import { AuthContext } from "../../../authContext";
import { DishesModel } from "../../_utils/models/dishes";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import { RequestFilter } from "../../_utils/models/requestFilter";
import ApiHandler from "../../_utils/api/apiHandler";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";

interface LikesCount {
  [key: string]: number;
}

interface TagsCount {
  [key: string]: string[];
}

type DishesCreatedScreenRouteProp = RouteProp<{ DishesCreatedScreen: { apiHandler: ApiHandler} }, 'DishesCreatedScreen'>;

export default function DishesCreatedScreen({route} : {route : DishesCreatedScreenRouteProp}) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { userData } = useContext(AuthContext);
    const { apiHandler } = route.params
    const userId = userData.id;
    const [dishes, setDishes] = useState<DishesModel[]>([]);
    const [likesCount, setLikesCount] = useState<LikesCount>({});
    const [tagsCount, setTagsCount] = useState<TagsCount>({});

    async function getDishesCreated() {
        const dishes = await apiHandler.getData({ targetTable: 'dishes', conditionsEq: new RequestFilter('user_id', userId) })

        try {
            if (dishes) {
                const normalizedData = dishes.map(dish => ({
                    id: dish.id, 
                    dishes: dish, 
                }));
                
                setDishes(normalizedData);
                
                const dishTagsCount: TagsCount = {};
                const dishLikesCount: LikesCount = {};
    
                for (let item of normalizedData) {
                    const dish = item.dishes;
                    if (dish && dish.id) { 
                        dishLikesCount[dish.id] = (await apiHandler.getData({targetTable: 'likes', conditionsEq: new RequestFilter('dish_id', dish.id) })).length;
                        dishTagsCount[dish.id] = await apiHandler.getTagsOfDish(dish.id)
                    } else {
                        console.warn('Dish or dish.id is undefined:', dish);
                    }
                }
                setLikesCount(dishLikesCount);
                setTagsCount(dishTagsCount);
            }
        } catch (error: Error | any) {
            console.error('Erreur lors de la récupération des recettes créées :', error.message);
        }
    }

    useEffect(() => {
        getDishesCreated();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Image
                    source={require('../../../assets/COOKINDER.png')}
                    style={styles.logoImage}
                />
            </View>
            <Text style={styles.headerDisplayName}>{userData.userMetadata.displayName}, voici les plats que vous avez créés !</Text>
            <Text style={styles.subHeader}>Consulte les plats que tu as enregistrés !</Text>

            <DishesList
                navigation={navigation}
                dishes={dishes}
                userData={userData}
                likesCount={likesCount}
                tagsCount={tagsCount}
                isLikedList={false}
                fetchData={getDishesCreated}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 40,
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    logoImage: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
        marginLeft: 'auto',
    },
    headerDisplayName: {
        fontSize: 24,
        marginBottom: 10,
        paddingLeft: 10,
        fontFamily: 'Montserrat',
    },
    subHeader: {
        fontSize: 16,
        paddingLeft: 10,
        marginBottom: 10,
        fontFamily: 'Montserrat',
    },
});