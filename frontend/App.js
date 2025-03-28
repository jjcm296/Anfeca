import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Pantallas principales
import HomeScreen from './screens/home/Home';
import QuestionsScreen from './screens/home/screens/Questions';
import AddQuestionScreen from './screens/home/screens/AddQuestion';
import EditQuestion from './screens/home/screens/EditQuestion';
import AddQuestionBank from './screens/home/screens/AddQuestionBank';
import EditQuestionBank from './screens/home/screens/EditQuestionBank';

import Rewards from './screens/rewards/Rewards';
import AddReward from './screens/rewards/screens/AddReward';
import EditReward from './screens/rewards/screens/EditReward';

import PremiumScreen from './screens/premium/Premium';
import ProfileScreen from './screens/profile/Profile';

// Autenticación
import Authentication from './screens/authentication/authentication';
import RegisterAccount from './screens/authentication/screen/RegisterAccount';
import VerificationCode from './screens/authentication/screen/VerificationCode';
import CreateChildAccount from './screens/authentication/screen/CreateChildAccount';
import Login from "./screens/authentication/screen/Login";

// Componentes
import TopBar from './screens/ui/topBar/TopBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <View style={{ flex: 1 }}>
            <TopBar coins={100} />
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeMain">
                <Stack.Screen name="HomeMain" component={HomeScreen} />
                <Stack.Screen name="AddQuestionBank" component={AddQuestionBank} />
                <Stack.Screen name="EditQuestionBank" component={EditQuestionBank} />
                <Stack.Screen name="Questions" component={QuestionsScreen} />
                <Stack.Screen name="AddQuestion" component={AddQuestionScreen} />
                <Stack.Screen name="EditQuestion" component={EditQuestion} />
            </Stack.Navigator>
        </View>
    );
}

function RewardsStack() {
    return (
        <View style={{flex: 1}}>
            <TopBar coins={100}/>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"RewardsMain"}>
                <Stack.Screen name="RewardsMain" component={Rewards} />
                <Stack.Screen name="AddReward" component={AddReward} />
                <Stack.Screen name="EditReward" component={EditReward} />
            </Stack.Navigator>
        </View>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            initialRouteName={"Home"}
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
            <Tab.Screen name="Rewards" component={RewardsStack} options={{ unmountOnBlur: true }} />
            <Tab.Screen name="Home" component={HomeStack} options={{ unmountOnBlur: true }} />
            <Tab.Screen name="Premium" component={PremiumScreen} options={{ unmountOnBlur: true }} />
        </Tab.Navigator>
    );
}

function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Authentication">
            <Stack.Screen name="Authentication" component={Authentication} />
            <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
            <Stack.Screen name="CreateChildAccount" component={CreateChildAccount} />
            <Stack.Screen name="VerificationCode" component={VerificationCode} />
            <Stack.Screen name={"Login"} component={Login}/>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <MainStack />
        </NavigationContainer>
    );
}
