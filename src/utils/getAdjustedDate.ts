import moment from "moment";


export function getAdjustedDate(dateStr: string): string {
    const date = moment(dateStr); // создаём объект moment
    const dayOfWeek = date.day(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday

    let adjusted: moment.Moment;

    if (dayOfWeek === 5) {
        // пятница -> +3 дня -> понедельник
        adjusted = date.add(3, 'days');
    } else if (dayOfWeek === 6) {
        // суббота -> +2 дня -> понедельник
        adjusted = date.add(2, 'days');
    } else if (dayOfWeek === 0) {
        // воскресенье -> +1 день -> понедельник
        adjusted = date.add(1, 'days');
    } else {
        // в остальные дни -> +1 день
        adjusted = date.add(1, 'days');
    }

    return adjusted.format(); // ISO строка
}

export function formatPaymentStatus(dateStr: moment.Moment, received: boolean): string {
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');
    const currentYear = moment().year();
    const dateYear = dateStr.year();

    if (!received && dateStr.isBefore(today, 'day')) {
        return "Ожидается";
    } else if (dateStr.isSame(today, 'day')) {
        return "Сегодня";
    } else if (dateStr.isSame(tomorrow, 'day')) {
        return "Завтра";
    } else {
        // Формат даты в зависимости от года
        const format = dateYear === currentYear ? 'DD MMMM' : 'DD MMMM YYYY';
        return dateStr.format(format);
    }
}