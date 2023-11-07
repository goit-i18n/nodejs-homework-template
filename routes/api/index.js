const express = require("express");
const router = express.Router();

const controller = require("../../controllers/index");

router.get("/contacts", controller.getAll);
router.get("/contacts/:contactId", controller.getById);
router.delete("/contacts/:contactId", controller.remove);
router.post("/contacts", controller.create);
router.put("/contacts/:contactId", controller.update);
router.patch("/contacts/:contactId/favorite", controller.updateFavorite);

module.exports = router;
