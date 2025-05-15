    import React from 'react';
    import { StatusBar, View } from 'react-native';
    import { NavigationContainer } from '@react-navigation/native';
    import { useNavigationState } from '@react-navigation/native';
    import { createStackNavigator } from '@react-navigation/stack';
    import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
    import Ionicons from 'react-native-vector-icons/Ionicons';
    import { useContext } from 'react';

    // Pantallas principales
    import HomeScreen from './screens/home/Home';
    import QuestionsScreen from './screens/home/screens/Questions';
    import AddQuestionScreen from './screens/home/screens/AddQuestion';
    import EditQuestion from './screens/home/screens/EditQuestion';
    import AddQuestionBank from './screens/home/screens/AddQuestionBank';
    import EditQuestionBank from './screens/home/screens/EditQuestionBank';
    import GameSelector from './screens/home/screens/kid/GameSelector';
    import FlashCardGame from "./screens/home/screens/kid/FlashCardGame";
    import Runner from "./screens/home/screens/kid/game/Runner";

    import Rewards from './screens/rewards/Rewards';
    import AddReward from './screens/rewards/screens/AddReward';
    import EditReward from './screens/rewards/screens/EditReward';

    import PremiumScreen from './screens/premium/Premium';
    import ProfileScreen from './screens/profile/Profile';

    // Autenticación
    import Authentication from './screens/authentication/Authentication';
    import RegisterAccount from './screens/authentication/screen/RegisterAccount';
    import VerificationCode from './screens/authentication/screen/VerificationCode';
    import CreateChildAccount from './screens/authentication/screen/CreateChildAccount';
    import Login from "./screens/authentication/screen/Login";

    // Componentes
    import TopBar from './screens/ui/topBar/TopBar';

    import { AccountProvider } from './context/AccountContext';
    import { GuardianProvider } from './context/GuardianContext';
    import Profile from "./screens/profile/Profile";
    import {AuthContext, AuthProvider} from "./context/AuthContext";
    import {SessionContext, SessionProvider} from "./context/SessionContext";
    import RedeemedRewards from "./screens/rewards/screens/RedeemedRewards";
    import CardData from "./screens/premium/screens/CardData";

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    function getActiveRouteName(state) {
        const route = state.routes[state.index];
        if (route.state) {
            return getActiveRouteName(route.state);
        }
        return route.name;
    }

    function HomeStack() {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeMain">
                <Stack.Screen name="HomeMain" component={HomeScreen} />
                <Stack.Screen name="AddQuestionBank" component={AddQuestionBank} />
                <Stack.Screen name="EditQuestionBank" component={EditQuestionBank} />
                <Stack.Screen name="Questions" component={QuestionsScreen} />
                <Stack.Screen name="AddQuestion" component={AddQuestionScreen} />
                <Stack.Screen name="EditQuestion" component={EditQuestion} />
                <Stack.Screen name="GameSelector" component={GameSelector} />
            </Stack.Navigator>
        );
    }

    function HomeStackWrapper() {
        const routesToHideTopBar = [
            'AddQuestion', 'EditQuestion', 'AddQuestionBank', 'EditQuestionBank'
        ];

        const currentRouteName = useNavigationState(getActiveRouteName);
        const shouldShowTopBar = !routesToHideTopBar.includes(currentRouteName);

        return (
            <View style={{ flex: 1 }}>
                {shouldShowTopBar && <TopBar coins={100} />}
                <HomeStack />
            </View>
        );
    }

    function RewardsStack() {
        return (
            <View style={{ flex: 1 }}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RewardsMain">
                    <Stack.Screen name="RewardsMain" component={Rewards} />
                    <Stack.Screen name="AddReward" component={AddReward} />
                    <Stack.Screen name="EditReward" component={EditReward} />
                    <Stack.Screen name="RedeemedRewards" component={RedeemedRewards} options={{ title: 'Recompensas canjeadas' }} />
                </Stack.Navigator>
            </View>
        );
    }

    function RewardsStackWrapper() {
        const routesToHideTopBar = [
            'AddReward', 'EditReward', 'RedeemedRewards'
        ];

        const currentRouteName = useNavigationState(getActiveRouteName);
        const shouldShowTopBar = !routesToHideTopBar.includes(currentRouteName);

        return (
            <View style={{ flex: 1 }}>
                {shouldShowTopBar && <TopBar />}
                <RewardsStack />
            </View>
        );
    }


    function PremiumStackWrapper() {
        const currentRouteName = useNavigationState(getActiveRouteName);
        const shouldShowTopBar = true;

        return (
            <View style={{ flex: 1 }}>
                {shouldShowTopBar && <TopBar/>}
                <PremiumScreen />
            </View>
        );
    }

    function MainTabs() {
        const { session } = useContext(SessionContext);
        const isKid = session?.profileType === 'kid';

        return (
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Home') iconName = 'home';
                        else if (route.name === 'Rewards') iconName = 'trophy';
                        else if (route.name === 'Premium') iconName = 'star';
                        else if (route.name === 'Profile') iconName = 'person';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#2F5C98',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        borderTopColor: '#e0e0e0',
                        height: 60,
                        paddingBottom: 5,
                        elevation: 10,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Rewards" component={RewardsStackWrapper} options={{ unmountOnBlur: true }} />
                <Tab.Screen name="Home" component={HomeStackWrapper} options={{ unmountOnBlur: true }} />
                {!isKid && (
                    <Tab.Screen name="Premium" component={PremiumStackWrapper} options={{ unmountOnBlur: true }} />
                )}
                <Tab.Screen name="Profile" component={ProfileScreen} options={{ unmountOnBlur: true }} />
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
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="FlashCardGame" component={FlashCardGame} options={{ headerShown: false }} />
                <Stack.Screen name="RunnerGame" component={Runner} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="CardData" component={CardData} />
            </Stack.Navigator>
        );
    }


    export default function App() {
        return (
            <SessionProvider>
                <AuthProvider>
                    <AccountProvider>
                        <GuardianProvider>
                            <NavigationContainer>
                                <StatusBar barStyle="light-content" backgroundColor="black" />
                                <MainStack />
                            </NavigationContainer>
                        </GuardianProvider>
                    </AccountProvider>
                </AuthProvider>
            </SessionProvider>
        );
    }