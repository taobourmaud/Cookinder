import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import { getLikedDishesByUser, getNumberOfLikesDish, getTagsOfDish } from '../../../services/dishesService';
import { AuthContext } from '../../../authContext';

export default function DishesScreen({ navigation }) {

    const { userData } = useContext(AuthContext);
    const userId = userData.id;
    const userDisplayName = userData.userMetadata.displayName
    const [dishes, setDishes] = useState([]);
    const [likesCount, setLikesCount] = useState<{ [key: string]: number }>({});
    const [tagsCount, setTagsCount] = useState({});
    const [userDishCreated, setUserDishCreated] = useState("");

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
                    setUserDishCreated(dish.dishes.username);
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
                <View style={styles.header}>
                    <Image
                        source={require('../../../assets/COOKINDER.png')}
                        style={styles.logoImage}
                    />
                </View>
                <Text style={styles.headerDisplayName}>{userDisplayName}, voici tes plats préférés !</Text>
                <Text style={styles.subHeader}>Consulte les plats que tu as enregistrés !</Text>
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
                                onPress={() => { navigation.navigate('DishDetailScreen', { dishId, userData, tagsForDish});}}
                            >
                                <View style={styles.card}>
                                    <Image source={{ uri: item.dishes.image_url }} style={styles.image} />
                                    <View style={styles.info}>
                                        <Text style={styles.title}>{item.dishes.title}</Text>
                                        <Text style={styles.info}>Tags : {tagsForDish && tagsForDish.length > 0 ? tagsForDish.join(', ') : 'Aucun tag'}</Text>
                                        <Text style={styles.info}>Liké par : {likesForDish} personnes | {item.dishes.difficulty.title}</Text>
                                        <Text style={styles.info}>Créé par : {userDishCreated}</Text>
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
        flexDirection: 'row',
        paddingVertical: 10,
    },
    logoImage: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
        marginLeft: 'auto',
    },
    headerDisplayName: {
        fontSize: 24,
        marginBottom: 20,
        paddingLeft: 10,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        paddingLeft: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f0f0ff',
        padding: 5,
        marginBottom: 10,
        borderRadius: 15,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#ccc',
    },
    title: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        marginLeft: 10,
    }
});
