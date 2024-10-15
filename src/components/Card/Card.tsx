'use client';
import React, { useState } from 'react';
import styles from './card.module.scss';
import NextLink from "next/link"

interface CardProps {
    title?: string;
    body?: React.ReactNode;
    footer?: React.ReactNode;
    href?: string;
    children?: React.ReactNode;
}

const Chevron = (<svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.343 18.657a1 1 0 0 1-.707-1.707l4.95-4.95-4.95-4.95a1 1 0 0 1 1.414-1.414l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-.707.293z"/>
</svg>)

const Card: React.FC<CardProps> = ({ title, body, footer, href, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const crd = (
        <>
            <div className={styles.card} onClick={() => children && setIsOpen(!isOpen)}>
                {title && <div className={styles['card-header']}>
                    {title}
                </div>}
                {body && <div className={styles['card-body']}>
                    {body}
                </div>}
                {footer && <div className={styles['card-footer']}>{footer}</div>}
                {children && <div className={styles['card-chevron']} data-is-open={isOpen}>{Chevron}</div>}
            </div>
            {isOpen && children && <div className={styles.cardContainer}>
                {children}
            </div>}
        </>
    );
    if(href) {
        return <NextLink href={href} style={{textDecoration: 'none'}}>
            {crd}
        </NextLink>
    } return crd
};

export default Card;
