import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Modal,
    TouchableWithoutFeedback, Keyboard, TextInput, Alert
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from "expo-secure-store";

import { ApiGetProfilesNames, ApiGetCurrentName, ApiSwitchProfile } from '../../api/ApiLogin';
import { ApiDeleteAccount } from '../../api/ApiAccount';

import { SessionContext } from '../../context/SessionContext';

import ProfileImage from '../ui/components/ProfileImage';
import CustomButton from '../ui/components/CustomButton';
import CloseButton from '../ui/components/CloseButton';
import EyeToggleButton from '../ui/components/EyeToggleButton';

const Profile = () => {
    const navigate = useNavigation();
    const { session, updateSessionFromToken } = useContext(SessionContext);

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
    }, [session]);

    const handleSelectProfile = async (profile) => {
        setTempProfile(profile);
        if (profile.type === 'Tutor') {
            setPassword('');
            setShowPassword(false);
            setPasswordModalVisible(true);
        } else {
            const result = await ApiSwitchProfile(profile.id);
            if (result) {
                updateSessionFromToken(result.newAccessToken, result.decoded);
                setModalVisible(false);
                navigate.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                Alert.alert('Error', 'No se pudo cambiar al perfil de niño.');
            }
        }
    };

    const handlePasswordSubmit = async () => {
        const enteredPassword = password.trim();
        if (tempProfile && enteredPassword !== '') {
            const result = await ApiSwitchProfile(tempProfile.id, enteredPassword);
            if (result) {
                updateSessionFromToken(result.newAccessToken, result.decoded);
                setPasswordModalVisible(false);
                setModalVisible(false);
                navigate.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                Alert.alert('Error', 'Contraseña incorrecta.');
            }
        } else {
            Alert.alert('Error', 'Contraseña vacía.');
        }
    };

    const options = [
        { id: '1', title: 'Cambiar perfil', onPress: () => setModalVisible(true) },
        {
            id: '2',
            title: 'Ir a la página web',
            onPress: () => {
                import('react-native').then(({ Linking }) => {
                    Linking.openURL('https://concentra-tda-web.vercel.app').catch(() =>
                        Alert.alert("Error", "No se pudo abrir la página.")
                    );
                });
            }
        },
        { id: '3', title: 'Cerrar sesión', onPress: () => navigate.navigate("Authentication") },
    ];

    if (session.profileType === 'guardian') {
        options.push(
            {
                id: 'premium',
                title: 'Activar Premium',
                color: '#FFD700',
                textColor: '#333',
                onPress: () => navigate.navigate('CardData')
            },
            {
                id: 'delete',
                title: 'Eliminar cuenta',
                color: '#FF4E4E',
                textColor: '#FFFFFF',
                onPress: () => {
                    Alert.alert(
                        "Eliminar cuenta",
                        "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
                        [
                            { text: "Cancelar", style: "cancel" },
                            {
                                text: "Eliminar",
                                style: "destructive",
                                onPress: async () => {
                                    try {
                                        const result = await ApiDeleteAccount();
                                        if (result?.message) {
                                            await SecureStore.deleteItemAsync('accessToken');
                                            await SecureStore.deleteItemAsync('refreshToken');
                                            Alert.alert("Cuenta eliminada", "Tu cuenta fue eliminada correctamente.");
                                            navigate.reset({ index: 0, routes: [{ name: 'Authentication' }] });
                                        } else {
                                            Alert.alert("Error", result?.error || "No se pudo eliminar la cuenta.");
                                        }
                                    } catch (err) {
                                        Alert.alert("Error", "Ocurrió un error al intentar eliminar la cuenta.");
                                    }
                                }
                            }
                        ]
                    );
                }
            }
        );
    }

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <View style={styles.avatarWrapper}>
                        <ProfileImage width={100} height={100} />
                    </View>
                </TouchableOpacity>
                {selectedProfile && (
                    <>
                        <Text style={styles.profileType}>{selectedProfile.type}</Text>
                        <Text style={styles.profileName}>{selectedProfile.name}</Text>
                    </>
                )}
            </View>

            {/* Modal cambio de perfil */}
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
                                        <View style={styles.avatarWrapperSmall}>
                                            <ProfileImage width={80} height={80} />
                                        </View>
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

            {/* Modal contraseña */}
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

            <FlatList
                data={options}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 12 }}>
                        <CustomButton
                            text={item.title}
                            color={item.color || '#3E9697'}
                            textColor={item.textColor || '#FFFFFF'}
                            onPress={item.onPress}
                            disabled={item.disabled}
                        />
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </LinearGradient>
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
        color: '#2f5c98',
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
        width: '85%',
        maxHeight: '60%',
        position: 'relative',
        borderWidth: 2,
        borderColor: '#2f5c98',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
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
    avatarWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f3fc', // azul claro pastel
        borderColor: '#2faaf6',
        borderWidth: 2,
        borderRadius: 100,
        padding: 6,
        width: 112,
        height: 112,
    },

    avatarWrapperSmall: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#2faaf6',
        borderWidth: 2,
        borderRadius: 100,
        padding: 4,
        width: 90,
        height: 90,
        marginVertical: 6,
        shadowColor: '#2faaf6',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 3,
    },
});

export default Profile;
