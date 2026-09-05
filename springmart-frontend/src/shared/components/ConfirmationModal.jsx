import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";
import styles from "../../styles/components/ConfirmationModal.module.scss";

function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    loading = false,
}) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        function handleEsc(event) {
            if (event.key === "Escape" && isOpen && !loading) {
                onClose();
            }
        }

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, loading, onClose]);

    if (!isOpen) {
        return null;
    }

    function getIcon() {
        switch (type) {
            case "danger":
            case "warning":
                return <FiAlertTriangle />;
            case "info":
                return <FiInfo />;
            case "success":
                return <FiCheckCircle />;
            default:
                return <FiAlertTriangle />;
        }
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget && !loading) {
            onClose();
        }
    }

    return ReactDOM.createPortal(
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div
                className={styles.modalContent}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className={`${styles.iconWrapper} ${styles[type]}`}>
                    {getIcon()}
                </div>

                <div className={styles.textContainer}>
                    <h3 id="modal-title" className={styles.title}>{title}</h3>
                    <p className={styles.message}>{message}</p>
                </div>

                <div className={styles.actions}>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirmButton} ${styles[type]}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ConfirmationModal;