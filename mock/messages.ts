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
    },
    {
        id: '4',
        chat_id: '2',
        id_emisor: '3', // Carlos
        contenido: 'Oye, ¿todavía tienes lugares para el viaje a Rectoría?',
        fecha: '2026-05-08',
        hora: '09:15',
        leido: true,
    },
    {
        id: '5',
        chat_id: '2',
        id_emisor: '1',
        contenido: 'Sí, me queda uno. ¿Te veo en la parada de la biblio?',
        fecha: '2026-05-08',
        hora: '09:17',
        leido: false,
    },
    {
        id: '6',
        chat_id: '3',
        id_emisor: '4', // Mariana
        contenido: 'Ya voy en camino, tuve un problema con el coche',
        fecha: '2026-05-08',
        hora: '14:20',
        leido: false,
    },
    {
        id: '7',
        chat_id: '2',
        id_emisor: '3', // Carlos
        contenido: 'Vale, nos vemos ahí afuera',
        fecha: '2026-05-08',
        hora: '09:17',
        leido: true,
    },
    {
        id: '8',
        chat_id: '3',
        id_emisor: '4', // Mariana
        contenido: 'Te veo afuera de la entrada de Química?',
        fecha: '2026-05-08',
        hora: '14:21',
        leido: false,
    },
    {
        id: '9',
        chat_id: '3',
        id_emisor: '1',
        contenido: 'Te parece mejor por la entrada de 5 de febrero?',
        fecha: '2026-05-08',
        hora: '14:23',
        leido: false,
    }
];