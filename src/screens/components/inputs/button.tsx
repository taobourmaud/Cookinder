import { TouchableOpacity, View, Text, StyleSheet} from "react-native"

interface ButtonProps {
    onPress: () => void;
    title: string;
    color?: string;
}

const Button = ({onPress, title, color}: ButtonProps) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
                style={[styles.button, color ? { backgroundColor: color } : {}]}
                onPress={onPress}
            >
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
      },
      button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonText: {
        color: '#FFFFFF', 
        fontSize: 16,
        width: 250,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
      },
})


export default Button;