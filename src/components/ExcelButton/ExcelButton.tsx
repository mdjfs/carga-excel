'use client'
import React, { useState } from 'react';
import Button from '../Button';

interface ButtonProps {
    tramitId: string
    name: string
}

const ExcelButton: React.FC<ButtonProps> = ({ tramitId, name }) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true)
        const response = await fetch(`/api/excel?tramitId=${tramitId}`);
    
        if (!response.ok) {
        console.error(`Error en la solicitud: ${response.statusText}`);
        return;
        }

        const blob = await response.blob();
        const urlBlob = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = name + '.xls';
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(urlBlob);
        a.remove();
        setLoading(false)
    }
    return <Button label={loading ? 'Exportando...' : 'Exportar a Excel'} success onClick={loading ? ()=>{} : handleExport}/>
};

export default ExcelButton;
