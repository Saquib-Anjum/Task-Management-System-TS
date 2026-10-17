import bcrypt from "bcrypt";
import userModel from "../users/user.model.js";
import type { LoginInput, SignupInput } from "./auth.validator.js";
import generateToken from '../../utils/token.service.js'
import AppError from "../../errors/app-error.js";


// Safe user data returned to the client
type AuthUser = {
  id: string;
  name: string;
  email: string;
  token:string;
};

// Signup service
const signupService = async (data: SignupInput): Promise<AuthUser> => {
  const { name, email, password } = data;

  // Check whether the email is already registered
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
   throw new AppError("Email is already registered",400)
    
  }

//password hash
  const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user in MongoDB
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token:string=generateToken({userId:user._id})
    const userId:string = user._id.toString();
    return {
      id: userId,
      name: user.name,
      email: user.email,
      token:token
    };
  
    
};

// Login service
const loginService = async (data: LoginInput): Promise<AuthUser> => {
  const { email, password } = data;

  // Find the user by email
  // .select("+password") is needed if your schema uses select: false
  const user = await userModel.findOne({ email });

  if (!user) {
   throw new AppError('User not found',404)
  }


  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
  throw new AppError("Invalid Credentials ",403)
  }
const token:string=generateToken({userId:user._id})
const userId =user._id.toString();
  // Return safe user data
  return {
    id: userId,
    name: user.name,
    email: user.email,
    token
  };
};

export { signupService, loginService };
