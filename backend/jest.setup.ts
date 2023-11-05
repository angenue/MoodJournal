// jest.setup.js
import { config } from 'dotenv';
config({ path: '.env.test' });

console.log(process.env.MONGO_CONNECTION_STRING_TEST); // Should output the test database URI
