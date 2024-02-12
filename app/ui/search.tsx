'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams() // declaro los parametros de busqueda que son preexistentes en la url, forma de recueprar los url params desde el cliente
  const pathname = usePathname() // recordemos que este se usa solo en client rendering
  const {replace} = useRouter()
  const handleSearch = useDebouncedCallback((term : string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term) // si el usuario escribe algo en el input, setea un nuevo query param con lo ingresado
    } else {
      params.delete("query") // si no, lo borra
    }
    params.set("page", "1")
    replace(`${pathname}?${params.toString()}`) // actualizo la url
  }, 750) // useDebouncedCallback(metodo, cantidad de milisegundos)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()} // esto lo que me permit es actualizar el valor por defecto del input a lo ingresado en el query param
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
