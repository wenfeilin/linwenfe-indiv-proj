// Month is not 0-indexed.
export function generateCalendarDates(year: number, month: number): Date[] {
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

// month should not be 0-indexed
export function getMonthName(month: number) {
  switch (month) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
}

export function getDateParts(date: string) {
  const dateParts = date.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  return [+year, +month, +day];
}
