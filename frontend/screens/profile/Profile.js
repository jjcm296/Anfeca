import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ProfileImage from '../ui/components/ProfileImage'; // Componente ProfileImage
import CustomButton from '../ui/components/CustomButton'; // Componente CustomButton
import FakeDataBase from '../../fakeDataBase/FakeDataBase'; // Simulando la base de datos de perfiles

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const profiles = FakeDataBase.getProfiles();

    const options = [
        { id: '1', title: 'Cambiar perfil' },
        { id: '2', title: 'Ir a la página web' },
        { id: '3', title: 'Cerrar sesión' },
        { id: '4', title: 'Eliminar cuenta', color: '#FF0000', textColor: '#FFFFFF' },
    ];

    const handleSelectProfile = (profile) => {
        console.log('Perfil seleccionado: ', profile.name);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {/* Componente para la imagen de perfil con acción de cambio */}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <ProfileImage width={100} height={100} />
                </TouchableOpacity>
                <Text style={styles.profileName}>Name</Text>
            </View>

            {/* Modal para cambiar el perfil */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Cambia de perfiles</Text>
                            <FlatList
                                data={profiles}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.profileItem}
                                        onPress={() => handleSelectProfile(item)}
                                    >
                                        <ProfileImage width={80} height={80} />
                                        <Text style={styles.profileName}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                            {/* Botón para cerrar el modal */}
                            <CustomButton
                                text="Cerrar"
                                color="#FF0000" // Color rojo para el botón de cierre
                                onPress={() => setModalVisible(false)} // Cierra el modal
                                textColor="#FFFFFF" // Texto blanco
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Los botones debajo de la imagen de perfil */}
            <FlatList
                data={options}
                renderItem={({ item }) => (
                    <CustomButton
                        text={item.title}
                        color={item.color}
                        onPress={() => console.log(item.title)} // Acción por ahora, cambiar según necesidad
                        disabled={item.disabled}
                        textColor={item.textColor}
                    />
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center', // Centra el modal verticalmente
        alignItems: 'center', // Centra el modal horizontalmente
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        maxHeight: '50%', // Controla el tamaño máximo del modal
    },
    profileItem: {
        alignItems: 'center',
        marginRight: 20,
    },
});

export default Profile;