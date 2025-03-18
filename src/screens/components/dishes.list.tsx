import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { DishesModel } from '../../_utils/models/dishes';
import Icon from "react-native-vector-icons/FontAwesome";
import React, {useEffect, useState} from "react";
import ConfirmDeleteModal from "../../_utils/components/confirmDeleteModal";
import {deleteDishByUser} from "../../../services/dishesService";


interface UserDishesListInterface {
    navigation: any;
    dishes: DishesModel[];
    userData: any;
    likesCount: {
        [key: string]: number;
    };
    tagsCount: {
        [key: string]: string[];
    };
    isLikedList?: boolean;
}

const DishesList = ({ navigation, dishes, userData, likesCount, tagsCount, isLikedList}: UserDishesListInterface) => {

    const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [dishesList, setDishesList] = useState<DishesModel[]>([]);

    useEffect(() => {
        setDishesList(dishes);
    }, [dishes]);

    return (
        <FlatList
            data={dishesList}
            keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
            renderItem={({ item }) => {
                const dishId = item.dishes.id;
                const likesForDish = dishId ? likesCount[dishId] : 0;
                const tagsForDish = dishId ? tagsCount[dishId] : 0;

                return (
                    <View style={styles.cardContainer}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => {
                              navigation.navigate('DishDetailScreen', {
                                dishSelected: item,
                                userData,
                                tagsForDish,
                                dishesCreated: !isLikedList
                              });
                            }}
                        >
                            <View style={styles.card}>
                                <Image source={{ uri: item.dishes.image_url }} style={styles.image} />
                                 <View style={styles.info}>
                                    <Text style={styles.title}>{item.dishes.title}</Text>
                                    <Text style={styles.info}>Tags : {tagsForDish && tagsForDish.length > 0 ? tagsForDish.join(', ') : 'Aucun tag'}</Text>
                                     <Text style={styles.info}>{isLikedList ? `Liké par : ${likesForDish} personnes | ${item.dishes.difficulty.title}` : `Liké par : ${likesForDish} personnes | ${item.dishes.difficulty}` }</Text>
                                    <Text style={styles.info}>{isLikedList ? `Crée par ${item.dishes.username}` : "Créé par vous"}  </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => {
                                setSelectedDishId(item.dishes.id);
                                setModalVisible(true);
                            }}
                        >
                            <Icon name="trash" size={20} color="white" />
                        </TouchableOpacity>
                        <ConfirmDeleteModal
                            visible={modalVisible}
                            onConfirm={async () => {
                              if (selectedDishId) {
                                try {
                                  if (!isLikedList) {
                                    await deleteDishByUser("dishes", selectedDishId, userData.id);
                                  } else {
                                    await deleteDishByUser("likes", selectedDishId, userData.id);
                                  }
                                  setDishesList(prevDishesList => prevDishesList.filter(dish => dish.dishes.id !== selectedDishId));
                                } catch (error) {
                                  console.error("Erreur lors de la suppression :", error);
                                }
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
        />
    );
};

const styles = StyleSheet.create({
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
        padding: 10,
        borderRadius: 15
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
    },
    deleteButton: {
        backgroundColor: '#E57373',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        marginRight: 10
    },
});

export default DishesList;