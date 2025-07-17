// src/app/club/page.js
import React from 'react';
import ClubHero from '@/components/ClubHero/ClubHero';
import ClubBenefits from '@/components/ClubBenefits/ClubBenefits';
import SubscriptionPlans from '@/components/SubscriptionPlans/SubscriptionPlans';
import ClubFAQ from '@/components/ClubFAQ/ClubFAQ';
import styles from './page.module.css'; // Pode ser vazio ou com estilos básicos de main/container

const ClubPage = () => {
  return (
    <main className={styles.main}>
      <ClubHero />
      <ClubBenefits />
      <SubscriptionPlans />
      <ClubFAQ />
    </main>
  );
};

export default ClubPage;