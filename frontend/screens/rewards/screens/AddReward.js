import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CoinIcon from '../../ui/components/CoinIcon';
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';
import RedemptionOptionButton from '../../ui/components/RedemptionOptionButton';
import { ApiRefreshAccessToken } from "../../../api/ApiLogin";
import { createReward } from "../../../api/ApiRewards";

const { height } = Dimensions.get('window');

const AddReward = ({ navigation }) => {
    const [name, setName] = useState('');
    const [coins, setCoins] = useState('');
    const [redemptions, setRedemptions] = useState('');
    const [redemptionType, setRedemptionType] = useState('1');
    const [coinError, setCoinError] = useState('');
    const [redemptionsError, setRedemptionsError] = useState('');

    const validateCoins = (text) => {
        const value = text.replace(/[^0-9]/g, '');
        setCoins(value);
        setCoinError(value && parseInt(value) > 0 ? '' : "La cantidad de monedas debe ser mayor a 0.");
    };

    const validateRedemptions = (text) => {
        const value = text.replace(/[^0-9]/g, '');
        setRedemptions(value);
        setRedemptionsError(value && parseInt(value) > 0 ? '' : "El número de canjes debe ser mayor a 0.");
    };

    const handleAddReward = async () => {
        if (!name.trim() || !coins.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const type = redemptionType === 'custom'
            ? 'custom'
            : redemptionType === '1'
                ? 'once'
                : 'forever';

        const body = {
            name: name.trim(),
            price: parseInt(coins),
            type,
            ...(type === 'custom' && { redemptionLimit: parseInt(redemptions) })
        };

        if (type === 'custom') {
            const limit = parseInt(redemptions);
            if (!limit || limit <= 0) {
                Alert.alert("Error", "Debes especificar un número de canjes válido mayor a 0.");
                return;
            }
        }

        try {
            await ApiRefreshAccessToken();
            const response = await createReward(body);

            if (response.error) {
                Alert.alert("Error", response.error);
                return;
            }

            Alert.alert("Éxito", "Recompensa agregada correctamente");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.gradient}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.title}>🎁 Agregar Recompensa</Text>

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
                            {coinError ? <Text style={styles.errorText}>{coinError}</Text> : null}

                            <Text style={styles.label}>Opciones de Canje:</Text>
                            <View style={styles.redemptionOptions}>
                                <View style={styles.redemptionItem}>
                                    <RedemptionOptionButton
                                        text="Una vez"
                                        selected={redemptionType === "1"}
                                        onPress={() => setRedemptionType("1")}
                                    />
                                </View>
                                <View style={styles.redemptionItem}>
                                    <RedemptionOptionButton
                                        text="Siempre"
                                        selected={redemptionType === ""}
                                        onPress={() => setRedemptionType("")}
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
                                <>
                                    <CustomInput
                                        placeholder="Número de canjes"
                                        value={redemptions}
                                        onChangeText={validateRedemptions}
                                        keyboardType="numeric"
                                        customStyle={styles.input}
                                    />
                                    {redemptionsError ? <Text style={styles.errorText}>{redemptionsError}</Text> : null}
                                </>
                            )}
                        </View>

                        <View style={styles.buttons}>
                            <CustomButton
                                color="#3E9697"
                                textColor="#FFFFFF"
                                text="Agregar Recompensa"
                                onPress={handleAddReward}
                                disabled={
                                    !name.trim() ||
                                    !coins.trim() ||
                                    parseInt(coins) <= 0 ||
                                    !!coinError ||
                                    (redemptionType === "custom" && (
                                        !redemptions.trim() ||
                                        parseInt(redemptions) <= 0 ||
                                        !!redemptionsError
                                    ))
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
        marginBottom: 5,
        marginTop: 5,
        elevation: 2,
    },
    coinIcon: {
        position: 'absolute',
        left: 15,
        zIndex: 10,
    },
    inputWithIcon: {
        flex: 1,
        height: 50,
        paddingTop: 11,
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
        marginBottom: 15,
    },
    redemptionItem: {
        flexBasis: '48%',
    },
    redemptionFull: {
        flexBasis: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 10,
    },
    buttons: {
        marginTop: 20,
    },
});

export default AddReward;