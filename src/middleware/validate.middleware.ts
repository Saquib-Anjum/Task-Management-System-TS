import type { RequestHandler } from "express";
import type { ZodType } from "zod";

const validate = (schema:ZodType):RequestHandler=>{
  return (req,res,next)=>{
    const result = schema.safeParse(req.body);
    if(!result.success){
       res.status(400).json({
        success:false,
        message:"Validation Failded",
          errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
    
      })
      return;
      req.body = result.data;
    next();
    }
  }
}
export default validate;