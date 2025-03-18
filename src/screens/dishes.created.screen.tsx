import React, { useContext, useEffect, useState } from "react";
import DishesList from "./components/dishes.list";
import { supabase } from "../../supabase";
import { AuthContext } from "../../authContext";
import { DishesModel } from "../_utils/models/dishes";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import { getNumberOfLikesDish, getTagsOfDish } from '../../services/dishesService';
import {Ionicons} from "@expo/vector-icons";

interface LikesCount {
  [key: string]: number;
}

interface TagsCount {
  [key: string]: string[];
}

export default function DishesCreatedScreen({ navigation }) {
    const { userData } = useContext(AuthContext);
    const userId = userData.id;
    const [dishes, setDishes] = useState<DishesModel[]>([]);
    const [likesCount, setLikesCount] = useState<LikesCount>({});
    const [tagsCount, setTagsCount] = useState<TagsCount>({});

    async function getDishesCreated() {
        const { data, error } = await supabase.from('dishes').select('*').eq('user_id', userId);

        if (error) {
            console.error('Error fetching dishes:', error.message);
            return;
        }

        try {
            if (data) {
                const normalizedData = data.map(dish => ({
                    id: dish.id, 
                    dishes: dish, 
                }));
                
                setDishes(normalizedData);
                
                const dishTagsCount: TagsCount = {};
                const dishLikesCount: LikesCount = {};
    
                for (let item of normalizedData) {
                    const dish = item.dishes;
                    if (dish && dish.id) { 
                        dishLikesCount[dish.id] = await getNumberOfLikesDish(dish.id);
                        dishTagsCount[dish.id] = await getTagsOfDish(dish.id);
                    } else {
                        console.warn('Dish or dish.id is undefined:', dish);
                    }
                }
    
                setLikesCount(dishLikesCount);
                setTagsCount(dishTagsCount);
            }
        } catch (error) {
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
                    source={require('../../assets/COOKINDER.png')}
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
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 20,
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
