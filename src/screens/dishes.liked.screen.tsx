import {Image, StyleSheet, Text, SafeAreaView, View,} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import {
    getLikedDishesByUser,
    getNumberOfLikesDish,
    getTagsOfDish
} from '../../services/dishesService';
import { AuthContext } from '../../authContext';
import { DishesModel } from '../_utils/models/dishes';
import ApiHandler from '../_utils/api/apiHandler';
import DishesList from "./components/dishes.list";

type DishesScreenRouteProp = RouteProp<{ HomeScreen: { apiHandler: ApiHandler } }, 'HomeScreen'>;

export default function DishesScreen({ route, navigation } : {route : DishesScreenRouteProp}) {

    const { userData } = useContext(AuthContext);
    const { apiHandler } = route.params
    const userId = userData.id;
    const userDisplayName = userData.userMetadata.displayName
    const [dishes, setDishes] = useState<DishesModel[]>([]);
    const [likesCount, setLikesCount] = useState<{ [key: string]: number }>({});
    const [tagsCount, setTagsCount] = useState({});

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

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/COOKINDER.png')}
                        style={styles.logoImage}
                    />
                </View><Text style={styles.headerDisplayName}>{userDisplayName}, voici tes plats préférés !</Text>
                <Text style={styles.subHeader}>Consulte les plats que tu as enregistrés !</Text>
                <DishesList
                    navigation={navigation}
                    dishes={dishes}
                    userData={userData}
                    likesCount={likesCount}
                    tagsCount={tagsCount}
                    isLikedList={true}
                />
            </SafeAreaView>
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
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0ff',
        marginBottom: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f0f0ff',
        flex: 1,
        padding: 5,
        borderRadius: 15,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        marginLeft: 10,
        flex: 1,
    },
    deleteButton: {
        backgroundColor: '#E57373',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        width: 40,
        height: 130,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    confirmButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#777',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
