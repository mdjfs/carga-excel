export function getForm<T>(fields: Record<keyof T, string>, formData: FormData){ 
    const form: Record<keyof T, string> = {} as Record<keyof T, string>;
    Object.keys(fields).forEach((key) => {
        form[key as keyof T] = formData.get(fields[key as keyof T]) as string;
    });
    return form;
}