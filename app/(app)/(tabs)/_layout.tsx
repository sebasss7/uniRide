import { Tabs } from 'expo-router';
import { CarFront, House, MessageCircle, UserRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

function IconInicio({ focused }: { focused: boolean }) {
    return (
        <View style={[styles.iconContainer, focused && styles.iconActive]}>
            <House size={20} color="#1a3a5c" />
        </View>
    );
}

function IconViajes({ focused }: { focused: boolean }) {
    return (
        <View style={[styles.iconContainer, focused && styles.iconActive]}>
            <CarFront size={20} color="#1a3a5c" />
        </View>
    );
}

function IconChat({ focused }: { focused: boolean }) {
    return (
        <View style={[styles.iconContainer, focused && styles.iconActive]}>
            <MessageCircle size={20} color="#1a3a5c" />
        </View>
    );
}

function IconPerfil({ focused }: { focused: boolean }) {
    return (
        <View style={[styles.iconContainer, focused && styles.iconActive]}>
            <UserRound size={20} color="#1a3a5c" />
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#1a3a5c',
                tabBarInactiveTintColor: '#7a9bb5',
                tabBarLabelStyle: styles.tabLabel,
                tabBarShowLabel: true,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ focused }) => <IconInicio focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="my-trips"
                options={{
                    title: 'Viajes',
                    tabBarIcon: ({ focused }) => <IconViajes focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ focused }) => <IconChat focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ focused }) => <IconPerfil focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#dceef9',
        height: 70,
        paddingBottom: 10,
        paddingTop: 8,
        shadowColor: '#1a3a5c',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 10,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 20,
    },
    iconActive: {
        backgroundColor: '#dceef9',
    },
});
