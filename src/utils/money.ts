export function formatToARS(number: number) {

    if (isNaN(number)) {
        throw new Error("El valor proporcionado no es un número válido.");
    }

    const formatted = number.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return formatted;
}