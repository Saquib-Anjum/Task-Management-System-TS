import { z} from 'zod';

const signupSchemaValidator = z.object({
 name:z.string().trim().min(2,"name should contain at least 2 character").max(100,"name must be less than 100 character"),
 email:z.string().trim().email("Please Provide valid email address").transform((email)=>email.toLowerCase()),
 password:z.string().min(6,"atleast minimum 2 character").max(50,"password should be at most 50 character"),
})
const loginSchemaValidator =z.object({
  email:z.string().trim().email("Please Provide valid email address").transform((email)=>email.toLowerCase()),
 password:z.string().min(6,"atleast minimum 2 character").max(50,"password should be at most 50 character"),
})


export {signupSchemaValidator,loginSchemaValidator}