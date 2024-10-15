'use client'
import React from 'react';
import Button from '../Button';

interface ButtonProps {
    api: string;
    name: string;
    href: string;
}

const DeleteButton: React.FC<ButtonProps> = ({ api, name, href}) => {

    const handleDelete = () => {
        if (confirm(`¿Estás seguro de eliminar esta ${name}?`)) {
            fetch(`/${api}`, {
                method: 'DELETE'
            }).then(() => {
                window.location.href = href 
            });
        }
    }
    return <Button label="Eliminar" danger onClick={handleDelete}/>
};

export default DeleteButton;
