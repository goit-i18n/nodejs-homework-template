import { Schema, model } from "mongoose";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";
import Joi from "joi";

const contactlist = ["private", "corporate"];

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    listType: {
      type: String,
      enum: contactlist,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" required field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" required field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" required field`,
  }),
  favorite: Joi.boolean(),
  listType: Joi.string()
    .valid(...contactlist)
    .required(),
});

export const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `missing field favorite`,
  }),
});

const Contact = model("contact", contactSchema);

export default Contact;
