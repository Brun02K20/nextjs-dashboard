// esto de async y await en un componente, solo funciona en los componentes de servidor, no en los que tienen el 

import { Suspense } from "react"
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from "../lib/data"
import { Card } from "../ui/dashboard/cards"
import LatestInvoices from "../ui/dashboard/latest-invoices"
import RevenueChart from "../ui/dashboard/revenue-chart"
import { lusitana } from "../ui/fonts"
import { LatestInvoicesSkeleton, RevenueChartSkeleton } from "../ui/skeletons"

// use-client al principio
export default async function DashboardPage() {
    // pequeño drama con esto

    // const revenue = await fetchRevenue() // supongamos que esto tarda 2segs en cargar
    // const latestInvoices = await fetchLatestInvoices() // y esto tarda 1 segundo en cargar
    const {numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices} = await fetchCardData() 
    // esto implica que minimo habria que esperar 3 segundos antes de que se muestre la pantalla
    // para solucionar este cagadon, se usa el streaming de datos, que nos permite decir: mostrame una parte de lo 
    // que tengo disponible y lo que no tengo disponible, haceme un skeleton por mientras, esta practica se llama
    // SUSPENSE

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card title="Collected" value={totalPaidInvoices} type="collected" />
                <Card title="Pending" value={totalPendingInvoices} type="pending" />
                <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
                <Card
                title="Total Customers"
                value={numberOfCustomers}
                type="customers"
                />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    )
}