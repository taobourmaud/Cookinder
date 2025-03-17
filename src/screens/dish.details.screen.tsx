import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DishesModel } from '../_utils/models/dishes';

export default function DishDetailScreen({ route, navigation }) {
    const { dishId, dishSelected, userData, tagsForDish } = route.params;

    const userId = route.params.userData.id
    const [dish, setDish] = useState<DishesModel>();
    const [loading, setLoading] = useState(true);

    const fetchDishDetails = async () => {
        setLoading(true);
        try {
            const dish = dishSelected.dishes
            setDish(dish);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du plat:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDishDetails();
    }, [dishId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff8c00" />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    if (!dish) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Recette non trouvée.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Image
                    source={require('../../assets/COOKINDER.png')}
                    style={styles.logoImage}
                />
            </View>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: dish.image_url }} style={styles.image} />
                <Text style={styles.title}>{dish.title}</Text>
                <Text style={styles.difficulty}>
                    {typeof dish.difficulty === 'object' 
                        ? dish.difficulty?.title 
                        : dish.difficulty === 1 
                        ? 'Facile' 
                        : dish.difficulty === 2 
                            ? 'Moyen' 
                            : dish.difficulty === 3 
                            ? 'Difficile' 
                            : ''}
                </Text>
                {/* 
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
                )} */}
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
        </SafeAreaView>
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
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
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
        color: '#EBB502',
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