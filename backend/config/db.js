import mongoose from "mongoose";

const mongo_url=process.env.Mongo_url;
export const connectDB= async ()=>{
await mongoose.connect(mongo_url)
 .then(()=>{
     console.log("MongoDB connected");
 })
 .catch((err)=>{
     console.log("MongoDB connection faild",err);
 });
 
}