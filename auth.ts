// Es una buena práctica aplicar hash a las contraseñas antes de almacenarlas en una base de datos. 
// El hashing convierte una contraseña en una cadena de caracteres de longitud fija, que parece aleatoria, 
// lo que proporciona una capa de seguridad incluso si los datos del usuario están expuestos.

// En su seed.js archivo, utilizó un paquete llamado bcrypt para codificar la contraseña del usuario antes de 
// almacenarla en la base de datos. Lo usará nuevamente más adelante en este capítulo para comparar que la 
// contraseña ingresada por el usuario coincida con la de la base de datos. Sin embargo, deberá crear un archivo 
// independiente para el bcrypt paquete. Esto se debe a que bcrypt se basa en las API de Node.js que no están 
// disponibles en Next.js Middleware.

// Crea un nuevo archivo llamado auth.ts (que este de aca)que difunda tu authConfig objeto:

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}


export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) return user;
            }

            console.log('Invalid credentials');
            return null; // Finalmente, si las contraseñas coinciden, desea devolver el usuario; de lo contrario, regrese nullpara evitar que el usuario inicie sesión.
            },
        }),
    ],
});

// A continuación, deberá agregar la providers opción para NextAuth.js. providers es una matriz donde enumera 
// diferentes opciones de inicio de sesión, como Google o GitHub. Para este curso, nos centraremos en el uso 
// del proveedor de Credenciales.solo.

// El proveedor de Credenciales permite a los usuarios iniciar sesión con un nombre de usuario y una contraseña.

// Agregar la funcionalidad de inicio de sesión
// Puede utilizar la authorize función para manejar la lógica de autenticación. De manera similar a las 
// Acciones del servidor, puede utilizar zod para validar el correo electrónico y la contraseña antes de verificar 
// si el usuario existe en la base de datos: