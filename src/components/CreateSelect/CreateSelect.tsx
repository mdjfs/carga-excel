'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styles from './CreateSelect.module.scss';
import SelectInput from '../SelectInput';
import Modal from '../Modal';
import Button from '../Button';

interface CreateSelectProps {
    createAction: (formData: FormData) => Promise<any>;
    children: React.ReactNode;
    name: string;
    data: any[];
    keyValue?: string
    keyText?: string;
    selected?: any;
    placeholder?: string;
    searchKeys?: string[];
    required?: boolean;
    validator?: {
        type: string;
        message: string;
    },
    inputName?: string;
}

const CreateSelect: React.FC<CreateSelectProps> = ({ name, validator, required, children, createAction, data, keyValue, keyText, selected: propSelected, placeholder, searchKeys = ['name'], inputName }) => {
    const [create, setCreate] = useState(false);
    const [selected, setSelected] = useState<any>();

    useEffect(() => {
        if(propSelected) setSelected(propSelected)
    }, [propSelected])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.stopPropagation();
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await createAction(formData);
        setCreate(false)
    };


    return (
        <>
            <div className={styles['create-select-container']}>
                <SelectInput 
                    label={`Selecciona un ${name}`}
                    options={data}
                    onSearch={(option, search) => {
                        if(!search) return false;
                        for(const key of searchKeys) {
                            if(option[key].toLowerCase().includes(search.toLowerCase())) return true;
                        }
                        return false;
                    }}
                    onChange={(value) => setSelected(value)}
                    value={selected}
                    getValue={(option) => option[keyValue || 'name']}
                    getText={(option) => option[keyText || 'name']}
                    name={inputName || keyValue}
                    placeholder={placeholder}
                    required={required}
                    validator={validator}
                />
                <p>¿No encuentras el {name}? Haz <b onClick={() => setCreate(true)}>click acá</b> para crearlo</p>
            </div>
            {create && <Modal>
                <form onSubmit={handleSubmit}>
                    {children}
                    <div style={{display: 'flex', gap: 10, marginTop: 30}}>
                        <Button secondary={true} label="Cancelar" onClick={() => setCreate(false)} /> 
                        <Button type="submit" label="Continuar" />
                    </div>
                </form>
            </Modal>}
        </>
    );
};

export default CreateSelect;
