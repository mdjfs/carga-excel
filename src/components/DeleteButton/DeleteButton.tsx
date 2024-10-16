/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react';
import Button from '../Button';
import { useRouter } from 'next/navigation';

interface ButtonProps {
    href?: string;
    action: () => Promise<any>;
    small?: boolean;
}

const DeleteButton: React.FC<ButtonProps> = ({ href, small, action }) => {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.stopPropagation();
        event.preventDefault();
        if(confirm(`¿Estás seguro de eliminarlo?`)) {
            await action();
            if(href) router.push(href)
        }
    };

    return <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <Button label="Eliminar" danger type="submit" small={small} />
    </form>
};

export default DeleteButton;
