import request from 'supertest';
import app from '../../src/app'; 
import mongoose from 'mongoose';
import UserModel from '../../src/models/user';

// Connect to your test database before the tests run
beforeAll(async () => {
    if (!process.env.MONGO_CONNECTION_STRING) {
      throw new Error('MONGO_CONNECTION_STRING_TEST environment variable is not set.');
    }
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  });
  

// Clear the users collection before each test
beforeEach(async () => {
  await UserModel.deleteMany({});
});

// Disconnect from the test database after all tests have run
afterAll(async () => {
  await mongoose.disconnect();
});

const email = 'test@example.com';
    const password = 'password123';

describe('testing user signup', () => {
  it('should create a new user and checks if email already in use', async () => {
    // First attempt to create a user
    await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(201); 

    // Second attempt with the same email to check if email already exists
    const response = await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(409); 

    // Check the response body for the error message
    expect(response.body.error).toEqual('User with this email address already exists.');
  });

  it('should return a 400 status when password is missing', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        email: email,
        // password is missing
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should return a 400 status when email is missing', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        password: password,
      });
    expect(res.statusCode).toEqual(400);
  });
});

describe('Testing login and logout', () => {
    let sessionCookie: string[];

  beforeAll(async () => {
    // Sign up
    await request(app)
      .post('/api/users/signup')
      .send({ email, password })
      .expect(201); // Assuming 201 is the status code for created

    // Log in
    const res = await request(app)
      .post('/api/users/login')
      .send({ email, password })
      .expect(201); 

    // Extract the session cookie
    sessionCookie = res.headers['set-cookie'][0].split(';')[0];
  });
    
      it('should allow access to a protected route like /api/journals', async () => {
        // Access a protected route using the session cookie
        await request(app)
          .get('/api/journals')
          .set('Cookie', sessionCookie)
          .expect(200); 
      });

      it('should log out the user successfully', async () => {
        // Call the logout endpoint
        await request(app)
          .post('/api/users/logout')
          .set('Cookie', sessionCookie)
          .expect(200); 
    
        // Attempt to access a protected route again, which should fail
        await request(app)
          .get('/api/journals')
          .set('Cookie', sessionCookie)
          .expect(401); 
      });

      it('should not get the authenticated user after logout', async () => {
        // Attempt to get the authenticated user using the old session cookie
        await request(app)
          .get('/api/users/') // Replace with the route that requires authentication
          .set('Cookie', sessionCookie)
          .expect(401); 
      });
    
});
