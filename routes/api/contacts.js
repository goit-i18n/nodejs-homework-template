import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import {
  contactAddSchema,
  contactUpdateFavoriteSchema,
} from "../../models/Contact.js";
import { isValidId } from "../../middlewares/index.js";

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema);

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:id", isValidId, contactsController.getById);

router.post("/", contactAddValidate, contactsController.add);

router.put(
  "/:id",
  isValidId,
  contactAddValidate,
  contactsController.updateById
);

router.patch(
  "/:id/favorite",
  isValidId,
  contactUpdateFavoriteValidate,
  contactsController.updateStatusContact
);

router.delete("/:id", isValidId, contactsController.deleteById);

export default router;
