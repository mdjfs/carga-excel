import React from 'react';
import styles from './button.module.scss';
import NextLink from "next/link"

interface ButtonProps {
    label: string;
    onClick?: () => void;
    href?: string;
    secondary?: boolean;
    type?: 'button' | 'submit';
    className?: string;
    danger?: boolean;
    success?: boolean;
    small?: boolean;
    warning?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, secondary, href, type = 'button', className = '', danger, success, small, warning }) => {
    const btn = (
        <button className={`${styles.button} ${className}`} data-warning={warning} data-small={small} data-secondary={secondary} data-danger={danger} data-success={success} onClick={onClick} type={type}>
            {label}
        </button>
    );
    if(href) {
        return <NextLink href={href}>
            {btn}
        </NextLink>
    } else return btn
};

export default Button;
