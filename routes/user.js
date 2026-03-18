import express from 'express';
import multer from 'multer';
import { userRegister, emailVerify } from '../controllers/user.js';
import { validateRegister } from '../middlewares/validator.js';
export const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function(req,file, cb){
    return cb(null, './images');
  },
  filename: function(req,file,cb){
    return cb(null, Date.now().toLocaleString()+'-'+file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only PNG and JPEG is allowed!'), false);
  }
};
const upload = multer({storage, fileFilter});
userRouter.post('/register',upload.single('image'),validateRegister, userRegister);
// db operations and validations has to be done even before image uploading using multer then we can
// store image filenames with user IDs
userRouter.get('/email-verification', emailVerify);
userRouter.use((err, req, res, next) => {
  // Multer-specific errors have name === 'MulterError'
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }

  // Our custom invalid type error
  /* if (err?.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ success: false, error: err.message });
  } */
  return res.status(500).json({message: err.message});
})
