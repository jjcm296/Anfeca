import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Modal,
    TouchableWithoutFeedback, Keyboard, TextInput, Alert
} from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { ApiGetProfilesNames, ApiGetCurrentName } from '../../api/ApiLogin';
import { SessionContext } from '../../context/SessionContext';

import ProfileImage from '../ui/components/ProfileImage';
import CustomButton from '../ui/components/CustomButton';
import CloseButton from '../ui/components/CloseButton';
import EyeToggleButton from '../ui/components/EyeToggleButton';

const Profile = () => {
    const navigate = useNavigation();
    const { session } = useContext(SessionContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [tempProfile, setTempProfile] = useState(null);

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const profileNameData = await ApiGetCurrentName();
            const allProfiles = await ApiGetProfilesNames();

            if (profileNameData && profileNameData.name) {
                setSelectedProfile(profileNameData);
            }

            if (Array.isArray(allProfiles)) {
                setProfiles(allProfiles);
            }
        };

        fetchData();
    }, []);

    const handleSelectProfile = (profile) => {
        setTempProfile(profile);
        if (profile.type === 'Tutor') {
            setPassword('');
            setShowPassword(false);
            setPasswordModalVisible(true);
        } else {
            setModalVisible(false);
        }
    };

    const handlePasswordSubmit = () => {
        const enteredPassword = password.trim();
        if (tempProfile && enteredPassword !== '') {
            setPasswordModalVisible(false);
            setModalVisible(false);
        } else {
            Alert.alert('Error', 'Contraseña incorrecta o vacía.');
        }
    };

    const options = [
        { id: '1', title: 'Cambiar perfil', onPress: () => setModalVisible(true) },
        { id: '2', title: 'Ir a la página web' },
        { id: '3', title: 'Cerrar sesión', onPress: () => navigate.navigate("Authentication") },
        { id: '4', title: 'Eliminar cuenta', color: '#FF0000', textColor: '#FFFFFF' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <ProfileImage width={100} height={100} />
                </TouchableOpacity>

                {selectedProfile && (
                    <>
                        <Text style={styles.profileType}>{selectedProfile.type}</Text>
                        <Text style={styles.profileName}>{selectedProfile.name}</Text>
                    </>
                )}
            </View>

            {/* Modal de selección de perfil */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <CloseButton onPress={() => setModalVisible(false)} />
                            <Text style={styles.title}>Cambia de perfiles</Text>
                            <FlatList
                                data={profiles}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.profileItem}
                                        onPress={() => handleSelectProfile(item)}
                                    >
                                        <Text style={styles.profileTypeSmall}>{item.type}</Text>
                                        <ProfileImage width={80} height={80} />
                                        <Text style={styles.profileName}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item.id.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal para ingresar la contraseña */}
            <Modal
                visible={passwordModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPasswordModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <CloseButton onPress={() => setPasswordModalVisible(false)} />
                            <Text style={styles.title}>Ingresa tu contraseña</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contraseña"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <EyeToggleButton
                                    isVisible={showPassword}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            </View>
                            <CustomButton text="Confirmar" onPress={handlePasswordSubmit} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Opciones */}
            <FlatList
                data={options}
                renderItem={({ item }) => (
                    <CustomButton
                        text={item.title}
                        color={item.color}
                        onPress={item.onPress}
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
        paddingTop: 80,
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileType: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    profileTypeSmall: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        maxHeight: '50%',
        position: 'relative',
    },
    profileItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
});

export default Profile;
