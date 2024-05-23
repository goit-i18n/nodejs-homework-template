// import { func } from 'joi';
import mongoose from 'mongoose';
const {Schema, model}=mongoose;

// Numele modelului -> colectia cu litera mare si la singular
const schema = new Schema(  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  });
const Contact = model('Contact', schema);

export default Contact;