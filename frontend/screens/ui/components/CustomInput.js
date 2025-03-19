import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const CustomInput = ({ placeholder, value, onChangeText, required = false }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
            />
            {required && !value.trim() && <Text style={styles.errorText}>* Campo obligatorio</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default CustomInput;
