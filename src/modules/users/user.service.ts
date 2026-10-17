import  bcrypt from 'bcrypt';
//import {bcrypt} from '@types/bcrypt'
import userModel from "./user.model.js";
import AppError from "../../errors/app-error.js";

type UpdateUserInput = {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
};

type UpdatedUser = {
  userId: string;
  name: string;
  email: string;
};
type GetUser = {
  userId: string;
  name: string;
  email: string;
};

const updateUserService = async (
 data: UpdateUserInput,
): Promise<UpdatedUser> => {
  const { userId, name, email, password } = data;

  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (email !== undefined) {
    user.email = email;
  }
  
  if (password !== undefined) {
    const hash = await bcrypt.hash(password,10)
    user.password = hash;
  }

  await user.save();

  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  };
};
// getUser
const getUserService = async (userId: string): Promise<GetUser> => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  };
};
// deleteUserSerivce
// service for delete user

const deleteUserService = async (userId: string): Promise<GetUser> => {
  const user = await userModel.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  };
};

export { updateUserService, getUserService, deleteUserService };
