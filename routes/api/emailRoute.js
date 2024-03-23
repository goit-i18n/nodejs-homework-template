const express = require("express");
const router = express.Router();
const User = require("../../models/user");

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    // Găsește utilizatorul cu tokenul specificat
    const user = await User.findOne({ token });

    if (!user) {
      return res
        .status(404)
        .send("Utilizatorul nu a fost găsit sau tokenul este invalid.");
    }

    if (user.verify) {
      return res.status(400).send("E-mailul a fost deja verificat.");
    }

    user.verify = true;

    await user.save();

    res.status(200).send("E-mailul a fost verificat cu succes!");
  } catch (error) {
    console.error("Eroare la verificarea e-mailului:", error);
    res.status(500).send("A apărut o eroare la verificarea e-mailului.");
  }
});

module.exports = router;
