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
}

const Button: React.FC<ButtonProps> = ({ label, onClick, secondary, href, type = 'button', className = '', danger }) => {
    const btn = (
        <button className={`${styles.button} ${className}`} data-secondary={secondary} data-danger={danger} onClick={onClick} type={type}>
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
