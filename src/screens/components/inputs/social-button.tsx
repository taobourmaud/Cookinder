import { TouchableOpacity, Image, Text, StyleSheet } from "react-native"

interface SocialButtonProps {
    onPress: () => void;
    backgroundColor: string;
    color: string;
    sourceImg: any;
    title: string;
    isGoogle?: boolean;
}

const SocialButton = ({ onPress, backgroundColor, color, sourceImg, title, isGoogle } : SocialButtonProps) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            style={[
                styles.socialButton,
                { backgroundColor: backgroundColor },
                isGoogle ? { borderColor: '#000000', borderWidth: 0.5 } : null,
            ]}
        >
            <Image
            source={sourceImg}
            style={styles.socialIcon}
            />
            <Text style={[styles.socialButtonText, { color: color }]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
    },
    socialIcon: {
        marginRight: 10,
    },
    socialButtonText: {
        color: '#333333',
        fontSize: 16,
        fontFamily: 'Montserrat',
    },
})

export default SocialButton;