import mongoose from 'mongoose';


const connectDB =  () =>{
   mongoose.connect(process.env.DB_URI,{dbName:process.env.DB_NAME})
   .then(()=>{
    console.log("Database connected successfully");
   })
   .catch((err)=>{
    console.log("Database connection failed",err.message);
   })
}

export default connectDB;