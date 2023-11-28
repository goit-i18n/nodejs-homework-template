const express = require("express");
const router = express.Router();

const controller = require("../../controllers");

router.get("/contacts", controller.get);
router.get("/contacts/:contactId", controller.getById);
router.post("/contacts", controller.create);
router.delete("/contacts/:contactId", controller.remove);
router.put("/contacts/:contactId", controller.change);
router.patch("/contacts/:contactId/favorite", controller.update);

module.exports = router;
