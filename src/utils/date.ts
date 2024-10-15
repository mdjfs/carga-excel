export function formatToDateString(input: string): string {
    const numbersOnly = input.replace(/\D/g, '');
    
    let formatted = numbersOnly;
    if (numbersOnly.length >= 3) {
        formatted = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    }
    if (numbersOnly.length >= 5) {
        formatted = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
    }
    
    return formatted;
}

export function formatDateToDDMMYYYY(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid Date");
    }

    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function getDate(date: string): Date {
    const [day, month, year] = date.split('/');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(dateObj.getTime())) {
        throw new Error("Fecha inválida");
    }
    return dateObj
}