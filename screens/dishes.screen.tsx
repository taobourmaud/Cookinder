import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {getLikedDishesByUser, getNumberOfLikesDish, getTagsOfDish} from '../services/dishesService';
import {AuthContext} from "../authContext";

export default function DishesScreen({ navigation }) {

    const { userData } = useContext(AuthContext);
    const userId = userData.id;
    const userDisplayName = userData.userMetadata.displayName
    const [dishes, setDishes] = useState([]);
    const [likesCount, setLikesCount] = useState<{ [key: string]: number }>({});
    const [tagsCount, setTagsCount] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            try {
                const data = await getLikedDishesByUser(userId);
                setDishes(data);

                const dishLikesCount: { [key: string]: number } = {};
                const dishTagsCount = {};

                for (let dish of data) {
                    dishLikesCount[dish.dishes.id] = await getNumberOfLikesDish(dish.dishes.id);

                    dishTagsCount[dish.dishes.id] = await getTagsOfDish(dish.dishes.id);
                }
                setLikesCount(dishLikesCount);
                setTagsCount(dishTagsCount);

            } catch (error) {
                console.error('Erreur lors de la récupération des recettes likées :', error.message);
            }
        };

        fetchData();
    }, [userId])

    return (
            <View style={styles.container}>
                <Text style={styles.header}>{userDisplayName}, voici tes plats préférées !</Text>
                <Text style={styles.subHeader}>Consulte les plats que tu as enregistrées !</Text>
                <FlatList
                    data={dishes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const dishId = item.dishes.id;
                        const likesForDish = likesCount[dishId];
                        const tagsForDish = tagsCount[dishId];

                        return (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => {
                                    console.log(dishId);
                                    navigation.navigate('DishDetailsScreen', { dishId, userData});
                                }}
                            >
                                <View style={styles.card}>
                                    <Image source={{ uri: item.dishes.image_url }} style={styles.image} />
                                    <View style={styles.info}>
                                        <Text style={styles.title}>{item.dishes.title}</Text>
                                        <Text style={styles.info}>Tags : {tagsForDish && tagsForDish.length > 0 ? tagsForDish.join(', ') : 'Aucun tag'}</Text>
                                        <Text style={styles.info}>Liké par : {likesForDish} personnes | {item.dishes.difficulty.title}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9fc',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f0f0ff',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#ccc',
    },
    info: {
        marginLeft: 10,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
