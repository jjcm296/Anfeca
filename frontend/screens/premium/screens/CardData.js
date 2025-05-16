import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
    CreditCardIcon,
    LockClosedIcon,
    CpuChipIcon,
    CalendarDaysIcon,
    SignalIcon,
} from "react-native-heroicons/outline";
import {
    ArrowLongLeftIcon,
    ChevronRightIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";


const CardData = () => {
    const navigation = useNavigation();

    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");

    const handleCardNumberChange = (text) => {
        const numeric = text.replace(/[^0-9]/g, "").slice(0, 16);
        setCardNumber(numeric);
    };

    const formatCardNumber = (input) => {
        const cleaned = input.replace(/[^0-9]/g, "").slice(0, 16);
        const parts = [];
        for (let i = 0; i < cleaned.length; i += 4) {
            parts.push(cleaned.slice(i, i + 4));
        }
        return parts.join(" - ");
    };

    const getMaskedCardDisplay = (input) => {
        const numeric = input.replace(/[^0-9]/g, "").slice(0, 16);
        if (numeric.length <= 12) return "**** **** **** ****";
        const lastDigits = numeric.slice(12);
        const padded = lastDigits.padEnd(4, "*");
        return `**** **** **** ${padded}`;
    };

    const formatExpiry = (input) => {
        const numeric = input.replace(/[^0-9]/g, "").slice(0, 4);
        if (numeric.length > 2) {
            return `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}`;
        }
        return numeric;
    };

    return (
        <LinearGradient colors={["#2faaf6", "#ffffff"]} style={styles.gradient}>
            <View style={styles.container}>
                <ArrowLongLeftIcon
                    size={30}
                    color="#2f5c98"
                    style={{ marginBottom: 20 }}
                />
                <Text style={styles.title}>Información de pago</Text>

                <LinearGradient
                    colors={["#56b448", "#2f5c98"]}
                    style={styles.card}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.cardHeaderNew}>
                        <CpuChipIcon size={36} color="rgba(255,255,255,0.9)" />
                        <SignalIcon size={36} color="rgba(255,255,255,0.9)" />
                    </View>

                    <Text style={styles.cardNumberNew}>
                        {getMaskedCardDisplay(cardNumber)}
                    </Text>

                    <View style={styles.cardDetails}>
                        <View>
                            <Text style={styles.cardLabel}>Titular</Text>
                            <Text style={styles.cardHolder}>
                                {cardHolderName || "MÓNICA GARCÍA"}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>Expira</Text>
                            <Text style={styles.cardExpiry}>09/27</Text>
                        </View>
                    </View>

                    <Text style={styles.bankLogo}>VISA</Text>
                </LinearGradient>

                {/* Nuevo input: nombre del titular */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nombre del titular</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Mónica García"
                            value={cardHolderName}
                            onChangeText={setCardHolderName}
                        />
                    </View>
                </View>

                {/* Número de tarjeta */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Número de la tarjeta</Text>
                    <View style={styles.inputWrapper}>
                        <CreditCardIcon size={22} color="#999" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="1234 - 5678 - 9012 - 3456"
                            keyboardType="numeric"
                            maxLength={25}
                            value={formatCardNumber(cardNumber)}
                            onChangeText={(text) =>
                                setCardNumber(text.replace(/[^0-9]/g, "").slice(0, 16))
                            }
                        />
                    </View>
                </View>

                {/* Expiración y CVV */}
                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.inputLabel}>Expiración</Text>
                        <View style={styles.inputWrapper}>
                            <CalendarDaysIcon size={22} color="#999" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="MM / YY"
                                keyboardType="numeric"
                                maxLength={5}
                                value={formatExpiry(expiry)}
                                onChangeText={(text) =>
                                    setExpiry(text.replace(/[^0-9]/g, ""))
                                }
                            />
                        </View>
                    </View>

                    <View style={[styles.inputContainer, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>CVV</Text>
                        <View style={styles.inputWrapper}>
                            <LockClosedIcon size={22} color="#999" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="•••"
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                            />
                        </View>
                    </View>
                </View>

                <Pressable
                    style={styles.button}
                    onPress={() =>
                        Alert.alert("¡Felicidades!", "Ahora tienes acceso a Premium.", [
                            {
                                text: "Ir al inicio",
                                onPress: () => navigation.navigate("MainTabs", { screen: "Home" }),
                            },
                        ])
                    }
                >
                    <Text style={styles.buttonText}>Pagar $99.00 MXN</Text>
                    <ChevronRightIcon size={20} color="#FEFEFE" style={styles.buttonIcon} />
                </Pressable>

            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: {
        flex: 1,
        padding: 25,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2f5c98",
        marginBottom: 25,
        textAlign: "center",
    },
    card: {
        height: 220,
        borderRadius: 24,
        padding: 25,
        marginBottom: 35,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 8,
    },
    cardHeaderNew: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    cardNumberNew: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "Courier New",
    },
    cardDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardLabel: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
        marginBottom: 4,
    },
    cardHolder: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    cardExpiry: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    bankLogo: {
        position: "absolute",
        right: 25,
        bottom: 20,
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        fontStyle: "italic",
    },
    inputContainer: {
        marginBottom: 18,
    },
    inputLabel: {
        color: "#2f5c98",
        fontSize: 14,
        marginBottom: 6,
        fontWeight: "600",
    },
    inputWrapper: {
        position: "relative",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingLeft: 45,
        padding: 14,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    icon: {
        position: "absolute",
        left: 14,
        top: 14,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        backgroundColor: "#3E9697",
        padding: 18,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginRight: 8,
    },
    buttonIcon: {
        marginTop: 2,
    },
});

export default CardData;
