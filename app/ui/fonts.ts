import {Lusitana, Montserrat} from "next/font/google" // importo las fuentes que se me canten el orto

// exporto las fuentes que se me canten el orto
export const montserrat = Montserrat({
    subsets: ["latin"], // los caracteres a usar
    weight: "400" // el peso de la fuente
})

export const lusitana = Lusitana({
    subsets: ["latin"], // los caracteres a usar
    weight: ["400", "700"] // el peso de la fuente
})