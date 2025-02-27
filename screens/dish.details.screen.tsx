import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { getLikedDishesByUser } from '../services/dishesService';

export default function DishDetailScreen({ route }) {
    const dishId = route.params.dishId;
    const userId = route.params.userData.id

    const [dish, setDish] = useState(null);

    useEffect(() => {
        const fetchDishDetails = async () => {
            try {
                const dishes = await getLikedDishesByUser(userId);
                const selectedDish = dishes.find(item => item.dishes.id === dishId);

                setDish(selectedDish ? selectedDish.dishes : null);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du plat:', error);
            }
        };

        fetchDishDetails();
    }, [dishId]);

    if (!dish) return <Text>Chargement...</Text>;

    return (
        <View style={styles.container}>
            <Image source={{ uri: dish.image_url }} style={styles.image} />
            <Text style={styles.title}>{dish.title}</Text>
            <Text style={styles.description}>{dish.description}</Text>
            <Text>Ingrédients : {dish.ingredients}</Text>
            <Text>Instructions : {dish.instructions}</Text>
            <Text>Temps de cuisson : {dish.cooking_time} minutes</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
});
