import React from "react";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import styles from "../styles/components/Toast.module.scss";

function ToastContent({ type, message, closeToast }) {
    function getIcon() {
        switch (type) {
            case "success":
                return <FaCheckCircle />;
            case "error":
                return <FaTimesCircle />;
            default:
                return <FaInfoCircle />;
        }
    }

    return (
        <div className={styles.toastContent}>
            <div className={`${styles.toastIcon} ${styles[type]}`}>{getIcon()}</div>
            <div className={styles.toastMessage}>{message}</div>
            <button
                className={styles.toastCloseButton}
                onClick={(event) => {
                    event.stopPropagation();
                    if (closeToast) {
                        closeToast();
                    } else {
                        toast.dismiss();
                    }
                }}
                aria-label="Close"
            >
                <FiX />
            </button>
        </div>
    );
}

export function showSuccessToast(message) {
    toast.success(<ToastContent type="success" message={message} />, {
        icon: false,
        closeButton: false,
        autoClose: 3000,
        hideProgressBar: true,
    });
}

export function showErrorToast(message) {
    toast.error(<ToastContent type="error" message={message} />, {
        icon: false,
        closeButton: false,
        autoClose: 4000,
        hideProgressBar: true,
    });
}

export function showInfoToast(message) {
    toast.info(<ToastContent type="info" message={message} />, {
        icon: false,
        closeButton: false,
        autoClose: 3000,
        hideProgressBar: true,
    });
}