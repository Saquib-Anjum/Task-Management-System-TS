import bcrypt from "bcrypt";
import userModel from "../users/user.model.js";
import type { LoginInput, SignupInput } from "./auth.validator.js";
import generateToken from '../../utils/token.service.js'
// Error class for handling expected authentication errors
export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

// Safe user data returned to the client
type AuthUser = {
  id: string;
  name: string;
  email: string;
};

// Signup service
const signupService = async (data: SignupInput): Promise<AuthUser> => {
  const { name, email, password } = data;

  // Check whether the email is already registered
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new AuthServiceError("Email is already registered", 409);
  }

//password hash
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Create the user in MongoDB
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token:string=generateToken({userId:user._id})
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  } catch (error: unknown) {
    // Handle duplicate email in case of concurrent signup requests
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AuthServiceError("Email is already registered", 409);
    }

    // Let unexpected errors reach the error middleware
    throw error;
  }
};

// Login service
const loginService = async (data: LoginInput): Promise<AuthUser> => {
  const { email, password } = data;

  // Find the user by email
  // .select("+password") is needed if your schema uses select: false
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AuthServiceError("Invalid email or password", 401);
  }


  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AuthServiceError("Invalid email or password", 401);
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
