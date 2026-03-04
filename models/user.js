import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: String,
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Number,
      default: 0 // 1 if verified
    },
    image: String,
  },
  { collection: 'users' },
);
const User = mongoose.model("User", userSchema);
export { User };