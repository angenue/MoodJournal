// src/util/validateEnv.ts
import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  const envValidators = {
    PORT: port(),
    SESSION_SECRET: str(),
    MONGO_CONNECTION_STRING: str(),
    MONGO_CONNECTION_STRING_TEST: str(),
  };

  return cleanEnv(process.env, envValidators);
}

export default validateEnv();
