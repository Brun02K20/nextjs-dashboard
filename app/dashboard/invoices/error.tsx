// El error.tsxarchivo se puede utilizar para definir un límite de interfaz de usuario para un segmento de ruta.
// Sirve como un todo para errores inesperados y le permite mostrar una interfaz de usuario alternativa a sus usuarios.

'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);
    
    return (
        <main className="flex h-full flex-col items-center justify-center">
        <h2 className="text-center">Something went wrong!</h2>
        <button
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            onClick={
            // Attempt to recover by trying to re-render the invoices route
            () => reset()
            }
        >
            Try again
        </button>
        </main>
    );
}

// Hay algunas cosas que notarás sobre el código anterior:

//"usar cliente" : error.tsxdebe ser un componente de cliente.
//Acepta dos accesorios:
// error: Este objeto es una instancia nativa de JavaScript.Errorobjeto.
// reset: Esta es una función para restablecer el límite de error. Cuando se ejecuta, la función intentará 
// volver a representar el segmento de ruta.
// Cuando intentes eliminar una factura nuevamente, deberías ver la siguiente interfaz de usuario: la de este archivo




// Otra forma de manejar los errores con elegancia es mediante la notFoundfunción. Si bien error.tsxes útil 
// para detectar todos los errores, notFoundse puede utilizar cuando intentas recuperar un recurso que no existe.
// Por ejemplo, visite http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit.


// Este es un UUID falso que no existe en su base de datos.
// Inmediatamente verás error.tsx las activaciones porque esta es una ruta secundaria de /invoices donde error.tsx 
// está definido.
// Sin embargo, si desea ser más específico, puede mostrar un error 404 para indicarle al usuario que no se ha 
// encontrado el recurso al que intenta acceder.