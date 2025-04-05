import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import CoinIcon from '../../ui/components/CoinIcon';
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';
import RedemptionOptionButton from '../../ui/components/RedemptionOptionButton';
import FakeDataBase from '../../../fakeDataBase/FakeDataBase';

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

    const handleAddReward = () => {
        if (!name.trim() || !coins.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const redemptionValue = redemptionType === 'custom' ? redemptions : redemptionType;

        FakeDataBase.addReward(name, parseInt(coins), redemptionValue);

        Alert.alert("Éxito", "Recompensa agregada correctamente");
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎁 Agregar Recompensa</Text>
            <CustomInput
                placeholder="Nombre de la recompensa"
                value={name} onChangeText={setName}
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
                <RedemptionOptionButton
                    text="Una vez"
                    selected={redemptionType === "1"}
                    onPress={() => setRedemptionType("1")}
                />
                <RedemptionOptionButton
                    text="Siempre"
                    selected={redemptionType === ""}
                    onPress={() => setRedemptionType("")}
                />
                <RedemptionOptionButton
                    text="Personalizado"
                    selected={redemptionType === "custom"}
                    onPress={() => setRedemptionType("custom")}
                />
            </View>

            {redemptionType === "custom" && (
                <>
                    <CustomInput
                        placeholder="Número de canjes"
                        value={redemptions}
                        onChangeText={validateRedemptions}
                        keyboardType="numeric"
                        customStyle={styles.input} />
                    {redemptionsError ? <Text style={styles.errorText}>{redemptionsError}</Text> : null}
                </>
            )}

            <CustomButton
                color="#6200EE"
                textColor="#FFFFFF"
                text="Agregar Recompensa"
                onPress={handleAddReward}
                disabled={!name.trim() || !coins.trim() || parseInt(coins) <= 0 || coinError || (redemptionType === "custom" && (!redemptions.trim() || parseInt(redemptions) <= 0 || redemptionsError))}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#FAFAFA',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        elevation: 3,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 5,
        marginTop: 5,
        elevation: 3,
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
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    redemptionOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        marginLeft: 10,
    },
});

export default AddReward;
