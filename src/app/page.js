// src/app/page.js

import HeroSection from '@/components/HeroSection/HeroSection'; // Importe a HeroSection
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import JackbooClub from '@/components/JackbooClub/JackbooClub';
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts';
import FriendsShop from '@/components/FriendsShop/FriendsShop';
import Championship from '@/components/Championship/Championship';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection /> {/* POSICIONE A HERO SECTION AQUI NO TOPO */}
      
      <HowItWorks />
      
      <JackbooClub />

      <FeaturedProducts />

      <FriendsShop />

      <Championship />

      {/* Outras seções virão aqui (como depoimentos e rodapé) */}
    </main>
  );
}