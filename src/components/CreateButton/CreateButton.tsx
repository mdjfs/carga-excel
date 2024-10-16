'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef, useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { useRouter } from 'next/navigation';
import { ButtonProps } from '../Button/Button';

interface CreateButtonProps extends ButtonProps {
    createAction: (formData: FormData) => Promise<any>;
    children: React.ReactNode;
    label: string;
    redirectUri?: string;
}

const CreateButton: React.FC<CreateButtonProps> = ({ label, children, createAction, redirectUri, ...buttonProps }) => {
    const router = useRouter();
    const [create, setCreate] = useState(false);
    const ref = useRef<HTMLFormElement>(null);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.stopPropagation();
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = await createAction(formData);
        setCreate(false);
        if(redirectUri) {
            router.push(redirectUri.replace('[id]', data?._id))
        } else {
            router.refresh()
        }
    }, [router, createAction, redirectUri]);

    return <>
        {create && <Modal>
            <form onSubmit={handleSubmit} ref={ref}>
                {children}
                <div style={{display: 'flex', gap: 10, marginTop: 30}}>
                    <Button secondary={true} label="Cancelar" onClick={() => setCreate(false)} /> 
                    <Button label="Continuar" type="submit" />
                </div>
            </form>
        </Modal>}
        <Button {...buttonProps} label={label} onClick={() => setCreate(true)} />
    </>
};

export default CreateButton;
