import React from 'react';
import { View, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CoinsDisplay from '../stats/CoinsDisplay'; // Monedas
import StreakDisplay from '../stats/StreakDisplay'; // Racha
import QuestionBankCard from "./components/QuestionBankCard"; // Tarjetas
import Questions from './screens/questions/Questions'; // Pantalla de preguntas

const Stack = createStackNavigator();

const questionBanks = [
    { id: '1', category: 'Matemáticas', questions: 5 },
    { id: '2', category: 'Ciencias', questions: 8 },
    { id: '3', category: 'Historia', questions: 10 },
    { id: '4', category: 'Geografía', questions: 6 },
    { id: '5', category: 'Deportes', questions: 3 },
    { id: '6', category: 'Arte', questions: 7 },
    { id: '7', category: 'Entretenimiento', questions: 4 },
    { id: '8', category: 'Tecnología', questions: 9 },
];

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Contenedor superior para monedas y racha */}
            <View style={styles.topBar}>
                <CoinsDisplay coins={100} />
                <StreakDisplay streak={5} />
            </View>

            {/* Lista de tarjetas con navegación al presionarlas */}
            <FlatList
                data={questionBanks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Questions', { category: item.category, questions: item.questions })}>
                        <QuestionBankCard category={item.category} questions={item.questions} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// Home manejará su navegación interna con Stack.Navigator
const Home = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Questions" component={Questions} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: StatusBar.currentHeight || 10,
        shadowOffset: { width: 0, height: 2 },
    },
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        paddingBottom: 80,
    },
    separator: {
        height: 5,
    },
});

export default Home;
