import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please create your Username!"],
    unique: [true, "Username Exist"],
  },
  password: {
    type: String,
    required: [true, "Please create your password!"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  address: {
    type: String,
  },
  profile: {
    type: String,
  }
});

export default mongoose.model.Users || mongoose.model('User', UserSchema)
