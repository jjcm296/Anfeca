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
import RewardCard from './compoonents/RewardCard';
import AddButton from '../ui/components/AddButton';
import { ApiRefreshAccessToken } from "../../api/ApiLogin";
import { getAllRewards, redeemReward } from "../../api/ApiRewards";
import SkeletonRewardCard from './compoonents/skeletons/SkeletonsRewardCard';
import { SessionContext } from "../../context/SessionContext";

const Rewards = () => {
    const navigation = useNavigation();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { session } = useContext(SessionContext);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            await ApiRefreshAccessToken();
            const response = await getAllRewards();
            setRewards(response.rewardsArray);
            setHasLoaded(true);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rewards:", error);
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
                    if (isActive) {
                        setRewards(response.rewardsArray);
                        setHasLoaded(true);
                        setLoading(false);
                    }
                } catch (error) {
                    if (isActive) {
                        console.error("Error fetching rewards:", error);
                        setLoading(false);
                    }
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
        try {
            await ApiRefreshAccessToken();
            await redeemReward(selectedReward._id);
            Alert.alert("Éxito", "La recompensa fue canjeada");
            setModalVisible(false);
        } catch (error) {
            console.error("Error al canjear:", error);
            Alert.alert("Error", error.error || "No se pudo canjear la recompensa");
        }
    };


    return (
        <View style={styles.container}>
            {session.profileType === 'guardian' && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('RedeemedRewards')}
                    style={{ marginBottom: 15, alignSelf: 'flex-end' }}
                >
                    <Text style={{ color: '#6200EE', fontWeight: 'bold' }}>
                        Ver recompensas canjeadas
                    </Text>
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
                    data={rewards}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        const content = (
                            <RewardCard
                                name={item.name}
                                coins={item.price}
                                type={item.type}
                                redemptionLimit={item.redemptionLimit ?? 0}
                                redemptionCount={item.redemptionCount ?? 0}
                            />
                        );

                        if (session.profileType === 'guardian') {
                            return (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("EditReward", { rewardId: item._id })}
                                >
                                    {content}
                                </TouchableOpacity>
                            );
                        } else if (session.profileType === 'kid') {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedReward(item);
                                        setModalVisible(true);
                                    }}
                                >
                                    {content}
                                </TouchableOpacity>
                            );
                        } else {
                            return <View>{content}</View>;
                        }
                    }}
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
                        <Text style={styles.modalName}>{selectedReward?.name}</Text>
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.btn} onPress={handleConfirmRedeem}>
                                <Text style={styles.btnText}>Sí</Text>
                            </Pressable>
                            <Pressable style={[styles.btn, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.btnText, { color: '#333' }]}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
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
        backgroundColor: '#6200EE',
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
