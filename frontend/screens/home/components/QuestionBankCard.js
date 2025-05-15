import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { deleteBank } from '../../../api/ApiBank';

const QuestionBankCard = ({
                              category,
                              questions,
                              profileType,
                              bankId,
                              bankName,
                              onBankDeleted,
                          }) => {
    const navigation = useNavigation();
    const isKid = profileType === 'kid';
    const isGuardian = profileType === 'guardian';

    const [modalVisible, setModalVisible] = useState(false);
    const [studyCompleted, setStudyCompleted] = useState(false);

    const handleStudy = () => {
        navigation.navigate('FlashCardGame', {
            bankId,
            bankName,
            onStudyComplete: () => setStudyCompleted(true),
        });
    };

    const handlePlayGame = () => {
        navigation.navigate('RunnerGame', {
            bankId,
            bankName,
            onGameFinished: () => {
                console.log("Minijuego terminado, resultados enviados");
            },
        });
    };

    const handleGuardianMenu = () => {
        setModalVisible(true);
    };

    const handleEdit = () => {
        setModalVisible(false);
        navigation.navigate('EditQuestionBank', { bankId });
    };

    const handleDelete = async () => {
        try {
            await deleteBank(bankId);
            Alert.alert('Eliminado', 'El banco ha sido eliminado correctamente.');
            if (onBankDeleted) onBankDeleted(bankId);
        } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el banco.');
        } finally {
            setModalVisible(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.categoryText} numberOfLines={1}>{category}</Text>

                {isKid && (
                    <View style={styles.priceContainer}>
                        <Image source={require('../../../images/Coins_bueno.png')} style={styles.coinImage} />
                        <Text style={styles.priceText}>1</Text>
                    </View>
                )}

                {isGuardian && (
                    <TouchableOpacity onPress={handleGuardianMenu}>
                        <Ionicons name="menu" size={26} color="#555" />
                    </TouchableOpacity>
                )}
            </View>

            {isKid && (
                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={[styles.button, !studyCompleted ? styles.active : styles.disabled]}
                        disabled={studyCompleted}
                        onPress={handleStudy}
                    >
                        <Ionicons name={!studyCompleted ? 'book' : 'lock-closed'} size={26} color="white" />
                        <Text style={styles.buttonText}>Estudiar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, studyCompleted ? styles.active : styles.disabled]}
                        disabled={!studyCompleted}
                        onPress={handlePlayGame}
                    >
                        <Ionicons name={studyCompleted ? 'game-controller' : 'lock-closed'} size={26} color="white" />
                        <Text style={styles.buttonText}>Minijuego</Text>
                    </TouchableOpacity>
                </View>
            )}

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
                            <Text style={styles.modalText}>Editar banco</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color="#FF4E4E" />
                            <Text style={styles.modalText}>Eliminar banco</Text>
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
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginVertical: 5,
        marginHorizontal: 15,
        minHeight: 160,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinImage: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    priceText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#555',
        marginLeft: 6,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        flex: 0.48,
        justifyContent: 'center',
    },
    active: {
        backgroundColor: '#3E9697',
    },
    disabled: {
        backgroundColor: '#BDBDBD',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'bold',
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

export default QuestionBankCard;
