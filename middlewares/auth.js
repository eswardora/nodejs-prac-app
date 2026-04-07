import jwt from "jsonwebtoken";
import log from "../helpers/logger.js";
export async function userVerify(req,res,next){

  const token = req.headers.authorization.split(' ')[1];
  const isVerified = jwt.verify(token, process.env.SECRET);
  if(isVerified){
    log(`${req.path} - JWT Token Verified - ${token}`);
    next();
  }else{
    res.status(400).json({message:"Invalid token"});
  }
  
}

