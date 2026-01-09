import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT_GATEWAY: number;
  PORT_PRODUCTS:number;
  LOCALHOST_PRODUCTS:string;
}

const envsSchema = joi.object({
  PORT_GATEWAY: joi.number().required(),
  PORT_PRODUCTS: joi.number().required(),
  LOCALHOST_PRODUCTS: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port_gateway: envVars.PORT_GATEWAY,
  port_products: envVars.PORT_PRODUCTS,
  localhost_products: envVars.LOCALHOST_PRODUCTS,
}