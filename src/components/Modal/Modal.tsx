'use client'
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.scss';

interface ModalProps {
    children: React.ReactNode;
    portal?: boolean; 
}

const Modal: React.FC<ModalProps> = ({ children, portal = true }) => {
    if(!portal) {
        return <div className={styles.modal}>
            <div className={styles['modal-content']}>
                {children}
            </div>
        </div>
    }
    return ReactDOM.createPortal(
        <div className={styles.modal}>
            <div className={styles['modal-content']}>
                {children}
            </div>
        </div>,
        document?.body 
    );
};

export default Modal;