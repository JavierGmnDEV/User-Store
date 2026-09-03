import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  DB_NAME: get('DB_NAME').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  EMAIL: get('EMAIL').required().asString(),
  PASSWORD:get('PASSWORD').required().asString(),
  APIURL : get('APIURL').required().asString()
}



