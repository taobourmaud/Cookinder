import React, {useContext} from 'react';
import { StyleSheet, Image, Text, View, Button, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../../authContext';
import Swiper from 'react-native-deck-swiper';


export default function HomeScreen() {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { signOut } = auth;

  const images = [
    { id: 1, uri: 'https://picsum.photos/536/354' },
    { id: 2, uri: 'https://picsum.photos/id/237/536/354' },
    { id: 3, uri: 'https://picsum.photos/seed/picsum/200/300' },
  ];

  const filtersValue = [
    { id : 1, value: "Petit-déjeuner"},
    { id: 2, value: "Plats" },
    { id: 3, value: "Végétarien" },
    { id: 4, value: "Poulet" },
    { id: 5, value: "Viande" },
    { id: 6, value: "10'" }
  ]

  const Card = ({ image }: { image: { id: number; uri: string } }) => (
    <View style={styles.card}>
      <Image source={{ uri: image.uri }} style={styles.image} />
    </View>
  );

  const onLeftSwipe = () => {
    console.log("Hello World")
  }

  const onRightSwipe = () => {
    console.log("Hello Sir")
  }

  const onPressFilter = (index: number) => {
    console.log(index)
  }

  return (
    <View style={styles.screen}>
      <View>
        <Text>Bonjour Username !</Text>
        <Text>Cherche des inspirations pour tes prochaines recettes !</Text>
      </View>
      <View style={styles.filterView}>
        {filtersValue.map((data) => {
          return (
              <TouchableOpacity key={data.id} style={styles.filterButton} onPress={() => onPressFilter(data.id)}>
                <Text style={styles.filterText}>{data.value}</Text>
              </TouchableOpacity>
          )
        })}
      </View>
      <View style={styles.container}>
        <Swiper
          cards={images}
          renderCard={(card) => <Card image={card} />}
          onSwipedRight={(cardIndex) => { onRightSwipe() }}
          onSwipedLeft={(cardIndex) => { onLeftSwipe() }}
          cardIndex={0}
          backgroundColor={'#f0f0f0'}
          stackSize={3}
          // cardStyle={{
            
          // }}
        />
    </View>
    </View>

  );
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff'
  },
  filterView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  filterButton: {
    backgroundColor: '#F4F5FF94',
    width: '30%',
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 8
  },
  filterText: {
    color: "#000000",
    fontSize: 16
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,    
    backgroundColor: "#fff",
  },
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
    width: '60%',
    height: '60%',
    borderRadius: 10,
  },
});