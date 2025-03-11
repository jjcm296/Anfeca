import React from 'react';
import { View, StyleSheet, StatusBar, FlatList } from 'react-native';
import CoinsDisplay from './components/CoinsDisplay'; // Importar monedas
import StreakDisplay from './components/StreakDisplay'; // Importar racha
import QuestionBankCard from "./components/QuestionBankCard"; // Importar tarjetas de preguntas

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

const Home = () => {
    return (
        <View style={styles.container}>
            {/* Contenedor superior para monedas y racha */}
            <View style={styles.topBar}>
                <CoinsDisplay coins={100} />  {/* Monedas a la izquierda */}
                <StreakDisplay streak={5} />  {/* Racha a la derecha */}
            </View>

            {/* Lista de tarjetas con separación */}
            <FlatList
                data={questionBanks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <QuestionBankCard category={item.category} questions={item.questions} />
                )}
                contentContainerStyle={styles.listContainer}
                ItemSeparatorComponent={() => <View style={styles.separator} />} // Espacio entre tarjetas
                showsVerticalScrollIndicator={false} // Oculta la barra de desplazamiento
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Se ajusta a la pantalla
    },
    topBar: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: StatusBar.currentHeight || 10, // Ajuste para la barra de estado sin que se desborde
        shadowOffset: { width: 0, height: 2 },
    },
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        paddingBottom: 80, // Espacio extra para la última tarjeta
    },
    separator: {
        height: 10, // Espacio entre cada tarjeta
    },
});

export default Home;
