import connectDB from './config/database.js';
import {env} from './config/env.js'
import app from './app.js';
const startServer=async():Promise<void>=>{
  try{
    await connectDB();
const PORT:number=env.PORT|3000;
app.listen(PORT,()=>{
  console.log(`server is running on ${PORT} | http://localhost:${PORT}`);
})

  }catch(err:unknown){
    if(err instanceof Error){
      console.log("failed to start server",err.message);
    }else{
      console.log("failed to start server",err)
    }
  }
}
startServer()