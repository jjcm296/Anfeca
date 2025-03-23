import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from "./screens/home/Home";
import QuestionsScreen from "./screens/home/screens/Questions";
import AddQuestionScreen from "./screens/home/screens/AddQuestion";
import RewardsScreen from './screens/rewards/Rewards';
import PremiumScreen from './screens/premium/Premium'; // Nueva pantalla Premium
import TopBar from "./screens/ui/topBar/TopBar";
import AddQuestionBank from "./screens/home/screens/AddQuestionBank";
import EditQuestion from "./screens/home/screens/EditQuestion";
import EditQuestionBank from "./screens/home/screens/EditQuestionBank";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación dentro de Home
function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="AddQuestionBank" component={AddQuestionBank} />
            <Stack.Screen name="EditQuestionBank" component={EditQuestionBank} />
            <Stack.Screen name="Questions" component={QuestionsScreen} />
            <Stack.Screen name="AddQuestion" component={AddQuestionScreen} />
            <Stack.Screen name="EditQuestion" component={EditQuestion} />
        </Stack.Navigator>
    );
}

// Navegación principal
export default function App() {
    return (
        <NavigationContainer>
            <TopBar coins={100} />
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Home') iconName = 'home';
                        else if (route.name === 'Rewards') iconName = 'trophy';
                        else if (route.name === 'Premium') iconName = 'star';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#6200EE',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: { backgroundColor: '#f8f8f8', paddingBottom: 5 },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Rewards" component={RewardsScreen} options={{ unmountOnBlur: true }} />
                <Tab.Screen name="Home" component={HomeStack} options={{ unmountOnBlur: true }} />
                <Tab.Screen name="Premium" component={PremiumScreen} options={{ unmountOnBlur: true }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
