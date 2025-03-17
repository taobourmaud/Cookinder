import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { DishesModel } from '../../_utils/models/dishes';


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

    return (
        <FlatList
            data={dishes}
            keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
            renderItem={({ item }) => {
                const dishId = item.id;
                const likesForDish = dishId ? likesCount[dishId] : 0;
                const tagsForDish = dishId ? tagsCount[dishId] : 0;

                return (
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
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.info}>Tags : {tagsForDish && tagsForDish.length > 0 ? tagsForDish.join(', ') : 'Aucun tag'}</Text>
                                <Text style={styles.info}>Liké par : {likesForDish} personnes | {item.difficulty}</Text>
                                <Text style={styles.info}>Créé par : {userDishCreated}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#f0f0ff',
        padding: 5,
        marginBottom: 10,
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
    }
});

export default DishesList;