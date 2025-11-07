export const generateICS = (event) => {
  const startDate = new Date(event.date);
  const endDate = new Date(event.date);
  endDate.setHours(startDate.getHours() + 1); // Assume 1-hour event

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vireon//Earnings Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@vireon.ai`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:Earnings: ${event.ticker} (${event.name})`,
    `DESCRIPTION:EPS Estimate: ${event.estimate}\\nMarket Cap: ${event.marketCap}\\nTime: ${event.time}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
};