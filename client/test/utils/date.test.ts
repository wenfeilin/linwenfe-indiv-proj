import { describe, it, expect } from "vitest";
import { generateCalendarDates, getDateParts, getMonthName } from "../../src/utils/date";

describe("date util functions", () => {
  describe("generateCalendarDates", () => {
    it("generates 42 dates for a full calendar", () => {
      const calendarDates = generateCalendarDates(2025, 6);

      expect(calendarDates.length).toBe(42);
      expect(calendarDates[0].getFullYear()).toBe(2025);
      expect(calendarDates[0].getDate()).toBe(1);
      expect(calendarDates[41].getMonth()).toBe(6); // last calendar day = 7-12-2025
      expect(calendarDates[41].getDate()).toBe(12);
    });
  });

  describe("getMonthName", () => {
    it("returns the correct month name", () => {
      expect(getMonthName(1)).toBe("January");
      expect(getMonthName(2)).toBe("February");
      expect(getMonthName(3)).toBe("March");
      expect(getMonthName(4)).toBe("April");
      expect(getMonthName(5)).toBe("May");
      expect(getMonthName(6)).toBe("June");
      expect(getMonthName(7)).toBe("July");
      expect(getMonthName(8)).toBe("August");
      expect(getMonthName(9)).toBe("September");
      expect(getMonthName(10)).toBe("October");
      expect(getMonthName(11)).toBe("November");
      expect(getMonthName(12)).toBe("December");
    });
  });

  describe("getDateParts", () => {
    it("returns the correct year, month, and day", () => {
      const date = "1-1-2024";
      const [year, month, day] = getDateParts(date);

      expect(year).toBe(1);
      expect(month).toBe(1);
      expect(day).toBe(2024);
    });
  });
});