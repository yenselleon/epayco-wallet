/**
 * Format a number as Colombian Peso currency
 * @param amount - The amount to format
 * @param options - Optional Intl.NumberFormatOptions
 * @returns Formatted currency string
 */
export const formatCurrency = (
    amount: number | string,
    options?: Intl.NumberFormatOptions
): string => {
    const numAmount = typeof amount === 'string' ? Number(amount) : amount;

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        ...options,
    }).format(numAmount);
};

/**
 * Format a number without currency symbol
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export const formatNumber = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? Number(amount) : amount;
    return numAmount.toLocaleString('es-CO');
};

/**
 * Format time remaining in MM:SS format
 * @param seconds - Total seconds remaining
 * @returns Formatted time string (e.g., "4:35")
 */
export const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a date to a localized string
 * @param date - Date to format
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
        ...options,
    }).format(dateObj);
};

/**
 * Extract first name from full name
 * @param fullName - Full name string
 * @returns First name
 */
export const getFirstName = (fullName: string): string => {
    return fullName.split(' ')[0];
};
