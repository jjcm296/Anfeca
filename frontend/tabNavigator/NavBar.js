import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

const NavBar = ({ navigation }) => {
    const route = useRoute();

    const isActive = (screen) => route.name === screen;

    return (
        <View style={styles.navBar}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Rewards")}>
                <Ionicons
                    name="trophy"
                    size={24}
                    color={isActive("Rewards") ? '#56B448' : 'gray'} // verde si activo
                />
                <Text style={[styles.navText, isActive("Rewards") && styles.activeText]}>
                    Recompensas
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                <Ionicons
                    name="home"
                    size={24}
                    color={isActive("Home") ? '#2FAAF6' : 'gray'} // azul si activo
                />
                <Text style={[styles.navText, isActive("Home") && styles.activeText]}>
                    Inicio
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Premium")}>
                <Ionicons
                    name="star"
                    size={24}
                    color={isActive("Premium") ? '#F77328' : 'gray'} // naranja si activo
                />
                <Text style={[styles.navText, isActive("Premium") && styles.activeText]}>
                    Premium
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
    activeText: {
        color: '#2F5C98',
        fontWeight: 'bold',
    },
});

export default NavBar;
