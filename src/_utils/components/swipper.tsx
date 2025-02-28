import { View, StyleSheet } from "react-native"
import Swiper from "react-native-deck-swiper"
import { Card } from "./card"
import { DishesModel } from "../models/dishes"
import ApiHandler from "../api/apiHandler"
import { LikesModel } from "../models/likes"

export const MySwipper = ({dishes, apiHandler} : {dishes: DishesModel[], apiHandler: ApiHandler}) => {
    const onLeftSwipe = (cardIndex: number) => {
        console.log(`Refused dished n° ${cardIndex}`)
      }
    
    const onRightSwipe = async (cardIndex: number) => {
        try {
            const user = await apiHandler.getUser()
            const newLikesData = new LikesModel(user.id, dishes[cardIndex].id)
            await apiHandler.postData('likes', newLikesData)
        } catch (error: Error | any) {
            console.error(error.message)
        }
    }

    return (
        <View style={styles.container}>
            <Swiper
                cards={dishes}
                renderCard={(card) => <Card image={card} />}
                onSwipedRight={(cardIndex) => { onRightSwipe(cardIndex) }}
                onSwipedLeft={(cardIndex) => { onLeftSwipe(cardIndex) }}
                cardIndex={0}
                backgroundColor={'#f0f0f0'}
                stackSize={3}
            />
        </View>
    )

}

const styles = StyleSheet.create({
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