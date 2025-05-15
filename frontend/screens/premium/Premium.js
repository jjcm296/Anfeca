import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ApiGetPremiumBanks } from '../../api/ApiPremium';
import Footer from './componens/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const benefitDetails = {
    Memoria: 'Fortalece la capacidad de retener y recuperar información clave durante el aprendizaje.',
    Atención: 'Mejora el enfoque sostenido en una tarea evitando distracciones comunes en niños con TDA.',
    Organización: 'Ayuda a estructurar ideas y planear tareas de forma clara y ordenada.',
};

const Premium = () => {
    const navigation = useNavigation();
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState('');

    useEffect(() => {
        const fetchBanks = async () => {
            const result = await ApiGetPremiumBanks();
            if (Array.isArray(result.premiumBanks)) {
                setBanks(result.premiumBanks);
            } else if (Array.isArray(result)) {
                setBanks(result);
            }
            setLoading(false);
        };
        fetchBanks();
    }, []);

    const handleOpenBank = (bankId) => {
        navigation.navigate('BankDetail', { bankId });
    };

    const handleSubscribe = () => {
        navigation.navigate('CardData');
    };

    const openBenefitInfo = (benefit) => {
        setSelectedBenefit(benefit);
        setModalVisible(true);
    };

    return (
        <LinearGradient colors={['#2faaf6', '#ffffff']} style={styles.gradient}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image source={require('../../assets/logo/Logo .png')} style={styles.logo} resizeMode="contain" />

                <View style={styles.welcomeBox}>
                    <Text style={styles.title}>🎉 Bienvenido a Premium</Text>
                    <Text style={styles.subtitle}>
                        Descubre cursos personalizados exclusivos que apoyan el aprendizaje de niños con TDA mediante diversión, estructura y enfoque.
                    </Text>
                </View>

                <TouchableOpacity style={styles.subscribeWrapper} onPress={handleSubscribe}>
                    <LinearGradient
                        colors={['#3E9697', '#2f5c98']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.subscribeButton}
                    >
                        <Ionicons name="star" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.subscribeText}>Activar Premium</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Zorro + burbuja */}
                <View style={styles.dialogContainer}>
                    <Image source={require('../../assets/mascota/Pose1.png')} style={styles.fox} resizeMode="contain" />
                    <View style={styles.bubbleContainer}>
                        <View style={styles.bubble}>
                            <Text style={styles.infoTitle}>¿Qué es el TDA?</Text>
                            <Text style={styles.infoParagraph}>
                                El <Text style={styles.bold}>Trastorno por Déficit de Atención (TDA)</Text> puede afectar la
                                <Text style={styles.highlight}> atención</Text>,
                                <Text style={styles.highlight}> memoria</Text> y la
                                <Text style={styles.highlight}> organización</Text>.
                            </Text>
                            <Text style={styles.infoParagraph}>
                                Nuestros <Text style={styles.bold}>bancos premium</Text> están diseñados para estimular estas habilidades con juegos interactivos.
                            </Text>
                        </View>
                        <View style={styles.bubbleArrow} />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Beneficios para niños con TDA</Text>

                <View style={styles.benefitsContainer}>
                    {['Memoria', 'Atención', 'Organización'].map((benefit, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.benefit}
                            onPress={() => openBenefitInfo(benefit)}
                        >
                            <Image
                                source={
                                    benefit === 'Memoria'
                                        ? require('../../assets/autism.png')
                                        : benefit === 'Atención'
                                            ? require('../../assets/focus.png')
                                            : require('../../assets/organizer.png')
                                }
                                style={styles.benefitIcon}
                            />
                            <Text style={styles.benefitText}>{benefit}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Bancos Premium</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#2f5c98" />
                ) : (
                    <FlatList
                        data={banks}
                        keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => handleOpenBank(item._id || item.id)}
                            >
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardDescription}>
                                    {item.description || 'Banco educativo premium'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        scrollEnabled={false}
                        contentContainerStyle={{ gap: 16 }}
                    />
                )}

                <Text style={styles.motivationalText}>
                    🎓 Aprender puede ser divertido. ¡Activa tu acceso premium y comienza hoy!
                </Text>

                <Footer />

                {/* Modal de beneficios */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedBenefit}</Text>
                            <Text style={styles.modalDescription}>{benefitDetails[selectedBenefit]}</Text>
                            <TouchableOpacity
                                style={styles.modalClose}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCloseText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: {
        padding: 20,
        paddingBottom: 60,
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 10,
    },
    welcomeBox: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#2f5c98',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2f5c98',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#444',
        textAlign: 'center',
        paddingHorizontal: 6,
        lineHeight: 22,
    },
    subscribeWrapper: {
        alignSelf: 'center',
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    subscribeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 26,
        borderRadius: 16,
    },
    subscribeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dialogContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    fox: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    bubbleContainer: {
        flex: 1,
        position: 'relative',
    },
    bubble: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 14,
        borderColor: '#2f5c98',
        borderWidth: 1.5,
    },
    bubbleArrow: {
        position: 'absolute',
        left: -10,
        top: 20,
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderRightWidth: 15,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#ffffff',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2f5c98',
        marginBottom: 6,
    },
    infoParagraph: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 4,
    },
    bold: {
        fontWeight: 'bold',
        color: '#2f5c98',
    },
    highlight: {
        fontWeight: '600',
        color: '#3E9697',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2f5c98',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        borderColor: '#2f5c98',
        borderWidth: 1.2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2f5c98',
    },
    cardDescription: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    benefitsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    benefit: {
        alignItems: 'center',
    },
    benefitIcon: {
        width: 48,
        height: 48,
        marginBottom: 4,
    },
    benefitText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2f5c98',
    },
    motivationalText: {
        marginTop: 30,
        fontSize: 15,
        color: '#2f5c98',
        textAlign: 'center',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2f5c98',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalClose: {
        backgroundColor: '#2f5c98',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    modalCloseText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Premium;
