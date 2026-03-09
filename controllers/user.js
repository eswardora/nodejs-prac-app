import bcrypt from 'bcrypt';
import { User } from '../models/user.js';


export const userRegister = async (req, res) => {
  try {


    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { name, email, mobile } = req.body;
    const isExists = await User.findOne({ email });
    if (isExists) {
      return res.status(400).json({
        success: 'false',
        message: 'User email exists already'
      })

    }
    const reqUser = {
      name: name.trim(), email, mobile, password: hashedPassword,
      image: (() => {
        if (req.file) {
          return `'/images/'+${req.file.filename}`
        }
        else {
          return null;
        }
      })()
    };
    const user = await User.create(reqUser);


    res.status(201).json({
      success: true,
      message: 'User Successfully Registered',
      user
    });


  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      message: err.message

    })
  }
}