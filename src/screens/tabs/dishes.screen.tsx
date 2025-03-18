import {
    FlatList, Image, StyleSheet, Text, TouchableOpacity, SafeAreaView, View,
    RefreshControl, Modal
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    getLikedDishesByUser,
    getNumberOfLikesDish,
    getTagsOfDish,
    deleteDishByUser
} from '../../../services/dishesService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../../../authContext';
import { DishesModel } from '../../_utils/models/dishes';
import { RouteProp } from '@react-navigation/native';
import ApiHandler from '../../_utils/api/apiHandler';
import ConfirmDeleteModal from "../components/confirmDeleteModal";
import { RequestFilter } from '../../_utils/models/requestFilter';
import { LikesModel } from '../../_utils/models/likes';

type DishesScreenRouteProp = RouteProp<{ DishesScreen: { apiHandler: ApiHandler } }, 'DishesScreen'>;

export default function DishesScreen({ route, navigation } : {route : DishesScreenRouteProp}) {
    const { userData } = useContext(AuthContext);
    const { apiHandler } = route.params 
    const userId = userData.id;
    const userDisplayName = userData.userMetadata.displayName
    const [dishes, setDishes] = useState<DishesModel[]>([]);
    const [likesCount, setLikesCount] = useState<{ [key: string]: number }>({});
    const [tagsCount, setTagsCount] = useState({});
    const [refreshing, setRefreshing] = useState(false);

    const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchData = async () => {
        if (!userId) return;

        try {
            setRefreshing(true);
            const data = await getLikedDishesByUser(userId);
            
            setDishes(data);

            const dishLikesCount: { [key: string]: number } = {};
            const dishTagsCount = {};

            for (let dish of data) {
                // dishLikesCount[dish.dishes.id] = await getNumberOfLikesDish(dish.dishes.id);
                dishLikesCount[dish.dishes.id] = (await apiHandler.getData({targetTable: 'likes', conditionsEq: new RequestFilter('dish_id', dish.dishes.id) })).length;
                dishTagsCount[dish.dishes.id] = await getTagsOfDish(dish.dishes.id);
            }

            setLikesCount(dishLikesCount);
            setTagsCount(dishTagsCount);

        } catch (error) {
            console.error('Erreur lors de la récupération des recettes likées :', error.message);
        }  finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const onRefresh = useCallback(() => {
        fetchData();
    }, []);

    const handleDeleteDish = async (table, dishId, userId) => {
        const response = await deleteDishByUser(table, dishId, userId);
        if (response.success) {
            fetchData();
        }
    };

    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('../../../assets/COOKINDER.png')}
                        style={styles.logoImage}
                    />
                </View><Text style={styles.headerDisplayName}>{userDisplayName}, voici tes plats préférés !</Text>
                <Text style={styles.subHeader}>Consulte les plats que tu as enregistrés !</Text>
                <FlatList
                    style={styles.scrollContent}
                    data={[...dishes].reverse()}
                    keyExtractor={(item) => item.dishes.id}
                    renderItem={({ item }) => {
                        const dishId = item.dishes.id;
                        const userDishCreator = item.dishes.username
                        const likesForDish = likesCount[dishId];
                        const tagsForDish = tagsCount[dishId];

                        return (
                            <View style={styles.cardContainer}>
                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() => {
                                        navigation.navigate('DishDetailScreen', {
                                            dishSelected: item,
                                            userData,
                                            tagsForDish,
                                            apiHandler
                                        });
                                    }}
                                >
                                    <View style={styles.card}>
                                        <Image source={{ uri: item.dishes.image_url }} style={styles.image} />
                                        <View style={styles.info}>
                                            <Text style={styles.title}>{item.dishes.title}</Text>
                                            <Text style={styles.info}>Tags : {tagsForDish && tagsForDish.length > 0 ? tagsForDish.join(', ') : 'Aucun tag'}</Text>
                                            <Text style={styles.info}>Liké par : {likesForDish} personnes | {item.dishes.difficulty.title}</Text>
                                            <Text style={styles.info}>Créé par : {userDishCreator}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        setSelectedDishId(dishId);
                                        setModalVisible(true);
                                    }}
                                >
                                    <Icon name="trash" size={20} color="white" />
                                </TouchableOpacity>
                                <ConfirmDeleteModal
                                    visible={modalVisible}
                                    onConfirm={() => {
                                        if (selectedDishId) {
                                            handleDeleteDish("likes", selectedDishId, userData.id);
                                        }
                                        setModalVisible(false);
                                        setSelectedDishId(null);
                                    }}
                                    onCancel={() => {
                                        setModalVisible(false);
                                        setSelectedDishId(null);
                                    }}
                                />
                                </View>
                        );
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
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