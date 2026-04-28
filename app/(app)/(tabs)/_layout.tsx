import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="home" />
            <Tabs.Screen name="mis-viajes" />
            <Tabs.Screen name="solicitudes" />
            <Tabs.Screen name="perfil" />
        </Tabs>
    );
}