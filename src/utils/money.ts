export const fromCentsToDollars = (cents: number): number => {
    return Number((cents / 100).toFixed(2));
};

export const fromDollarsToCents = (dollars: number): number => {
    return Number(Math.round(dollars * 100));
};