const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365.25;

export const getYearsToMaturity = (maturityDate?: string | Date): number | null => {
    if (!maturityDate) return null;

    const maturity = new Date(maturityDate);
    const now = new Date();

    if (Number.isNaN(maturity.getTime()) || maturity <= now) {
        return null;
    }

    return (maturity.getTime() - now.getTime()) / MS_IN_YEAR;
};
