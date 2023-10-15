export function formatDate(inputDate: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = new Date(inputDate).toLocaleDateString('en-US', options);

        const day = new Date(inputDate).getDate();
        const daySuffix = (day >= 11 && day <= 13) ? 'th' : (day % 10 === 1) ? 'st' : (day % 10 === 2) ? 'nd' : (day % 10 === 3) ? 'rd' : 'th';

        return formattedDate.replace(/\d{1,2}(st|nd|rd|th)/, day + daySuffix);
}