// Month is not 0-indexed.
export function generateCalendarDates( year: number, month: number): Date[] {
    const numDatesInCalendar = 7 * 6; // 7 days x 6 rows
    let calendarDates = [];
    const monthIndex = month - 1;
    const firstDateOfMonth = new Date(year, monthIndex, 1);
    const firstDayOfMonth = firstDateOfMonth.getDay(); // The day is 0-indexed.

    // Create 42 dates to populate the monthly calendar, consisting of the dates for the current 
    // month and some dates from the previous and next months to fill the rest of the calendar. 
    let day = 1 - firstDayOfMonth;

    for (let i = 0; i < numDatesInCalendar; i++, day++) {
        calendarDates.push(new Date(year, monthIndex, day));
    }

    return calendarDates;
}

// function daysInMonth(month: number, year: number) {
//     // Getting the 0th day of the next month gets the last day of the current month. 
//     return new Date(year, month, 0).getDate();
// }