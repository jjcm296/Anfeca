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
import CoinIcon from '../../ui/components/CoinIcon';
import { useNavigation } from '@react-navigation/native';
import { deleteReward } from '../../../api/ApiRewards';
import { ApiRefreshAccessToken } from '../../../api/ApiLogin';
import { SessionContext } from '../../../context/SessionContext';

const RewardCard = ({
                        _id,
                        name,
                        coins,
                        type,
                        redemptionLimit = 0,
                        redemptionCount = 0,
                        onDeleted,
                        onRedeem
                    }) => {
    const navigation = useNavigation();
    const { session } = useContext(SessionContext);
    const [modalVisible, setModalVisible] = useState(false);

    const expirationText =
        type === 'forever'
            ? '∞ ilimitado'
            : type === 'once'
                ? '1 vez'
                : `${Math.max(0, redemptionLimit - redemptionCount)} canjes restantes`;


    const handleEdit = () => {
        setModalVisible(false);
        navigation.navigate('EditReward', { rewardId: _id });
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar recompensa',
            '¿Estás seguro de que deseas eliminar esta recompensa?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiRefreshAccessToken();
                            await deleteReward(_id);
                            if (onDeleted) onDeleted(_id);
                            Alert.alert('Eliminado', 'La recompensa fue eliminada correctamente.');
                        } catch {
                            Alert.alert('Error', 'No se pudo eliminar la recompensa.');
                        } finally {
                            setModalVisible(false);
                        }
                    },
                },
            ]
        );
    };

    const CardContent = () => (
        <View style={styles.card}>
            <View style={styles.leftContainer}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.expirationBox}>
                    <Text style={styles.expirationText}>{expirationText}</Text>
                </View>
            </View>

            <View style={styles.coinContainer}>
                <CoinIcon size={24} />
                <Text style={styles.coinText}>{coins}</Text>
            </View>

            {session.profileType === 'guardian' && (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="menu" size={24} color="#555" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <>
            {session.profileType === 'kid' ? (
                <TouchableOpacity onPress={onRedeem}>
                    <CardContent />
                </TouchableOpacity>
            ) : (
                <CardContent />
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
                            <Text style={styles.modalText}>Editar recompensa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color="#FF4E4E" />
                            <Text style={styles.modalText}>Eliminar recompensa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close-circle-outline" size={24} color="#888" />
                            <Text style={styles.modalText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 5,
        padding: 10,
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderWidth: 1.5,
        borderColor: '#2f5c98',
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    name: {
        fontSize: 19,
        fontWeight: '500',
        color: '#000',
    },
    expirationBox: {
        backgroundColor: '#000000',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    expirationText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
        marginRight: 10,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 5,
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

export default RewardCard;
