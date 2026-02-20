import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT_ORDERS: number;
  LOCALHOST_ORDERS: string;

  LOCALHOST_PRODUCTS: string;
  PORT_PRODUCTS: number;

  NATS_SERVERS: string[];


  DB_HOST_ORDERS: string;
  DB_PORT_ORDERS: number
  DB_NAME_ORDERS: string
  DB_USERNAME_ORDERS: string;
  DB_PASSWORD_ORDERS: string;
}

const envsSchema = joi.object({
  PORT_ORDERS: joi.number().required(),
  LOCALHOST_ORDERS: joi.string().required(),

  LOCALHOST_PRODUCTS: joi.string().required(),
  PORT_PRODUCTS: joi.number().required(),

  NATS_SERVERS: joi.array().items(joi.string()).required(),

  DB_HOST_ORDERS: joi.string().required(),
  DB_PORT_ORDERS: joi.number().required(),
  DB_NAME_ORDERS: joi.string().required(),
  DB_USERNAME_ORDERS: joi.string().required(),
  DB_PASSWORD_ORDERS: joi.string().required(),


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
  port_orders: envVars.PORT_ORDERS,
  localhost_orders: envVars.LOCALHOST_ORDERS,

  localhost_products: envVars.LOCALHOST_PRODUCTS,
  port_products: envVars.PORT_PRODUCTS,

  nats_servers: envVars.NATS_SERVERS,

  dbhost: envVars.DB_HOST_ORDERS,
  dbport: envVars.DB_PORT_ORDERS,
  dbname: envVars.DB_NAME_ORDERS,
  dbusername: envVars.DB_USERNAME_ORDERS,
  password: envVars.DB_PASSWORD_ORDERS,

}
