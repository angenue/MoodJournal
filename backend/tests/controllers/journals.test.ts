import request from 'supertest';
import app from '../../src/app'; 
import mongoose from 'mongoose';
import UserModel from '../../src/models/user';
import { mongoStore } from '../../src/app';
import JournalModel from '../../src/models/journal';

beforeAll(async () => {
    if (!process.env.MONGO_CONNECTION_STRING_TEST) {
        throw new Error('MONGO_CONNECTION_STRING_TEST environment variable is not set.');
      }
      await mongoose.connect(process.env.MONGO_CONNECTION_STRING_TEST);
})

// Clear the collections before each test
beforeEach(async () => {
    await UserModel.deleteMany({});
    await JournalModel.deleteMany({});
  });
  
  // Disconnect from the test database after all tests have run
  afterAll(async () => {
    console.log('Disconnecting database...');
    await mongoose.disconnect();
    console.log('Database disconnected');
    
    if (mongoose.connection.readyState !== 0) {
      console.error('Database did not close!');
    }
  
    // Close the session store
    await mongoStore.close();
  });

  // Format a date to 'YYYY-MM-DD'
function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }



  //begin tests
  describe('Journal API Endpoints', () => {
    let sessionCookie: string[];
    let journalIds: string[] = [];
    const year = new Date().getFullYear(); // Use the current year for the test
    const month = new Date().getMonth() + 1; // Use the current month for the test
    // today's date in 'YYYY-MM-DD' format
  const today = formatDate(new Date());
  
    beforeAll(async () => {
        await request(app)
        .post('/api/users/signup')
        .send({ email: 'journaltest@example.com', password: 'password123' })
        .expect(201);
  
      // Log in the user
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ email: 'journaltest@example.com', password: 'password123' })
        .expect(201);
  
      sessionCookie = loginResponse.headers['set-cookie'][0].split(';')[0];
    });
  
    beforeEach(async () => {
        journalIds = []; // Reset the array before each test
      // default journal entry
      const journalData = [
        { mood: 'happy', journalEntry: 'This is a test' },
        { mood: 'sad', journalEntry: 'test number 2 here we go' },
        { mood: 'content', journalEntry: 'this is test number 3' }
      ];
  
      for (const data of journalData) {
        try {
            const response = await request(app)
              .post('/api/journals')
              .set('Cookie', sessionCookie)
              .send(data)
              .expect(201); 
              const journalId = response.body._id;
              expect(mongoose.Types.ObjectId.isValid(journalId)).toBe(true);
              journalIds.push(journalId);
          } catch (error) {
            console.error('Error creating journal entry:', error);
            fail('Failed to create journal entry');
          }
      }
    });
  
    afterEach(async () => {
      // Clean up any state that should not persist between tests
      await Promise.all(journalIds.map(id =>
        request(app)
          .delete(`/api/journals/${id}`)
          .set('Cookie', sessionCookie)
      ));
      journalIds = [];
    });
  
    afterAll(async () => {
      // Any cleanup logic after all tests have run
      await JournalModel.deleteMany({});
      await UserModel.deleteMany({});
    });


    it('should create a journal', async() => {
        const newJournalResponse = await request(app)
        .post('/api/journals')
        .set('Cookie', sessionCookie)
        .send({ mood: 'angry', journalEntry: 'hi this is another test' })
        .expect(201); 

        //saving the id so we can delete it
      const newJournalId = newJournalResponse.body._id; 

      expect(newJournalResponse.body.mood).toEqual('angry');
      expect(newJournalResponse.body.journalEntry).toEqual('hi this is another test')
      expect(formatDate(new Date(newJournalResponse.body.date))).toEqual(today);


      journalIds.push(newJournalId);
    })
      

    it('should get all journals', async() => {
      //getting all journals
      const getAllResponse = await request(app)
      .get('/api/journals')
      .set('Cookie', sessionCookie)
      .expect(200); // Expecting a 200 OK response

    // Verify that the response body is an array
    expect(Array.isArray(getAllResponse.body)).toBe(true);

      //Verify that both journal IDs are in the response
      const retrievedJournalIds = getAllResponse.body.map((journal: { _id: string; }) => journal._id);

      journalIds.forEach(createdId => {
        expect(retrievedJournalIds).toContain(createdId);
      });
    });


    it('should get journal that matches id', async() => {

        const validJournalId = journalIds[0]; // Take the first ID for testing
       
            const getResponse = await request(app)
              .get(`/api/journals/${validJournalId}`)
              .set('Cookie', sessionCookie)
              .expect(200); // Expecting a 200 OK response
      
            // Verify that the retrieved journal matches the expected ID
            expect(getResponse.body).toHaveProperty('_id', validJournalId);
            expect(getResponse.body.mood).toEqual('happy');
  expect(getResponse.body.journalEntry).toEqual('This is a test');
  expect(formatDate(new Date(getResponse.body.date))).toEqual(today);
        
    });



    it('should get journal by year',async () => {
        const response = await request(app)
      .get(`/api/journals/${year}`)
      .set('Cookie', sessionCookie)
      .expect(200);

      const journals = response.body;
    journals.forEach((journal: { date: string | number | Date; }) => {
      expect(new Date(journal.date).getFullYear()).toEqual(year);
    });
        
    });

    it('should get journal by month and year', async() => {
        const response = await request(app)
      .get(`/api/journals/${year}/${month}`)
      .set('Cookie', sessionCookie)
      .expect(200);

    // Verify that all returned journals have dates within the specified year and month
    const journals = response.body;
    journals.forEach((journal: { date: string | number | Date; }) => {
      const journalDate = new Date(journal.date);
      expect(journalDate.getFullYear()).toEqual(year);
      expect(journalDate.getMonth() + 1).toEqual(month); // +1 because getMonth() is zero-indexed
    });

    });
  
    it('should update a journal entry', async () => {
        const validJournalId = journalIds[0];
      // Test for updating the journal entry created in beforeEach
      const updatedJournalResponse = await request(app)
        .patch(`/api/journals/${validJournalId}`)
        .set('Cookie', sessionCookie)
        .send({ mood: 'content', journalEntry: 'hi i am updating this entry' })
        .expect(200); 

        expect(updatedJournalResponse.body.mood).toEqual('content');
      expect(updatedJournalResponse.body.journalEntry).toEqual('hi i am updating this entry')
      expect(formatDate(new Date(updatedJournalResponse.body.date))).toEqual(today);

      // fetch the journal entry to verify the update was successful
  const fetchUpdatedJournalResponse = await request(app)
  .get(`/api/journals/${validJournalId}`)
  .set('Cookie', sessionCookie)
  .expect(200);

// Verify the fetched journal entry has the updated values
expect(fetchUpdatedJournalResponse.body.mood).toEqual('content');
expect(fetchUpdatedJournalResponse.body.journalEntry).toEqual('hi i am updating this entry');
expect(formatDate(new Date(updatedJournalResponse.body.date))).toEqual(today);
    });
  
    it('should delete journals', async () => {
        const journalIdToDelete = journalIds[0]; // Take the first ID for deletion

        await request(app)
        .delete(`/api/journals/${journalIdToDelete}`)
        .set('Cookie', sessionCookie)
        .expect(204); 

         // fetch the deleted journal entry
         const getResponse = await request(app)
         .get(`/api/journals/${journalIdToDelete}`)
         .set('Cookie', sessionCookie)
         .expect(404); 

  expect(getResponse.body.error).toEqual('Journal entry not found');
    });
  
  });


  //testing errors
  describe('Journal API errors', () => {
    let sessionCookie: string[];
    let journalIds: string[] = [];
    const year = new Date().getFullYear(); // Use the current year for the test
    const month = new Date().getMonth() + 1; // Use the current month for the test
    // today's date in 'YYYY-MM-DD' format
  const today = formatDate(new Date());
  
    beforeAll(async () => {
        await request(app)
        .post('/api/users/signup')
        .send({ email: 'journaltest@example.com', password: 'password123' })
        .expect(201);
  
      // Log in the user
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ email: 'journaltest@example.com', password: 'password123' })
        .expect(201);
  
      sessionCookie = loginResponse.headers['set-cookie'][0].split(';')[0];
    });
  
    beforeEach(async () => {
        journalIds = []; // Reset the array before each test
      // default journal entry
      const journalData = [
        { mood: 'happy', journalEntry: 'This is a test' },
        { mood: 'sad', journalEntry: 'test number 2 here we go' },
        { mood: 'content', journalEntry: 'this is test number 3' }
      ];
  
      for (const data of journalData) {
        try {
            const response = await request(app)
              .post('/api/journals')
              .set('Cookie', sessionCookie)
              .send(data)
              .expect(201); 
              const journalId = response.body._id;
              expect(mongoose.Types.ObjectId.isValid(journalId)).toBe(true);
              journalIds.push(journalId);
          } catch (error) {
            console.error('Error creating journal entry:', error);
            fail('Failed to create journal entry');
          }
      }
    });
  
    afterEach(async () => {
      // Clean up any state that should not persist between tests
      await Promise.all(journalIds.map(id =>
        request(app)
          .delete(`/api/journals/${id}`)
          .set('Cookie', sessionCookie)
      ));
      journalIds = [];
    });
  
    afterAll(async () => {
      // Any cleanup logic after all tests have run
      await JournalModel.deleteMany({});
      await UserModel.deleteMany({});
    });


    it('should throw error is mood is null', async() => {
        const newJournalResponse = await request(app)
        .post('/api/journals')
        .set('Cookie', sessionCookie)
        .send({journalEntry: 'hi this is another test' })
        .expect(400);

      expect(newJournalResponse.body.error).toEqual("Mood is required");
     
    })


    it('should throw error for invalid journal id', async() => {
            const getResponse = await request(app)
              .get(`/api/journals/123`) //using 123 because its not a mongoose id format
              .set('Cookie', sessionCookie)
              .expect(400); //invalid journal id
    
            expect(getResponse.body.error).toEqual('Invalid journal id');
    });

    it('should throw error for journal not found', async() => {

        const validJournalId = journalIds[0]; // Take the first ID for testing
       
            const getResponse = await request(app)
              .get(`/api/journals/${validJournalId}`)
              .set('Cookie', sessionCookie)
              .expect(200); // Expecting a 200 OK response
      
            // Verify that the retrieved journal matches the expected ID
            expect(getResponse.body).toHaveProperty('_id', validJournalId);
            expect(getResponse.body.mood).toEqual('happy');
  expect(getResponse.body.journalEntry).toEqual('This is a test');
  expect(formatDate(new Date(getResponse.body.date))).toEqual(today);
        
    });



    it('should get journal by year',async () => {
        const response = await request(app)
      .get(`/api/journals/${year}`)
      .set('Cookie', sessionCookie)
      .expect(200);

      const journals = response.body;
    journals.forEach((journal: { date: string | number | Date; }) => {
      expect(new Date(journal.date).getFullYear()).toEqual(year);
    });
        
    });

    it('should get journal by month and year', async() => {
        const response = await request(app)
      .get(`/api/journals/${year}/${month}`)
      .set('Cookie', sessionCookie)
      .expect(200);

    // Verify that all returned journals have dates within the specified year and month
    const journals = response.body;
    journals.forEach((journal: { date: string | number | Date; }) => {
      const journalDate = new Date(journal.date);
      expect(journalDate.getFullYear()).toEqual(year);
      expect(journalDate.getMonth() + 1).toEqual(month); // +1 because getMonth() is zero-indexed
    });

    });
  
    it('should update a journal entry', async () => {
        const validJournalId = journalIds[0];
      // Test for updating the journal entry created in beforeEach
      const updatedJournalResponse = await request(app)
        .patch(`/api/journals/${validJournalId}`)
        .set('Cookie', sessionCookie)
        .send({ mood: 'content', journalEntry: 'hi i am updating this entry' })
        .expect(200); 

        expect(updatedJournalResponse.body.mood).toEqual('content');
      expect(updatedJournalResponse.body.journalEntry).toEqual('hi i am updating this entry')
      expect(formatDate(new Date(updatedJournalResponse.body.date))).toEqual(today);

      // fetch the journal entry to verify the update was successful
  const fetchUpdatedJournalResponse = await request(app)
  .get(`/api/journals/${validJournalId}`)
  .set('Cookie', sessionCookie)
  .expect(200);

// Verify the fetched journal entry has the updated values
expect(fetchUpdatedJournalResponse.body.mood).toEqual('content');
expect(fetchUpdatedJournalResponse.body.journalEntry).toEqual('hi i am updating this entry');
expect(formatDate(new Date(updatedJournalResponse.body.date))).toEqual(today);
    });
  
    it('should delete journals', async () => {
        const journalIdToDelete = journalIds[0]; // Take the first ID for deletion

        await request(app)
        .delete(`/api/journals/${journalIdToDelete}`)
        .set('Cookie', sessionCookie)
        .expect(204); 

         // fetch the deleted journal entry
         const getResponse = await request(app)
         .get(`/api/journals/${journalIdToDelete}`)
         .set('Cookie', sessionCookie)
         .expect(404); 

  expect(getResponse.body.error).toEqual('Journal entry not found');
    });

  });


  describe('User not authenticated errors', () => {
    //let sessionCookie: string[];

    it('should get user not authenticated for creating journal', async() => {
        await request(app)
        .post('/api/journals')
        .send({ mood: 'angry', journalEntry: 'hi this is another test' })
        .expect(401);  //user not authenticated
    })
      

    it('should get user not authenticated for getting all journals', async() => {
      //getting all journals
      await request(app)
      .get('/api/journals')
      .expect(401); 
    });

    it('should get user not authenticated for getting a journal', async() => {
           await request(app)
              .get(`/api/journals/65469b63858039d742d0ac92`)
              .expect(401);
        
    });

    it('should get user not authenticated for getting journal by year',async () => {
       await request(app)
      .get(`/api/journals/2023`)
      .expect(401);
        
    });

    it('should get user not authenticated for getting journal by year and month', async() => {
       await request(app)
      .get(`/api/journals/2023/10`)
      .expect(401);

    });
  
    it('should get user not authenticated for updating journal', async () => {
      await request(app)
        .patch(`/api/journals/65469b63858039d742d0ac92`)
        .send({ mood: 'content', journalEntry: 'hi i am updating this entry' })
        .expect(401); 
    });
  
    it('should get user not authenticated for deleting journal', async () => {
        await request(app)
        .delete(`/api/journals/65469b63858039d742d0ac92`)
        .expect(401); 

    });

  });


  
