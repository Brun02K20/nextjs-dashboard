import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import { notFound } from 'next/navigation'; // para manejar los 404

// Observe lo similar que es a su /createpágina de factura, excepto que importa un formulario diferente 
// (del edit-form.tsxarchivo). Este formulario debe completarse previamente con defaultValueel nombre del cliente, 
// el monto de la factura y el estado. Para completar previamente los campos del formulario, debe recuperar 
// la factura específica usando id.

// Además de searchParams, los componentes de la página también aceptan un accesorio llamado paramsque puede 
// utilizar para acceder al archivo id. Actualice su <Page>componente para recibir el accesorio:
export default async function UpdateInvoicePage({ params }: { params: { id: string } }) {
    const id = params.id;

    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    if (!invoice) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Invoices', href: '/dashboard/invoices' },
            {
                label: 'Edit Invoice',
                href: `/dashboard/invoices/${id}/edit`,
                active: true,
            },
            ]}
        />
        <Form invoice={invoice} customers={customers} />
        </main>
    );
}