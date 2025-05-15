import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import CustomButton from '../../ui/components/CustomButton';
import { createBank } from "../../../api/ApiBank";
import { ApiRefreshAccessToken } from "../../../api/ApiLogin";

const AddQuestionBank = ({ navigation }) => {
    const [category, setCategory] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (category.trim() === '') {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        try {
            setSubmitting(true);
            await ApiRefreshAccessToken();
            const response = await createBank({ name: category });

            if (response.error) {
                console.log("Error:", response.error);
                Alert.alert("Error", "Error al agregar el banco de preguntas.");
            } else {
                Alert.alert("Éxito", "Banco de preguntas agregado correctamente.");
                navigation.goBack();
            }
        } catch (error) {
            console.error("Error inesperado:", error);
            Alert.alert("Error", "Error al agregar el banco de preguntas.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        <Text style={styles.title}>Agregar Categoría</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la categoría..."
                            placeholderTextColor="#aaa"
                            value={category}
                            onChangeText={setCategory}
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <CustomButton
                        color="#3E9697"
                        text="Agregar banco de preguntas"
                        textColor="#ffffff"
                        onPress={handleSubmit}
                        disabled={submitting || category.trim() === ''}
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
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
});

export default AddQuestionBank;
