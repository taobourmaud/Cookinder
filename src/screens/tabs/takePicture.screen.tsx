import { CameraView, Camera } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";

export default function CameraFunction() {
  const [cameraPermission, setCameraPermission] = useState();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState();
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState();
  let cameraRef = useRef();
  const navigation = useNavigation();

  // Demande des permissions au chargement de la page
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setCameraPermission(cameraPermission.status === "granted");
      setMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  // Gestion des permissions
  if (
    cameraPermission === undefined ||
    mediaLibraryPermission === undefined
  ) {
    return <Text style={styles.message}>Demande de permissions en cours...</Text>;
  } else if (!cameraPermission) {
    return (
      <Text style={styles.message}>
        Permission pour la caméra non accordée. Veuillez modifier cela dans les paramètres.
      </Text>
    );
  }

  // Fonction pour basculer entre caméra avant et arrière
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Fonction pour prendre une photo
  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    console.log("Photo prise :", newPhoto.uri);
    setPhoto(newPhoto);
  };

  // Affichage de la photo après capture avec options de sauvegarde ou de suppression
  if (photo) {
    let savePhoto = () => {
      navigation.navigate("PhotoForm", { imageUri: photo.uri });
    };

    return (
      <SafeAreaView style={styles.imageContainer}>
        <Image style={styles.preview} source={{ uri: photo.uri }} />
        <View style={styles.btnContainer}>
          {mediaLibraryPermission ? (
            <TouchableOpacity style={styles.btn} onPress={savePhoto}>
              <Ionicons name="checkmark-circle-outline" size={50} color="#4CAF50" />
              <Text style={styles.btnText}>Utiliser</Text>
            </TouchableOpacity>
          ) : undefined}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setPhoto(undefined)}
          >
            <Ionicons name="close-circle-outline" size={50} color="#F44336" />
            <Text style={styles.btnText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Interface de la caméra simplifiée
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.controlsContainer}>
          <View style={styles.spacer} />
          
          <View style={styles.shutterContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePic}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.flipContainer}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  spacer: {
    width: 60,
  },
  shutterContainer: {
    flex: 1,
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  flipContainer: {
    width: 60,
    alignItems: "center",
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  btn: {
    alignItems: "center",
  },
  btnText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
  },
});