import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import CoinIcon from '../../ui/components/CoinIcon';
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';
import RedemptionOptionButton from '../../ui/components/RedemptionOptionButton';
import { ApiEditReward, getRewardById } from "../../../api/ApiRewards";
import { ApiRefreshAccessToken } from "../../../api/ApiLogin";

const { height } = Dimensions.get('window');

const EditReward = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { rewardId } = route.params || {};

    const [name, setName] = useState('');
    const [coins, setCoins] = useState('');
    const [redemptions, setRedemptions] = useState('');
    const [redemptionType, setRedemptionType] = useState('');

    useEffect(() => {
        if (!rewardId) {
            Alert.alert("Error", "No se proporcionó la recompensa a editar.");
            navigation.goBack();
            return;
        }

        const fetchReward = async () => {
            await ApiRefreshAccessToken();
            const response = await getRewardById(rewardId);
            if (response?.reward) {
                const reward = response.reward;
                setName(reward.name);
                setCoins((reward.coins ?? reward.price ?? '').toString());
                setRedemptions(reward.redemptionLimit?.toString() || '');
            } else {
                Alert.alert("Error", "Recompensa no encontrada.");
                navigation.goBack();
            }
        };

        fetchReward();
    }, [rewardId]);

    useEffect(() => {
        if (redemptions === "1") {
            setRedemptionType("1");
        } else if (redemptions === "") {
            setRedemptionType("");
        } else {
            setRedemptionType("custom");
        }
    }, [redemptions]);

    const validateCoins = (text) => {
        const value = text.replace(/[^0-9]/g, '');
        setCoins(value);
    };

    const validateRedemptions = (text) => {
        const value = text.replace(/[^0-9]/g, '');
        setRedemptions(value);
    };

    const handleSaveReward = async () => {
        if (!name.trim() || !coins.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const updatedReward = {
            name: name.trim(),
            price: parseInt(coins),
            type: redemptionType === 'custom' ? 'custom' : redemptionType === '1' ? 'once' : 'forever',
            ...(redemptionType === 'custom' && { redemptionLimit: parseInt(redemptions) }),
            ...(redemptionType === '' && { redemptionLimit: 0 })
        };

        try {
            await ApiRefreshAccessToken();
            const response = await ApiEditReward(rewardId, updatedReward);

            if (response && !response.error) {
                Alert.alert("Éxito", "Recompensa actualizada correctamente");
                navigation.goBack();
            } else {
                Alert.alert("Error", response?.error || "No se pudo actualizar la recompensa");
            }
        } catch (error) {
            console.error("Error al guardar recompensa:", error);
            Alert.alert("Error", "Ocurrió un error al guardar la recompensa");
        }
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.gradient}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.title}>✏️ Editar Recompensa</Text>

                            <CustomInput
                                placeholder="Nombre de la recompensa"
                                value={name}
                                onChangeText={setName}
                                customStyle={styles.input}
                            />

                            <View style={styles.inputContainer}>
                                <CoinIcon size={24} style={styles.coinIcon} />
                                <TextInput
                                    style={styles.inputWithIcon}
                                    placeholder="Cantidad de monedas"
                                    value={coins}
                                    onChangeText={validateCoins}
                                    keyboardType="numeric"
                                />
                            </View>

                            <Text style={styles.label}>Opciones de Canje:</Text>
                            <View style={styles.redemptionOptions}>
                                <View style={styles.redemptionItem}>
                                    <RedemptionOptionButton
                                        text="Una vez"
                                        selected={redemptionType === "1"}
                                        onPress={() => {
                                            setRedemptionType("1");
                                            setRedemptions("1");
                                        }}
                                    />
                                </View>
                                <View style={styles.redemptionItem}>
                                    <RedemptionOptionButton
                                        text="Siempre"
                                        selected={redemptionType === ""}
                                        onPress={() => {
                                            setRedemptionType("");
                                            setRedemptions("");
                                        }}
                                    />
                                </View>
                                <View style={styles.redemptionFull}>
                                    <RedemptionOptionButton
                                        text="Personalizado"
                                        selected={redemptionType === "custom"}
                                        onPress={() => setRedemptionType("custom")}
                                    />
                                </View>
                            </View>

                            {redemptionType === "custom" && (
                                <CustomInput
                                    placeholder="Número de canjes"
                                    value={redemptions}
                                    onChangeText={validateRedemptions}
                                    keyboardType="numeric"
                                    customStyle={styles.input}
                                />
                            )}
                        </View>

                        {/* Botones */}
                        <View style={styles.buttons}>
                            <CustomButton
                                color="#3E9697"
                                textColor="#FFFFFF"
                                text="Actualizar recompensa"
                                onPress={handleSaveReward}
                                disabled={
                                    !name.trim() ||
                                    !coins.trim() ||
                                    parseInt(coins) <= 0 ||
                                    (redemptionType === "custom" && (!redemptions.trim() || parseInt(redemptions) <= 0))
                                }
                            />

                            <CustomButton
                                color="#B3E5FC"
                                textColor="#003F5C"
                                text="Cancelar"
                                onPress={() => navigation.goBack()}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        minHeight: height * 0.85,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        elevation: 2,
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 15,
        elevation: 2,
    },
    coinIcon: {
        marginRight: 8,
    },
    inputWithIcon: {
        flex: 1,
        height: 50,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    redemptionOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10,
    },
    redemptionItem: {
        flexBasis: '48%',
    },
    redemptionFull: {
        flexBasis: '100%',
    },
    buttons: {
        marginTop: 20,
    },
});

export default EditReward;