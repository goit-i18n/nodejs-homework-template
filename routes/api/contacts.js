const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contactsController");
const { protectRoute } = require("../../middleware/authMiddleware");

router.use(protectRoute);

router.get("/", contactsController.getAllContacts);
router.post("/", contactsController.createContact);
router.put("/:id", contactsController.updateContact);
router.delete("/:id", contactsController.deleteContact);
router.patch("/:id/favorite", contactsController.updateStatusContact);

module.exports = router;
