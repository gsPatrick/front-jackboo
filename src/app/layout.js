// src/app/layout.js
import './globals.css';
import { Luckiest_Guy, Mali } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { AuthProvider } from '@/contexts/AuthContext'; // <-- IMPORTAR O PROVIDER

const luckiestGuy = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-luckiest-guy',
});

const mali = Mali({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mali',
});

export const metadata = {
  title: 'JackBoo E-commerce',
  description: 'Um parque de diversões digital, seguro e educativo para a criatividade das crianças.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${luckiestGuy.variable} ${mali.variable}`}>
        <AuthProvider> {/* --- ENVOLVE TUDO COM O PROVIDER --- */}
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider> {/* --- FECHA O PROVIDER --- */}
      </body>
    </html>
  );
}