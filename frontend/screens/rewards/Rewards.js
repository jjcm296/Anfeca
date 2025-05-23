import React, { useContext, useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable,
    Alert
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import RewardCard from './compoonents/RewardCard';
import AddButton from '../ui/components/AddButton';
import { ApiRefreshAccessToken } from "../../api/ApiLogin";
import { getAllRewards, redeemReward } from "../../api/ApiRewards";
import SkeletonRewardCard from './compoonents/skeletons/SkeletonsRewardCard';
import { SessionContext } from "../../context/SessionContext";
import { Ionicons } from "@expo/vector-icons";
import {CoinUpdateContext} from "../../context/CoinUpdateContext";

const Rewards = () => {
    const navigation = useNavigation();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { session } = useContext(SessionContext);

    const { triggerRefresh } = useContext(CoinUpdateContext);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            await ApiRefreshAccessToken();
            const response = await getAllRewards();
            setRewards(Array.isArray(response.rewardsArray) ? response.rewardsArray : []);
        } catch {
            Alert.alert("Error", "No se pudieron cargar las recompensas.");
        } finally {
            setHasLoaded(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const loadRewards = async () => {
                try {
                    await ApiRefreshAccessToken();
                    const response = await getAllRewards();
                    console.log("recompensas: ", response);
                    if (isActive) {
                        setRewards(Array.isArray(response.rewardsArray) ? response.rewardsArray : []);
                    }
                } catch {
                    if (isActive) {
                        Alert.alert("Error", "No se pudieron actualizar las recompensas.");
                    }
                } finally {
                    if (isActive) setLoading(false);
                }
            };

            setLoading(true);
            loadRewards();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleConfirmRedeem = async () => {
        if (!selectedReward) return;

        if (session.kid?.coins < selectedReward.price) {
            Alert.alert("¡Ups!", "No tienes suficientes monedas para canjear esta recompensa.");
            return;
        }

        try {
            await ApiRefreshAccessToken();
            const response = await redeemReward(selectedReward._id);

            if (response?.redeemedReward) {
                Alert.alert("Éxito", "La recompensa fue canjeada");
                triggerRefresh();
                setModalVisible(false);
                fetchRewards();
            } else {
                throw new Error("Respuesta inesperada del servidor");
            }
        } catch (error) {
            Alert.alert("Error", error?.error || "No se pudo canjear la recompensa");
            setModalVisible(false);
        }
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            {session.profileType === 'guardian' && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('RedeemedRewards')}
                    style={styles.linkToRedeemed}
                >
                    <Ionicons name="gift-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.linkText}>recompensas canjeadas</Text>
                </TouchableOpacity>
            )}

            {loading && !hasLoaded ? (
                <View style={styles.list}>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <SkeletonRewardCard key={index} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={rewards.filter(item => item.active)}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <RewardCard
                            _id={item._id}
                            name={item.name}
                            coins={item.price}
                            type={item.type}
                            redemptionLimit={item.redemptionLimit ?? 0}
                            redemptionCount={item.redemptionCount ?? 0}
                            onDeleted={(deletedId) =>
                                setRewards(prev => prev.filter(r => r._id !== deletedId))
                            }
                            onRedeem={() => {
                                setSelectedReward(item);
                                setModalVisible(true);
                            }}
                        />

                    )}
                    contentContainerStyle={styles.list}
                />
            )}

            {session.profileType === 'guardian' && (
                <AddButton onPress={() => navigation.navigate('AddReward')} />
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>¿Canjear esta recompensa?</Text>
                        <Text style={styles.modalName}>{selectedReward?.name || ''}</Text>
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.btn} onPress={handleConfirmRedeem}>
                                <Text style={styles.btnText}>Sí</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.btn, { backgroundColor: '#ccc' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.btnText, { color: '#333' }]}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    linkToRedeemed: {
        marginBottom: 15,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: 20,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalName: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    btn: {
        backgroundColor: '#3E9697',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Rewards;
