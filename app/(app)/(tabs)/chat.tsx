import ChatListItem from '@/components/chats/chatListItem';
import { chatsMock } from '@/mock/chats';
import { mensajesMock } from '@/mock/messages';
import { usersMock } from '@/mock/users';
import { useAuthStore } from '@/store/authStore';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View
} from "react-native";

export default function ChatScreen() {
    const { usuario } = useAuthStore();
    const myId = usuario?.id;
    //ACtualizar el puntito azul cuando se renderice nuevamente la página de chats
    const isFocused = useIsFocused();

    //Guardar el input de searchBar
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const filterChats = useMemo(() => {
        const chatsPropios = chatsMock.filter(chat => {
            return myId && chat.participantes.includes(myId);
        });

        if (!searchQuery.trim()) {
            return chatsPropios;
        }

        return chatsPropios.filter(chat => {
            const otroUsuarioId = chat.participantes.find((id: string) => id !== myId);
            const otroUsuario = usersMock.find(u => u.id === otroUsuarioId) || usersMock[0];

            return otroUsuario.nombre.toLowerCase().includes(searchQuery.toLowerCase());
        })
    }, [searchQuery, isFocused, myId]);

    //Se ejecuta por cada chat existente en chatsMock
    const renderChat = ({ item: chat }: { item: any }) => {

        //Encontrar al otro participante del chat
        const otroUsuarioId = chat.participantes.find((id: string) => id !== myId);

        //Buscar su info
        const otroUsuario = usersMock.find(u => u.id === otroUsuarioId) || usersMock[0];

        //Buscar último mensaje
        const mensajesDelChat = mensajesMock.filter(m => m.chat_id === chat.id);
        const ultimoMensaje = mensajesDelChat[mensajesDelChat.length - 1];

        return (
            <ChatListItem
                chat={chat}
                otroUsuario={otroUsuario}
                ultimoMensaje={ultimoMensaje}
                onPress={() => {
                    //Ruta incluyendo el grupo (app)
                    router.push({
                        pathname: '/(app)/chats/[id]',
                        params: { id: chat.id }
                    });
                }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filterChats}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.searchSection}>
                        <View style={styles.searchBar}>
                            <Search size={20} color='#7A9BB5' />
                            <TextInput
                                style={styles.searchInput}
                                placeholder='Buscar'
                                placeholderTextColor={'#7A9BB5'}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>
                }
                renderItem={renderChat}
                extraData={isFocused}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f7fc',
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 24,
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dceef9',
        borderRadius: 20,
        paddingHorizontal: 16,
        // paddingTop: 20,
        height: 44,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a3a5c',
    }
})