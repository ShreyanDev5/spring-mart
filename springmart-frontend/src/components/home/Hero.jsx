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
          Browse items, check live stock, and find what you need.
        </p>
      </div>
    </section>
  );
};

export default Hero;
