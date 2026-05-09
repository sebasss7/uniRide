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
    {
        id: '3',
        rol: 1, // pasajero
        nombre: 'Carlos Ruiz',
        correo: 'carlos.ruiz@alumnos.uaq.mx',
        password: '123456',
        telefono: '4429876543',
        nacimiento: '1999-11-05',
        descripcion: 'Estudiante de Derecho.',
        imagen_usuario: undefined,
    },
    {
        id: '4',
        rol: 2, // conductor
        nombre: 'Mariana Vega',
        correo: 'mariana.vega@alumnos.uaq.mx',
        password: '123456',
        telefono: '4425557788',
        nacimiento: '2002-01-15',
        descripcion: 'Ingeniería en Automatización.',
        imagen_usuario: undefined,
    }
];