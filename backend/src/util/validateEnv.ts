// src/util/validateEnv.ts
import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  const envValidators = {
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
    PORT: port(),
    SESSION_SECRET: str(),
    MONGO_CONNECTION_STRING: str(),
    MONGO_CONNECTION_STRING_TEST: str({ default: 'mongodb://localhost:27017/moodjournal_test' }),
  };

  const env = cleanEnv(process.env, envValidators);

  if (process.env.NODE_ENV === 'test' && !env.MONGO_CONNECTION_STRING_TEST) {
    throw new Error('MONGO_CONNECTION_STRING_TEST environment variable is not set.');
  }

  return env;
}

export default validateEnv();
