import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { DishesModel } from '../../_utils/models/dishes';
import Icon from "react-native-vector-icons/FontAwesome";
import React, {useCallback, useEffect, useState} from "react";
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
    userDishCreated: string;

}

const DishesList = ({ navigation, dishes, userData, likesCount, tagsCount, userDishCreated}: UserDishesListInterface) => {

    const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [dishesList, setDishesList] = useState<DishesModel[]>([]);

    useEffect(() => {
        setDishesList(dishes);
    }, [dishes]);

    const refreshDishesList = (deletedDishId: string) => {
        setDishesList(prevDishesList => prevDishesList.filter(dish => dish.id !== deletedDishId));
    };

    return (
        <FlatList
            data={dishesList}
            keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
            renderItem={({ item }) => {
                const dishId = item.id;
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
                                dishesCreated: true
                              });
                            }}
                        >
                            <View style={styles.card}>
                                <Image source={{ uri: item.image_url }} style={styles.image} />
                                 <View style={styles.info}>
                                    <Text style={styles.title}>{item.dishes.title}</Text>
                                    <Text style={styles.info}>Tags : {tagsForDish && tagsForDish.length > 0 ? tagsForDish.join(', ') : 'Aucun tag'}</Text>
                                    <Text style={styles.info}>Liké par : {likesForDish} personnes | {item.difficulty}</Text>
                                    <Text style={styles.info}>Créé par vous</Text>
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
                            onConfirm={() => {
                                if (selectedDishId) {
                                    deleteDishByUser("dishes", selectedDishId, userData.id);
                                    refreshDishesList(selectedDishId);
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
        padding: 5,
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
});

export default DishesList;