import { Usuario } from '@/types';

export const usersMock: Usuario[] = [
    {
        id: '1',
        rol: 2, // conductor
        nombre: 'Juan Pérez Correa',
        correo: 'juan@alumnos.uaq.mx',
        password: '123456',
        telefono: '4428493309',
        nacimiento: '2000-05-10',
        descripcion: 'Estudiante de ingeniería',
        imagen_usuario: undefined,
    },
    {
        id: '2',
        rol: 1, // pasajero
        nombre: 'Ana García López',
        correo: 'ana@alumnos.uaq.mx',
        password: '123456',
        telefono: '4421234567',
        nacimiento: '2001-03-22',
        descripcion: 'Estudiante de medicina',
        imagen_usuario: undefined,
    },
];