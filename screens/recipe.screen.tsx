import {StyleSheet, Text, View, Button, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import { getLikedRecipes } from '../services/recipeService';
import {AuthContext} from "../authContext";

export default function RecipeScreen() {

    const { userId } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        console.log('userId:', userId);
        if (userId) {
            try {
                const fetchLikedRecipes = async () => {
                    const data = await getLikedRecipes(userId);
                    console.log(data);
                    setRecipes(data);
                };
                fetchLikedRecipes();
            } catch (error) {
                console.error('Erreur lors de la récupération des recettes likées :', error.message);
            }
        } else {
            console.log('userId is not available');
        }
    }, [userId])

    return (
        <View>
            <Text>Liked Recipes</Text>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.dishes.title}</Text>
                        <Text>{item.dishes.description}</Text>
                        <Text>{item.dishes.created_at}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
