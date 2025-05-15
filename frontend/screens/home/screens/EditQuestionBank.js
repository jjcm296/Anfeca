import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getBankById, updateBank } from '../../../api/ApiBank';
import { ApiRefreshAccessToken } from '../../../api/ApiLogin';
import CustomButton from '../../ui/components/CustomButton';

const EditQuestionBank = ({ route, navigation }) => {
    const { bankId } = route.params;
    const [category, setCategory] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchBank = async () => {
            try {
                await ApiRefreshAccessToken();
                const bank = await getBankById(bankId);
                if (bank) {
                    setCategory(bank.name || '');
                    setOriginalName(bank.name || '');
                } else {
                    Alert.alert('Error', 'Banco de preguntas no encontrado.');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('❌ Error al obtener banco:', error);
                Alert.alert('Error', 'No se pudo cargar el banco de preguntas.');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        fetchBank();
    }, [bankId]);

    const handleUpdate = async () => {
        if (!category || category.trim() === '') {
            Alert.alert('Error', 'El nombre no puede estar vacío.');
            return;
        }

        setUpdating(true);
        try {
            await ApiRefreshAccessToken();
            const updated = await updateBank(bankId, { name: category });

            if (updated) {
                setOriginalName(category);
                Alert.alert('✅ Actualizado', 'Banco de preguntas actualizado correctamente.');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'No se pudo actualizar el banco.');
            }
        } catch (error) {
            console.error('❌ Error al actualizar banco:', error);
            Alert.alert('Error', 'Ocurrió un problema al actualizar.');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        <Text style={styles.title}>✏️ Editar Categoría</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la categoría..."
                            value={category}
                            onChangeText={setCategory}
                            placeholderTextColor="#aaa"
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <CustomButton
                        color="#3E9697"
                        text="Actualizar pregunta"
                        textColor="#ffffff"
                        onPress={handleUpdate}
                        disabled={
                            updating || !category || category.trim() === '' || category === originalName
                        }
                    />
                    <CustomButton
                        color="#B3E5FC"
                        text="Cancelar"
                        textColor="#003F5C"
                        onPress={handleCancel}
                    />
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 10,
    },
    card: {
        height: 130,
        marginTop: 10,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1.5,
        borderColor: '#2f5c98',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#f4f4f4',
        padding: 12,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#3E9697',
        color: '#000',
    },
    footer: {
        padding: 20,
        backgroundColor: 'transparent',
    },
});

export default EditQuestionBank;
