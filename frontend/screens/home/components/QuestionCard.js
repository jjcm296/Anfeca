import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { deleteQuestion } from '../../../api/ApiQuestions';
import { ApiRefreshAccessToken } from '../../../api/ApiLogin';
import { SessionContext } from '../../../context/SessionContext';


const QuestionCard = ({ questionNumber, questionText, questionId, bankId, bankName, onDelete }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const { session } = useContext(SessionContext);

    const handleEdit = () => {
        setModalVisible(false);
        navigation.navigate("EditQuestion", {
            questionId,
            bankId,
            name: bankName,
        });
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar pregunta',
            '¿Estás seguro de que deseas eliminar esta pregunta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiRefreshAccessToken();
                            await deleteQuestion(bankId, questionId);
                            Alert.alert('Eliminado', 'La pregunta fue eliminada correctamente.');
                            onDelete?.();

                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la pregunta.');
                        } finally {
                            setModalVisible(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.questionNumber}>Pregunta {questionNumber}</Text>
                <Text style={styles.questionText}>{questionText}</Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="menu" size={24} color="#555" />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.modalButton} onPress={handleEdit}>
                            <Ionicons name="create-outline" size={24} color="#3E9697" />
                            <Text style={styles.modalText}>Editar pregunta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color="#FF4E4E" />
                            <Text style={styles.modalText}>Eliminar pregunta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close-circle-outline" size={24} color="#888" />
                            <Text style={styles.modalText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    questionText: {
        fontSize: 14,
        color: '#000000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 8,
        width: '100%',
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#333',
    },
});

export default QuestionCard;
