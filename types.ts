import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  CameraScreen: undefined; // Pas de paramètres
  FormScreen: { photoUri: string }; // Paramètre photoUri
};
