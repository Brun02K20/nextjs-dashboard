'use server';
// Al agregar 'use server', marca todas las funciones exportadas dentro del archivo como 
// funciones del servidor. Estas funciones del servidor se pueden importar luego a los componentes 
// Cliente y Servidor, lo que los hace extremadamente versátiles.

// NO SE EJECUTAN NI SE ENVIAN AL CLIENTE

// para validaciones de formularios: zod
// npm i zod
import {z} from "zod" 
import { sql } from '@vercel/postgres';

// Next.js tiene una caché de enrutador del lado del cliente que almacena los segmentos de ruta en el 
// navegador del usuario durante un tiempo. Junto con la captación previa , este caché garantiza que los 
// usuarios puedan navegar rápidamente entre rutas y al mismo tiempo reducir la cantidad de solicitudes 
// realizadas al servidor.
// Dado que está actualizando los datos que se muestran en la ruta de facturas, desea borrar este caché y activar 
// una nueva solicitud al servidor. Puedes hacer esto con la revalidatePathfunción de Next.js:

// AHHHHHHHHHH, VENDRIA A SER COMO: DALE PIBE, REACTUALIZAME LOS DATOS
import { revalidatePath } from 'next/cache';

// para redirigir nomas
import { redirect } from 'next/navigation';

// para el logIn
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// para validacion de formulario
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};



// funciona asi el ZOD: 
// PASO 1: CREAR ESQUEMA: PARA VALIDAR EL ESQUEMA, IGUAL A LA BD
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});


// pero como nosotros en el formulario no tenemos ni la fecha ni el id: 
// lo que hace esto es no validar esas 2 cosas
const CreateInvoice = FormSchema.omit({ id: true, date: true });
//  contiene el estado pasado desde el useFormState gancho. No lo usarás en la acción de este ejemplo, pero es un accesorio obligatorio.
export async function createInvoice(prevState: State, formData: FormData)  {
    // safeParse()devolverá un objeto que contiene un campo successo error. Esto ayudará a manejar la validación con mayor elegancia sin tener que poner esta lógica dentro del try/catchbloque.
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Si validatedFieldsno tiene éxito, devolvemos la función antes de tiempo con los mensajes de error de Zod.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Finalmente, dado que maneja la validación del formulario por separado, fuera de su bloque try/catch, puede devolver un mensaje específico para cualquier error de la base de datos
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // inserto en la base de datos
    try {
        // esto es una FUNCION
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Invoice."
        }
    }

    revalidatePath('/dashboard/invoices'); // LE INDICO LA RUTA DONDE DEBE REACTUALIZAR, QUE DEBE POR ASI DECIR: RE RENDERIZAR CON LAS NUEVAS COSAS
    redirect('/dashboard/invoices');
}



const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Si validatedFieldsno tiene éxito, devolvemos la función antes de tiempo con los mensajes de error de Zod.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    
    // Finalmente, dado que maneja la validación del formulario por separado, fuera de su bloque try/catch, puede devolver un mensaje específico para cualquier error de la base de datos
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    
    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }
    
    revalidatePath('/dashboard/invoices');
    revalidatePath(`/dashboard/invoices/${id}/edit`);
    redirect('/dashboard/invoices');
}


// Dado que esta acción se llama en la /dashboard/invoicesruta, no es necesario llamarla redirect. 
// La llamada revalidatePathactivará una nueva solicitud del servidor y volverá a representar la tabla.
export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice'); // Me muestra un error en desarrollo
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
}

//Observe cómo redirect se llama fuera del try/catch bloque. Esto se debe a que redirect funciona arrojando 
// un error, que el bloque detectaría catch. Para evitar esto, puedes llamar redirect después try/catch . 
// redirectsólo sería accesible si trytiene éxito.

// Ver estos errores es útil durante el desarrollo, ya que puede detectar cualquier problema potencial a tiempo. 
// Sin embargo, también desea mostrar los errores al usuario para evitar una falla abrupta y permitir que su 
// aplicación continúe ejecutándose.

// Aquí es donde entra el archivo error.tsx de Next.js










// LOGIN
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
        switch (error.type) {
            case 'CredentialsSignin':
            return 'Invalid credentials.';
            default:
            return 'Something went wrong.';
        }}
        throw error;
    }
}
// Si hay un 'CredentialsSignin' error, desea mostrar un mensaje de error apropiado. 
// Puede obtener información sobre los errores de NextAuth.js en la documentación.