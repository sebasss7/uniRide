import ChatListItem from '@/components/chats/chatListItem';
import { chatsMock } from '@/mock/chats';
import { mensajesMock } from '@/mock/messages';
import { usersMock } from '@/mock/users';
import {
    FlatList,
    SafeAreaView,
    StyleSheet
} from "react-native";

export default function ChatScreen() {
    const myId = '1';

    //Se ejecuta por cada chat existente en chatsMock
    const renderChat = ({ item: chat }: { item: any }) => {

        //Encontrar al otro participante del chat
        const otroUsuarioId = chat.participantes.find((id: string) => id !== myId);

        //Buscar su información
        const otroUsuario = usersMock.find(u => u.id === otroUsuarioId) || usersMock[0];

        //Buscar último mensaje
        const mensajesDelChat = mensajesMock.filter(m => m.chat_id === chat.id);
        const ultimoMensaje = mensajesDelChat[mensajesDelChat.length - 1];

        // 4. Retornamos tu componente ya alimentado con las props correctas
        return (
            <ChatListItem
                chat={chat}
                otroUsuario={otroUsuario}
                ultimoMensaje={ultimoMensaje}
                onPress={() => console.log('Navegar al chat con:', otroUsuario.nombre)}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={chatsMock}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={renderChat}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7FC'
    }
})