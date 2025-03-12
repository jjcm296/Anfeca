import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NavBar = ({ navigation }) => {
    return (
        <View style={styles.navBar}>
            {/* Botón Rewards */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Rewards")}>
                <Ionicons name="trophy" size={24} color="gray" />
                <Text style={styles.navText}>Rewards</Text>
            </TouchableOpacity>

            {/* Botón Home */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                <Ionicons name="home" size={24} color="#6200EE" />
                <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>

            {/* Botón Profile */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
                <Ionicons name="person" size={24} color="gray" />
                <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
});

export default NavBar;
