import { View, Image, StyleSheet } from "react-native";
import { DishesModel } from "../models/dishes";


export const Card = (dishes: {image: DishesModel}) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: dishes.image.image_url }} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#e8e8e8',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#fff",
    },
    image: {
      width: '70%',
      height: '70%',
      borderRadius: 10,
    },
  });