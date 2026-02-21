import mongoose from "mongoose";
async function connectMongoDB(uri){
  try{
  const mongoConn = await mongoose.connect(uri);
  console.log("MongoDB Connected successfully");
  return mongoConn;
  }
  catch(err){ console.log("MongoDB Connection Failed")}
}

export { connectMongoDB };