import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    // Puede utilizar la pages opción para especificar la ruta para las páginas personalizadas de inicio de sesión, 
    // cierre de sesión y error. Esto no es obligatorio, pero al agregarlo signIn: '/login' a nuestra pages opción, 
    // el usuario será redirigido a nuestra página de inicio de sesión personalizada, 
    // en lugar de a la página predeterminada de NextAuth.js.
    pages: {
        signIn: '/login',
    },
    // Esto evitará que los usuarios accedan a las páginas del panel a menos que hayan iniciado sesión.
    // lógica para proteger sus rutas
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
        if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
            return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

// La authorized callback se utiliza para verificar si la solicitud está autorizada para acceder a una página a 
// través de Next.js Middleware. Se llama antes de que se complete una solicitud y recibe un objeto con las 
// propiedades auth y request. La auth propiedad contiene la sesión del usuario y la request propiedad contiene la 
// solicitud entrante.

// La opción providers es una matriz donde enumera diferentes opciones de inicio de sesión. 
// Por ahora, es una matriz vacía para satisfacer la configuración de NextAuth. 
// Obtendrá más información al respecto en la sección Agregar el proveedor de credenciales.

// A continuación, deberá importar el authConfigobjeto a un archivo de middleware. En la raíz de su proyecto, cree un archivo llamado middleware.ts