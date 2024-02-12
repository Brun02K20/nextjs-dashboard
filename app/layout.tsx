import { montserrat } from './ui/fonts';
import './ui/global.css'

//para gestion de metadatos
import { Metadata } from 'next';
//para gestion de metadatos
export const metadata: Metadata = {
  //  puede utilizar el title.templatecampo en el metadataobjeto para definir una plantilla para los títulos de sus páginas. 
  // Esta plantilla puede incluir el título de la página y cualquier otra información que desee incluir.
  title: {
    template: '%s | Acme Dashboard', // El %scontenido de la plantilla se reemplazará con el título de la página específica.
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

// Pero ¿qué pasa si deseas agregar un título personalizado para una página específica? 
// Puede hacer esto agregando un metadataobjeto a la propia página. Los metadatos de las páginas anidadas anularán los metadatos de la página principal.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        Esto es parte del Layout
        {children}
        <footer className='py-10 flex justify-center items-center'>
          Hecho con amor por mi
        </footer>
      </body>
    </html>
  );
}
