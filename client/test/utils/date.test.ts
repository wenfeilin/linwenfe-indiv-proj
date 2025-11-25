import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDateParts, getMonthName } from "../../src/utils/date";
// generateCalendarDates
// getMonthName
// getDateParts

describe("date util functions", () => {
  describe("generateCalendarDates", () => {
    it("generates 42 dates for a full calendar", () => {
      
    });

    it("", () => {
      
    });

    it("", () => {
      
    });
  });

  describe("getMonthName", () => {
    it("returns the correct month name", () => {
      expect(getMonthName(1)).toBe("January");
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