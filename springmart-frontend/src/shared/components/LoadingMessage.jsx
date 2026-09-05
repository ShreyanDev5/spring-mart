import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "../../styles/components/LoadingMessage.module.scss";

function LoadingMessage({
    onDismiss,
    message = "Connecting to server...",
    subtitle = "Free server wakes up on first load. This can take 1–2 minutes.",
}) {
    const [isVisible, setIsVisible] = useState(true);

    function handleDismiss() {
        setIsVisible(false);
        if (onDismiss) {
            onDismiss();
        }
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.loadingMessage}>
            <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
            </div>

            <div className={styles.loadingContent}>
                <div className={styles.textContainer}>
                    <h4 className={styles.message}>{message}</h4>
                    {subtitle && <p className={styles.timeInfo}>{subtitle}</p>}
                </div>

                {onDismiss && (
                    <button
                        className={styles.dismissButton}
                        onClick={handleDismiss}
                        aria-label="Dismiss"
                    >
                        <FiX />
                    </button>
                )}
            </div>
        </div>
    );
}

export default LoadingMessage;