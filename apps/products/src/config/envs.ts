import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  // PORT_PRODUCTS: number;

  // DB_HOST: string;
  // DB_PORT: number
  // DB_NAME: string
  // DB_USERNAME: string;
  // DB_PASSWORD: string;

  NATS_SERVERS: string[];
}

const envsSchema = joi.object({
  // PORT_PRODUCTS: joi.number().required(),

  // DB_HOST: joi.string().required(),
  // DB_PORT: joi.number().required(),
  // DB_NAME: joi.string().required(),
  // DB_USERNAME: joi.string().required(),
  // DB_PASSWORD: joi.string().required(),

  NATS_SERVERS: joi.array().items(joi.string()).required(),

})
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});


if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;


export const envs = {
  // port_products: envVars.PORT_PRODUCTS,

  // dbhost: envVars.DB_HOST,
  // dbport: envVars.DB_PORT,
  // dbname: envVars.DB_NAME,
  // dbusername: envVars.DB_USERNAME,
  // password: envVars.DB_PASSWORD,

  nats_servers: envVars.NATS_SERVERS,
}