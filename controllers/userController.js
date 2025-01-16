const User = require("../models/user");

const UserController = {
  //! Funcția pentru actualizarea abonamentului utilizatorului:
  async updateSubscription(userId, subscription) {
    try {
      //! Găsim utilizatorul după id:
      const user = await User.findById(userId);

      //! Verificăm dacă utilizatorul există:
      if (!user) {
        throw new Error("User not found");
      }

      //! Actualizăm abonamentul utilizatorului:
      user.subscription = subscription;
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error updating subscription: ${error.message}`);
    }
  },
};

module.exports = UserController;