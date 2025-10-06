import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTanggalIndo(dateInput: string | Date): string {
    if (!dateInput) return '-';

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return '-';

    const hari = String(date.getDate()).padStart(2, '0');
    const bulan = String(date.getMonth() + 1).padStart(2, '0');
    const tahun = date.getFullYear();

    return `${hari}-${bulan}-${tahun}`;
}
