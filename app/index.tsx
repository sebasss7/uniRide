import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function Index() {
    const usuario = useAuthStore((state) => state.usuario);

    return (
        <Redirect href={usuario ? '/home' as any : '/login' as any} />
    );
}