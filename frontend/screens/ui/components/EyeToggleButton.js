import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

const EyeToggleButton = ({ isVisible, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
            {isVisible ? <EyeOff size={24} color="#555" /> : <Eye size={24} color="#555" />}
        </TouchableOpacity>
    );
};

export default EyeToggleButton;
