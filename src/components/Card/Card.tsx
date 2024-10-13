import React from 'react';
import styles from './card.module.scss';
import NextLink from "next/link"

interface CardProps {
    title?: string;
    body?: React.ReactNode;
    footer?: React.ReactNode;
    href?: string;
}

const Card: React.FC<CardProps> = ({ title, body, footer, href }) => {
    const crd = (
        <div className={styles.card}>
            {title && <div className={styles['card-header']}>
                {title}
            </div>}
            {body && <div className={styles['card-body']}>
                {body}
            </div>}
            {footer && <div className={styles['card-footer']}>{footer}</div>}
        </div>
    );
    if(href) {
        return <NextLink href={href} style={{textDecoration: 'none'}}>
            {crd}
        </NextLink>
    } return crd
};

export default Card;
