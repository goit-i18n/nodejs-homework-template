// import { func } from 'joi';
import mongoose from 'mongoose';
const {Schema, model}=mongoose;

// Numele modelului -> colectia cu litera mare si la singular
const schema = new Schema(  {
    password: {
        type: String,
        required: [true, 'Password is required'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: {
        type: String,
        default: null,
      },
  });
const User = model('User', schema);

export default User;