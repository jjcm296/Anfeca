import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import ProfileImage from '../ui/components/ProfileImage'; // Importa el componente ProfileImage
import CustomButton from '../ui/components/CustomButton'; // Importa el componente CustomButton

const Profile = () => {
    const options = [
        { id: '1', title: 'Cambiar perfil', color: '#FFFFFF' },
        { id: '2', title: 'Ir a la página web', color: '#FFFFFF' },
        { id: '3', title: 'Cerrar sesión', color: '#FFFFFF' },
        { id: '4', title: 'Eliminar cuenta', color: '#FF0000', textColor: '#FFFFFF' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {/* Componente para la imagen de perfil */}
                <ProfileImage width={100} height={100} />
                <Text style={styles.profileName}>Name</Text>
            </View>
            <FlatList
                data={options}
                renderItem={({ item }) => (
                    // Usamos el CustomButton aquí para cada opción
                    <CustomButton
                        text={item.title}
                        color={item.color}
                        onPress={() => handleOptionPress(item.title)}
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
    profileRole: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
});

export default Profile;
