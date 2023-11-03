import request from 'supertest';
import app from '../../src/app';

let authenticatedAgent: request.SuperAgentTest; // Declare a variable to hold the authenticated agent

beforeAll(async () => {
    authenticatedAgent = request.agent(app); // Create an agent to persist cookies

  
    // Simulate a login request
    await authenticatedAgent.post('/api/users/login').send({
      email: 'test@test.com',
      password: '12345',
    });
  });

  afterAll(async () => {
    await authenticatedAgent.post('/api/users/logout');
  });

describe('GET /api/journals', () => {
    it('responds with 201 status when user is authenticated', async () => {
      // Make a request to the protected route
      const response = await authenticatedAgent.get('/api/journals');

      console.log('Response Status:', response.status);
  
      expect(response.status).toBe(201);
    });
  
    it('responds with 401 status when user is not authenticated', async () => {
      // Make a request without authenticating
      const response = await request(app).get('/api/journals');

      console.log('Response Status:', response.status);
  
      expect(response.status).toBe(401);
    });
  });

describe('POST /api/journals', () => {
  it('responds with 201 Created', async () => {
    const response = await request(app)
      .post('/api/journals')
      .send({
        mood: 'happy',
        journalEntry: 'This is a test journal entry.'
      });

    expect(response.status).toBe(201);
  });
});

