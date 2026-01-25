import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT_PRODUCTS: number;
  
  DB_HOST: string;
  DB_PORT: number
  DB_NAME: string
  DB_USERNAME: string;
  DB_PASSWORD: string;
}

const envsSchema = joi.object({
  PORT_PRODUCTS: joi.number().required(),

  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_NAME: joi.string().required(),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),

})
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);


if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;


export const envs = {
  port_products: envVars.PORT_PRODUCTS,

  dbhost: envVars.DB_HOST,
  dbport: envVars.DB_PORT,
  dbname: envVars.DB_NAME,
  dbusername: envVars.DB_USERNAME,
  password: envVars.DB_PASSWORD,

}