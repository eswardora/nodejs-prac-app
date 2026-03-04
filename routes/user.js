import express from 'express';
import multer from 'multer';
import { userRegister } from '../controllers/user.js';

export const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function(req,file, cb){
    return cb(null, './images');
  },
  filename: function(req,file,cb){
    return cb(null, Date.now()+'-'+file.originalname);
  }
})
const upload = multer({storage: storage});
userRouter.post('/register',upload.single('image'), userRegister);
// db operations and validations has to be done even before image uploading using multer then we can
// store image filenames with user IDs
