import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NavBar from './tabNavigator/NavBar'; // Importamos la barra

export default function App() {
  return (
      <View style={styles.container}>
        <StatusBar style="auto" />

        {/* Barra de navegación */}
        <NavBar />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
