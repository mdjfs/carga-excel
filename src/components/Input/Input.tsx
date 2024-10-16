/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react';
import styles from './input.module.scss';
import { formatToDateString } from '@/utils/date';

interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    type?: string;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    formatter?: 'date' | 'integer';
    validator?: {
        type: string;
        message: string;
    },
    required?: boolean
}

const getFormatter = {
    'date': formatToDateString,
    'integer': (val: string) => val.replace(/[^0-9-]/g, '')
} as any

const getRegex = {
    'date': /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    'code': /^\d{6}$/,
    'identifier': /^\d{10}$/
} as any

const Input: React.FC<InputProps> = ({ placeholder, name, value: propValue, onChange, type = "text", onClick, formatter: propFormatter = '', validator, required }) => {
    const formatter = getFormatter[propFormatter]
    const [value, setValue] = useState(propValue && formatter ? formatter(propValue) : propValue)

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => { 
        if(formatter) {
            e.target.value = formatter(e.target.value)
        }
        if(validator) {
            const regex = getRegex[validator.type]
            if(regex) {
                if(e.target.value.match(regex) || (!e.target.value && !required)) {
                    e.target.setCustomValidity('')
                } else {
                    e.target.setCustomValidity(validator.message)  
                }
            }
        }
        setValue(e.target.value)
        if(onChange) onChange(e)
    }


    useEffect(() => {
        if(propValue) setValue(propValue && formatter ? formatter(propValue) : propValue)
    }, [propValue, formatter])

    return (
        <input 
            name={name}
            className={styles.input} 
            type={type}
            placeholder={placeholder} 
            value={value} 
            onChange={changeHandler} 
            onClick={onClick}
            required={required}
            autoComplete='off'
        />
    );
};

export default Input;
