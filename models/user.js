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
      default: null // if it is not null, when the first user registering and mongoose finding for existing mails as validation, then receives as there is no email initialized but we are looking for it.
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