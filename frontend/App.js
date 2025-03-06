import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import {AppStyles} from "./AppStyles";

export default function App() {
  return (
    <View style={AppStyles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
