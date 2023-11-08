import * as api from './journal_api';

(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: '1', title: 'Test Journal' }]),
  })
) as jest.Mock;

describe('API functions', () => {
    beforeEach(() => {
      (fetch as jest.Mock).mockClear();
    });
  
    it('getLoggedInUser returns a user when fetch response is ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'user123', name: 'John Doe' }),
      });
      const user = await api.getLoggedInUser();
      expect(fetch).toHaveBeenCalledWith("/api/users", { method: "GET" });
      expect(user).toEqual({ id: 'user123', name: 'John Doe' });
    });
  
    it('signUp creates a new user when fetch response is ok', async () => {
      const mockUser = { email: 'test@example.com', password: 'password123', confirmPassword: 'password123' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'user123', ...mockUser }),
      });
      const user = await api.signUp(mockUser);
      expect(fetch).toHaveBeenCalledWith("/api/users/signup", expect.any(Object));
      expect(user).toEqual({ id: 'user123', ...mockUser });
    });
  
    it('login logs in a user when fetch response is ok', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'password123' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'user123', ...mockCredentials }),
      });
      const user = await api.login(mockCredentials);
      expect(fetch).toHaveBeenCalledWith("/api/users/login", expect.any(Object));
      expect(user).toEqual({ id: 'user123', ...mockCredentials });
    });
  
    it('logout calls fetch with the correct endpoint', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
      await api.logout();
      expect(fetch).toHaveBeenCalledWith("/api/users/logout", { method: "POST" });
    });
  
    it('fetchJournalsByYear returns journals for the specified year', async () => {
      const year = 2023;
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', year }]),
      });
      const journals = await api.fetchJournalsByYear(year);
      expect(fetch).toHaveBeenCalledWith(`api/journals/${year}`, { method: "GET" });
      expect(journals).toEqual([{ id: '1', year }]);
    });
  
    it('fetchJournalsByYearAndMonth returns journals for the specified year and month', async () => {
      const year = 2023;
      const month = 1; // January
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', year, month }]),
      });
      const journals = await api.fetchJournalsByYearAndMonth(year, month);
      expect(fetch).toHaveBeenCalledWith(`api/journals/${year}/${month}`, { method: "GET" });
      expect(journals).toEqual([{ id: '1', year, month }]);
    });
  
    it('createJournal posts a new journal entry', async () => {
      const newJournal = { mood: 'happy', journalEntry: 'Great day!', selectedDate: new Date() };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: '2', ...newJournal }),
      });
      const journal = await api.createJournal(newJournal);
      expect(fetch).toHaveBeenCalledWith("/api/journals", expect.any(Object));
      expect(journal).toEqual({ id: '2', ...newJournal });
    });
  
    it('updateJournal updates an existing journal entry', async () => {
        const journalId = '2';
        const updatedJournal = { mood: 'sad', journalEntry: 'Bad day.' };
        (fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: journalId, ...updatedJournal }),
        });
        const journal = await api.updateJournal(journalId, updatedJournal);
        expect(fetch).toHaveBeenCalledWith(`/api/journals/${journalId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedJournal),
        });
        expect(journal).toEqual({ id: journalId, ...updatedJournal });
      });
    
      it('deleteJournal deletes a journal entry', async () => {
        const journalId = '2';
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
        await api.deleteJournal(journalId);
        expect(fetch).toHaveBeenCalledWith(`/api/journals/${journalId}`, {
          method: "DELETE"
        });
      });
    });

    describe('API Error Handling', () => {
        // Setup common mock error response
        const mockErrorResponse = {
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Error message' }),
        };
      
        beforeEach(() => {
          (fetch as jest.Mock).mockImplementation(() => Promise.resolve(mockErrorResponse));
        });
      
        it('getLoggedInUser throws an error when fetch response is not ok', async () => {
          await expect(api.getLoggedInUser()).rejects.toThrow('Error message');
        });
      
        it('signUp throws an error when fetch response is not ok', async () => {
          const credentials = { email: '', password: '', confirmPassword: '' };
          await expect(api.signUp(credentials)).rejects.toThrow('Error message');
        });
      
        it('login throws an error when fetch response is not ok', async () => {
          const credentials = { email: '', password: '' };
          await expect(api.login(credentials)).rejects.toThrow('Error message');
        });
      
        it('logout throws an error when fetch response is not ok', async () => {
          await expect(api.logout()).rejects.toThrow('Error message');
        });
      
        it('fetchJournals throws an error when fetch response is not ok', async () => {
          await expect(api.fetchJournals()).rejects.toThrow('Error message');
        });
      
        it('fetchJournalsByYear throws an error when fetch response is not ok', async () => {
          const year = 2023;
          await expect(api.fetchJournalsByYear(year)).rejects.toThrow('Error message');
        });
      
        it('fetchJournalsByYearAndMonth throws an error when fetch response is not ok', async () => {
          const year = 2023;
          const month = 1;
          await expect(api.fetchJournalsByYearAndMonth(year, month)).rejects.toThrow('Error message');
        });
      
        it('createJournal throws an error when fetch response is not ok', async () => {
          const newJournal = { mood: 'happy', journalEntry: 'Great day!' };
          await expect(api.createJournal(newJournal)).rejects.toThrow('Error message');
        });
      
        it('updateJournal throws an error when fetch response is not ok', async () => {
          const journalId = '2';
          const updatedJournal = { mood: 'sad', journalEntry: 'Bad day.' };
          await expect(api.updateJournal(journalId, updatedJournal)).rejects.toThrow('Error message');
        });
      
        it('deleteJournal throws an error when fetch response is not ok', async () => {
          const journalId = '2';
          await expect(api.deleteJournal(journalId)).rejects.toThrow('Error message');
        });
      });
      
    
