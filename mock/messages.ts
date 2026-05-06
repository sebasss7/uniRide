import { Mensaje } from '@/types';

export const mensajesMock: Mensaje[] = [
    {
        id: '1',
        chat_id: '1',
        id_emisor: '1', // Juan
        contenido: 'Ya estoy en la ubicación, no te veo',
        fecha: '2026-05-04',
        hora: '16:36',
        leido: true,
    },
    {
        id: '2',
        chat_id: '1',
        id_emisor: '2', // Ana
        contenido: 'qué onda estoy en la entrada del oxxo',
        fecha: '2026-05-04',
        hora: '16:36',
        leido: true,
    },
    {
        id: '3',
        chat_id: '1',
        id_emisor: '1', // Juan
        contenido: 'Vale te veo ahí',
        fecha: '2026-05-04',
        hora: '16:36',
        leido: false, //Para marcar el chat como "no leído" con el punto azuñ
    }
];