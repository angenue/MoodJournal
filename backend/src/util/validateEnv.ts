import { cleanEnv, str, port } from 'envalid';

// Define the shape of your environment variables
interface Env {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  SESSION_SECRET: string;
  MONGO_CONNECTION_STRING?: string;
  MONGO_CONNECTION_STRING_TEST?: string;
}

function validateEnv(): Env {
  // Define the validators for the environment variables
  const envValidators = {
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
    PORT: port({ default: 5000 }),
    SESSION_SECRET: str(),
    MONGO_CONNECTION_STRING: str({ default: '' }),
    MONGO_CONNECTION_STRING_TEST: str({ default: '' }),
  };

  // Validate the environment variables
  const env = cleanEnv(process.env, envValidators) as Env;

  // Perform runtime checks to ensure the environment variables are present
  if (process.env.NODE_ENV === 'development' && !env.MONGO_CONNECTION_STRING) {
    throw new Error('Missing MONGO_CONNECTION_STRING for development environment');
  } else if (process.env.NODE_ENV === 'test' && !env.MONGO_CONNECTION_STRING_TEST) {
    throw new Error('Missing MONGO_CONNECTION_STRING_TEST for test environment');
  } else if (process.env.NODE_ENV === 'production' && !env.MONGO_CONNECTION_STRING) {
    throw new Error('Missing MONGO_CONNECTION_STRING for production environment');
  }

  return env;
}

export default validateEnv;
