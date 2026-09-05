// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import styles from "../styles/pages/NotFound.module.scss";

function NotFound() {
    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.content}>
                <span className={styles.errorCode}>404</span>
                <h1 className={styles.title}>Page not found</h1>
                <p className={styles.message}>
                    This page doesn't exist or was moved.
                </p>
                <Link to="/" className={styles.homeButton}>
                    <FiArrowLeft /> Back to home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
