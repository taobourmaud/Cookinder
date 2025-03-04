import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { DishesModel } from "../models/dishes";


export const Card = (dishes: {image: DishesModel}) => {
    const dish = dishes.image
    return (
        <View style={styles.card}>
            <ImageBackground source={{ uri: dish.image_url }} style={styles.image} imageStyle={styles.imageStyle}>
                <View style={styles.difficulty}>
                    {/* TODO Change difficulty value by API data */}
                    <Text style={styles.textDifficulty}>Difficile</Text>
                </View>
                <View style={styles.description}>
                    <Text style={styles.text}>{dish.title}</Text>
                    <Text style={styles.text}>Fait par : {dish.username}</Text>
                    <Text style={styles.text}>Temps de préparation : {dish.cooking_time} min</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',  
    height: "75%",  
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',  
    height: '100%',  
    borderRadius: 200,
  },
  imageStyle: {
    borderRadius: 15,
    overflow: 'hidden',
    opacity: 0.8
  },
  difficulty: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: '30%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#00000094",
    opacity: 1,
    borderRadius: 10
  },
  description: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: '70%',
    height: '20%',
    backgroundColor: "#00000094",
    opacity: 0.85,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  textDifficulty: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 1
  },
  text: {
    color: 'white',
    fontSize: 16,
    opacity: 1,
    marginLeft: 4,
    fontWeight: 'bold'
  },
});