import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { ApiRefreshAccessToken } from '../../../api/ApiLogin';
import { getUnconfirmedRewards, confirmRedeemedReward } from '../../../api/ApiRewards';
import { SessionContext } from '../../../context/SessionContext';

const RedeemedRewards = () => {
    const [loading, setLoading] = useState(true);
    const [rewards, setRewards] = useState([]);
    const navigation = useNavigation();
    const { session } = useContext(SessionContext);

    const fetchData = async () => {
        try {
            setLoading(true);
            await ApiRefreshAccessToken();
            const response = await getUnconfirmedRewards();
            setRewards(response.rewards || []);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron obtener las recompensas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfirm = async (redeemedRewardId) => {
        try {
            await ApiRefreshAccessToken();
            await confirmRedeemedReward(redeemedRewardId);
            Alert.alert('✅ Confirmado', 'La recompensa fue confirmada.');
            fetchData();
        } catch (error) {
            Alert.alert('Error', 'No se pudo confirmar la recompensa.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.rewardItem}>
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.details}>Niño: {item.kidName}</Text>
                <Text style={styles.details}>Precio: {item.price} monedas</Text>
            </View>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirm(item.redeemedRewardId)}
            >
                <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.backText}>Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Recompensas Canjeadas</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : rewards.length === 0 ? (
                <Text style={styles.noData}>No hay recompensas por confirmar.</Text>
            ) : (
                <FlatList
                    data={rewards}
                    keyExtractor={(item) => item.redeemedRewardId}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 6,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    list: {
        paddingBottom: 20,
    },
    rewardItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#555',
    },
    confirmButton: {
        backgroundColor: '#3E9697',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noData: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        color: '#666',
    },
});

export default RedeemedRewards;
