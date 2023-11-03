import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  const envValidators = {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
  };

  if (process.env.NODE_ENV === 'test') {
    envValidators.MONGO_CONNECTION_STRING = str({ default: 'mongodb://localhost:27017/moodjournal_test' });
  }

  return cleanEnv(process.env, envValidators);
}

export default validateEnv();
