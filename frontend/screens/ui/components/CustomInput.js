import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const CustomInput = ({ placeholder, value, onChangeText, required = false, customStyle = {} }) => {
    const [touched, setTouched] = useState(false); // Estado para detectar si el usuario tocó el input

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, customStyle]} // Aplicamos estilos personalizados si existen
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setTouched(true)} // Marca el campo como tocado cuando recibe el foco
                onBlur={() => setTouched(true)} // Mantiene el estado de "tocado" al perder el foco
            />
            {required && touched && !value.trim() && (
                <Text style={styles.errorText}>* Campo obligatorio</Text>
            )}
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
