// models/contacts.js;
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    }
  });
const Contact = model('Contact', schema);

export default Contact;