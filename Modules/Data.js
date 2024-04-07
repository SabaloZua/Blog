const getTimeAgo=(date)=>{
 const now = new Date();
 const published = new Date(date);
 const diffInMilliseconds = now - published;
 const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
 const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
 const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
 const diffInWeeks = Math.floor(diffInDays / 7);
 const diffInMonths = Math.floor(diffInDays / 30.44); // Aproximação média
 const diffInYears = Math.floor(diffInDays / 365.25); // Aproximação média

 const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

 if (diffInYears >= 1) {
    return rtf.format(-diffInYears, 'year');
 } else if (diffInMonths >= 1) {
    return rtf.format(-diffInMonths, 'month');
 } else if (diffInWeeks >= 1) {
    return rtf.format(-diffInWeeks, 'week');
 } else if (diffInDays >= 1) {
    return rtf.format(-diffInDays, 'day');
 } else if (diffInHours >= 1) {
    return rtf.format(-diffInHours, 'hour');
 } else {
    return rtf.format(-diffInMinutes, 'minute');
 }
}

module.exports=getTimeAgo