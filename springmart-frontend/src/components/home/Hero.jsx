import React from "react";
import styles from "../../styles/components/home/Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Curated essentials,<br />
          engineered simply.
        </h1>
        
        <p className={styles.heroSubtitle}>
          A minimal catalog featuring instant multi-field search and real-time inventory.
        </p>
      </div>
    </section>
  );
};

export default Hero;
