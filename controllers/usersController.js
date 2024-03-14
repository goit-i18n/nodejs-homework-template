const User = require("../models/User");

exports.updateSubscription = async (req, res) => {
  const allowedSubscriptions = ["starter", "pro", "business"];
  const { subscription } = req.body;

  try {
    if (!allowedSubscriptions.includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    const filter = { id: req.user.id };
    const update = { subscription };

    const updatedUser = await User.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating subscription", error: error.message });
  }
};
