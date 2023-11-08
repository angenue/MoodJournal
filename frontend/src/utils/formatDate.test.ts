import { formatDate, formatDateToDefault } from './formatDate'; // Adjust the import path as needed


  describe('formatDate', () => {
    it('formats a date correctly', () => {
      const inputDate = new Date('2023-01-01T00:00:00');
      const result = formatDate(inputDate);
      expect(result).toBe('Jan 1, 2023');
    });
  });

  describe('formatDateToDefault', () => {
    it('converts a formatted string to a date object', () => {
      const formattedDate = 'Jan 1, 2023';
      const result = formatDateToDefault(formattedDate);
      expect(result).toEqual(new Date('2023-01-01T00:00:00'));
    });
  });

