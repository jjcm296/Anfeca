import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {
    getBankById,
    updateBank,
    deleteBank,
} from '../../../api/ApiBank';
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

    const handleDelete = () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este banco de preguntas?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ApiRefreshAccessToken();
                            const deleted = await deleteBank(bankId);

                            if (deleted) {
                                Alert.alert('✅ Eliminado', 'Banco de preguntas eliminado correctamente.');
                                navigation.goBack();
                            } else {
                                Alert.alert('Error', 'No se pudo eliminar el banco.');
                            }
                        } catch (error) {
                            console.error('❌ Error al eliminar banco:', error);
                            Alert.alert('Error', 'No se pudo eliminar el banco.');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Banco de Preguntas</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre de la categoría..."
                value={category}
                onChangeText={setCategory}
            />

            <CustomButton
                color="#FF0000"
                text="Eliminar"
                textColor="#FFFFFF"
                onPress={handleDelete}
            />

            <CustomButton
                color="#6200EE"
                text="Actualizar"
                textColor="#FFFFFF"
                onPress={handleUpdate}
                disabled={
                    updating || !category || category.trim() === '' || category === originalName
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

export default EditQuestionBank;
