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
import RedeemedRewardCard from '../compoonents/RedeemedRewardCard';

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
            setRewards(response.redeemedRewards || []);
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
        <RedeemedRewardCard
            rewardName={item.rewardName}
            redeemDate={item.redeemDate}
            onConfirm={() => handleConfirm(item._id)}
        />
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
                    data={rewards.filter(r => r.confirm === false)}
                    keyExtractor={(item) => item.redeemedRewardId || item._id}
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
        marginBottom: 5,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 4,
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
    noData: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        color: '#666',
    },
});

export default RedeemedRewards;
