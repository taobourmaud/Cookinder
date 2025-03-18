import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import difficulty from '../../_utils/interface/difficultyLevel';
import { DishesModel } from '../../_utils/models/dishes';

type DishDetailNavigationProp = StackNavigationProp<RootStackParamList, 'DishDetailScreen'>;
type DishDetailScreenRouteProp = RouteProp<{ DishDetailScreen: { userData: object, tagsForDish: object[], dishSelected: object } }, 'DishDetailScreen'>;

export default function DishDetailScreen({ route, navigation }: { route: DishDetailScreenRouteProp, navigation: DishDetailNavigationProp }) {
    const { tagsForDish, dishSelected } = route.params;
    const [dish, setDish] = useState<DishesModel | null>(null);

    useEffect(() => {
        const fetchDishDetails = async () => {
            try {
                const selectedDish = dishSelected.dishes
                setDish(selectedDish);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du plat:', error);
            }
        };

        fetchDishDetails();
    }, []);

    if (!dish) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff8c00" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

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
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: dish.image_url }} style={styles.image} />
                <Text style={styles.title}>{dish.title}</Text>
                <Text style={styles.difficulty}>{difficulty[dish.difficulty] || dish.difficulty?.title}</Text>
                {tagsForDish && tagsForDish.length > 0 ? (
                    <View style={styles.tagsContainer}>
                        {tagsForDish.map((tag, index) => (
                            <Text key={index} style={styles.tag}>
                                {tag}
                            </Text>
                        ))}
                    </View>
                ) : (
                    <Text ></Text>
                )}
                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Ionicons name="people" size={20} color="black" />
                        <Text style={styles.infoText}>{dish.number_persons} personnes</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="time" size={20} color="black" />
                        <Text style={styles.infoText}>{dish.cooking_time} min</Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Liste des ingrédients</Text>
                {dish.ingredients ? (
                    dish.ingredients.map((ingredient, index) => (
                        <Text key={index} style={styles.placeholder}>{ingredient}</Text>
                    ))
                ) : (
                    <Text></Text>
                )}

                <Text style={styles.sectionTitle}>Liste des instructions</Text>
                {dish.instructions ? (
                    dish.instructions.map((instruction, index) => (
                        <Text key={index} style={styles.placeholder}>{instruction}</Text>
                    ))
                ) : (
                    <Text></Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        fontStyle: 'italic',
    },
    container: {
        flex: 1,
        backgroundColor: '#f9f9fc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: 30,
    },
    logoImage: {
        width: 120,
        height: 40,
        resizeMode: 'contain',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    image: {
        height: 200,
        margin: 20,
        marginTop: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        marginHorizontal: 20,
        textAlign: 'left',
        fontStyle: 'italic',
    },
    difficulty: {
        alignSelf: 'flex-start',
        marginHorizontal: 20,
        backgroundColor: '#e6e6fa',
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 10,
        color: '#ff8c00',
        fontWeight: 'bold',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginVertical: 5,
        marginLeft: 10
    },
    tag: {
        backgroundColor: '#e6e6fa',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: 20,
    },
    infoText: {
        marginLeft: 5,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontStyle: 'italic',
        fontSize: 20,
        marginTop: 15,
        marginLeft: 20,
        marginBottom: 5
    },
    placeholder: {
        backgroundColor: '#e6e6fa',
        marginHorizontal: 20,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        minHeight: 30,
        color: '#333',
    },
});
