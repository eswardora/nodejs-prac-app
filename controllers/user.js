import bcrypt from 'bcrypt';
import { User } from '../models/user.js';


export const userRegister = async (req,res)=>{
  try{

    try{
      var isExists = User.findOne({email});
    }catch(err){
      if(err.message.includes("Cannot access 'email' before initialization")){}
    }
    
    if(isExists){
      res.status(400).json({
        success: 'false',
        message: 'User email exists already'
      })
    }

    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const { name, email, mobile } = req.body;

    const user = User.create({ name, email, mobile, password: hashedPassword,
      image: '/images/'+req.file.filename
    });


    res.status(201).json({
      success:true,
      message: 'User Successfully Registered',
      user
    });


  }catch(err){

    res.status(400).json({
      success: false,
      message: err.message

    })
  }
}