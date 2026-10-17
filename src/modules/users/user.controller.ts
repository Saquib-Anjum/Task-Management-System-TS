import type {Request, Response,NextFunction } from 'express';
import AppError from '../../errors/app-error.js';
import { deleteUserService, getUserService, updateUserService } from './user.service.js';

const getuser = async ( req:Request , res:Response,next:NextFunction):Promise<void>=>{
  try{
  if (!req.user) {
  throw new AppError("Authentication required", 401);
}


  const {userId} = req.user;
  const user =await getUserService(userId);
  if(!user){
    throw new AppError("User not found", 404)
  }
  res.status(200).json({
    success:true,
    message:"here is user",
    data:user
  })
  }catch(err:unknown){
next(err);
  }
}

// ---Update User......
const updateUser = async ( req:Request  , res:Response,next:NextFunction)=>{
  try{
const {name,email,password} = req.body;
if (!req.user) {
  throw new AppError("Authentication required", 401);
}


const {userId}  = req.user;
    const user = await updateUserService({
      userId,
      name,
      email,
      password
    });
    if(!user){
      throw new AppError("User not found",404)
    };
    res.status(201).json({
      success:true,
      message:"user updated successfully",
      data:user
    })
  }catch(err){
next(err);
  }
}

// delete User
const deleteUser = async( req:Request , res:Response,next:NextFunction)=>{
  try{
   //const data = req.body;
   if (!req.user) {
  throw new AppError("Authentication required", 401);
}
   const {userId} = req.user;
   const deletedUser = await deleteUserService(userId);
   if(!deletedUser){
    throw new AppError('User not found',404);
   }
   res.status(202).json({
    success:true,
    message:'User deleted successfully',
    data:deletedUser,
   })
  }catch(err){
 next(err)
  }
}

export {getuser,updateUser,deleteUser};