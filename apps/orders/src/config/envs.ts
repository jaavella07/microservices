import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT_ORDERS: number;
  LOCALHOST_ORDERS: string;

  LOCALHOST_PRODUCTS: string;
  PORT_PRODUCTS: number;

}

const envsSchema = joi.object({
  PORT_ORDERS: joi.number().required(),
  LOCALHOST_ORDERS: joi.string().required(),

  LOCALHOST_PRODUCTS: joi.string().required(),
  PORT_PRODUCTS: joi.number().required(),

})
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);


if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;


export const envs = {
  port_orders: envVars.PORT_ORDERS,
  localhost_orders: envVars.LOCALHOST_ORDERS,

  localhost_products: envVars.LOCALHOST_PRODUCTS,
  port_products: envVars.PORT_PRODUCTS,


}