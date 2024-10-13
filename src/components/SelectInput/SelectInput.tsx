'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Input from '../Input';
import styles from './SelectInput.module.scss';

interface SelectInputProps {
    label?: string;
    placeholder?: string;
    name?: string;
    value?: any;
    options: any[];
    onSearch: (value: any, search: string) => boolean;
    onChange?: (value: string) => void;
    getValue: (value: any) => string;
    getText: (value: any) => string;
    required?: boolean;
    validator?: {
        type: string;
        message: string;
    },
}

const SelectInput: React.FC<SelectInputProps> = ({ name, getValue, getText, options, onChange, onSearch, placeholder, label, value, validator }) => {
    const [selected, setSelected] = useState<any>();
    const [filtered, setFiltered] = useState<any[]>([]);

    const applyFilter = (e: any) => {
        if(selected) setSelected(undefined)
        setFiltered(options.filter((option) => onSearch(option, e.target.value)))
    }

    useEffect(() => {
        if(selected && onChange) onChange(selected)
    }, [selected, onChange])

    useEffect(() => {
        if(value) setSelected(value)
    }, [value])

    return (
        <div className={styles['select-input']}>
            {label && <p className={styles['select-input-label']}>{label}</p>}
            <Input validator={validator} name={name} placeholder={placeholder} value={selected && getValue(selected)} onChange={applyFilter} required />
            {!selected && filtered.length > 0 && <div className={styles['select-input-options']}>
                {filtered.map(option => <div key={option._id} onClick={() => setSelected(option)}>
                    {getText(option)}
                </div>)}
            </div>}
        </div>
    );
};

export default SelectInput;
