import dotenv from 'dotenv';
dotenv.config();
import {z} from 'zod';
const envSchema=z.object({
  NODE_ENV:z.enum(['production','development','test']).default('development'),
  PORT:z.coerce.number().int().default(3000),
  MONGODB_URI:z.string().min(1),
  JWT_SECRET:z.string()

})
export const env = envSchema.parse(process.env);