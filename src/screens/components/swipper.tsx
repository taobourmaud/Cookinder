import { View, StyleSheet, Text } from "react-native"
import Swiper from "react-native-deck-swiper"
import { Card } from "./card"
import { DishesModel } from "../../_utils/models/dishes"
import ApiHandler from "../../_utils/api/apiHandler"
import { LikesModel } from "../../_utils/models/likes"

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
                disableBottomSwipe={true}
                disableTopSwipe={true}
                onSwipedRight={(cardIndex) => { onRightSwipe(cardIndex) }}
                onSwipedLeft={(cardIndex) => { onLeftSwipe(cardIndex) }}
                cardIndex={0}
                backgroundColor={'#f0f0f0'}
                stackSize={3}
                overlayLabels={{
                    left: {
                      title: '👎🏻',
                      style: {
                        label: {
                          backgroundColor: 'rgba(236, 32, 15, 0.6)',
                          color: 'white',
                          fontSize: 24,
                        },
                        wrapper: {
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'flex-start',
                          marginTop: 45,
                          marginLeft: -20,
                        },
                      },
                    },
                    right: {
                      title: '🤍',
                      style: {
                        label: {
                          backgroundColor: 'rgba(7, 217, 10, 0.6)',
                          color: 'white',
                          fontSize: 24,
                        },
                        wrapper: {
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          marginTop: 45,
                          marginLeft: 20,
                        },
                      },
                    },
                  }}
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
  }
});