import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CoinIcon from '../../ui/components/CoinIcon';
import CustomButton from '../../ui/components/CustomButton';
import CustomInput from '../../ui/components/CustomInput';
import RedemptionOptionButton from '../../ui/components/RedemptionOptionButton';
import FakeDataBase from '../../../fakeDataBase/FakeDataBase';

const EditReward = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { reward } = route.params;

    const [name, setName] = useState(reward.name);
    const [coins, setCoins] = useState(reward.coins.toString());
    const [redemptions, setRedemptions] = useState(reward.redemptions?.toString() || "");
    const [redemptionType, setRedemptionType] = useState("");

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

    const handleSaveReward = () => {
        if (!name.trim() || !coins.trim()) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const updatedRedemptions = redemptionType === "custom" ? redemptions : redemptionType;

        FakeDataBase.updateReward(reward.id, {
            name,
            coins: parseInt(coins),
            redemptions: updatedRedemptions
        });

        Alert.alert("Éxito", "Recompensa actualizada correctamente");
        navigation.goBack();
    };

    const handleDeleteReward = () => {
        Alert.alert(
            "Eliminar Recompensa",
            "¿Estás seguro de que quieres eliminar esta recompensa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => {
                        FakeDataBase.deleteReward(reward.id);
                        Alert.alert("Éxito", "Recompensa eliminada correctamente");
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
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
                <RedemptionOptionButton
                    text="Una vez"
                    selected={redemptionType === "1"}
                    onPress={() => {
                        setRedemptionType("1");
                        setRedemptions("1");
                    }}
                />
                <RedemptionOptionButton
                    text="Siempre"
                    selected={redemptionType === ""}
                    onPress={() => {
                        setRedemptionType("");
                        setRedemptions("");
                    }}
                />
                <RedemptionOptionButton
                    text="Personalizado"
                    selected={redemptionType === "custom"}
                    onPress={() => setRedemptionType("custom")}
                />
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

            <CustomButton
                color="#FF0000"
                textColor="#FFFFFF"
                text="Eliminar Recompensa"
                onPress={handleDeleteReward}
            />

            <CustomButton
                color="#6200EE"
                textColor="#FFFFFF"
                text="Guardar Cambios"
                onPress={handleSaveReward}
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
});

export default EditReward;
