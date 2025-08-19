export const pluralize = (num: number, one: string, few: string, many: string) => {
    if (num % 10 === 1 && num % 100 !== 11) return `${num} ${one}`;
    if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) {
        return `${num} ${few}`;
    }
    return `${num} ${many}`;
};