import { chatsMock } from "@/mock/chats";
import { mensajesMock } from "@/mock/messages";
import { Chat, Mensaje } from "@/types";
import { create } from "zustand";

interface ChatState {
  chats: Chat[];
  mensajes: Mensaje[];

  getOrCreateChat: (
    usuarioAId: string,
    usuarioBId: string,
    viajeId?: string,
  ) => Chat;

  enviarMensaje: (chatId: string, emisorId: string, contenido: string) => void;

  marcarMensajesLeidos: (chatId: string, usuarioActualId: string) => void;
}

const pad = (value: number) => value.toString().padStart(2, "0");

const getCurrentDate = () => {
  const now = new Date();

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}`;
};

const getCurrentTime = () => {
  const now = new Date();

  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export const useChatStore = create<ChatState>((set, get) => ({
  chats: chatsMock,
  mensajes: mensajesMock,

  getOrCreateChat: (usuarioAId, usuarioBId, viajeId) => {
    const existingChat = get().chats.find((chat) => {
      const sameParticipants =
        chat.participantes.includes(usuarioAId) &&
        chat.participantes.includes(usuarioBId);

      const sameTrip = viajeId ? chat.viaje_id === viajeId : true;

      return sameParticipants && sameTrip;
    });

    if (existingChat) {
      return existingChat;
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      participantes: [usuarioAId, usuarioBId],
      viaje_id: viajeId,
    };

    set((state) => ({
      chats: [newChat, ...state.chats],
    }));

    return newChat;
  },

  enviarMensaje: (chatId, emisorId, contenido) => {
    const text = contenido.trim();

    if (!text) return;

    const newMessage: Mensaje = {
      id: Date.now().toString(),
      chat_id: chatId,
      id_emisor: emisorId,
      contenido: text,
      fecha: getCurrentDate(),
      hora: getCurrentTime(),
      leido: false,
    };

    set((state) => ({
      mensajes: [...state.mensajes, newMessage],
    }));
  },

  marcarMensajesLeidos: (chatId, usuarioActualId) =>
    set((state) => ({
      mensajes: state.mensajes.map((mensaje) =>
        mensaje.chat_id === chatId &&
        mensaje.id_emisor !== usuarioActualId &&
        !mensaje.leido
          ? { ...mensaje, leido: true }
          : mensaje,
      ),
    })),
}));
