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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: "#fff",
  },
});