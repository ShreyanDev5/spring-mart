import React from "react";
import styles from "../../styles/components/home/Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Everyday products,<br />
          kept simple.
        </h1>
        
        <p className={styles.heroSubtitle}>
          Browse items, check live stock, and add your favorite products.
        </p>
      </div>
    </section>
  );
};

export default Hero;
