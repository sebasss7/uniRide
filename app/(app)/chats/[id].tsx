import { useLocalSearchParams } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function ChatPrivateScreen() {
    //Id del chat que se seleccionó en la pantalla anterior (mensajes)
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

            <SafeAreaView style={styles.inner}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Chat ID: {id}</Text>
                </View>

                <View style={styles.messagesContainer}>
                    <Text>FlatList de los mensajes</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text>Barra para escribir</Text>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f7fc',
    },
    inner: {
        flex: 1,
    },
    header: {
        padding: 16,
        backgroundColor: '#dceef9',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a3a5c',
    },
    messagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        padding: 16,
        backgroundColor: '#fff',
    }
});