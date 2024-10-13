import React from 'react';
import styles from './pill.module.scss';
import NextLink from 'next/link'

interface ButtonProps {
    label: string;
    status?: 'default' | 'success' | 'error';
    href?: string;
}

const Pill: React.FC<ButtonProps> = ({ label, status = 'default', href }) => {


    const pl = <div className={`${styles.pill} ${styles[status]} `}>
        {label}
    </div>

    if(href) return <NextLink href={href}>{pl}</NextLink>
    else return pl
};

export default Pill;
