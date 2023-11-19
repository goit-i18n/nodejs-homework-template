const passport = require("passport");

const auth = async (req, res, next) => {
  try {
    const user = await passport.authenticate("jwt", { session: false })(
      req,
      res
    );

    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  auth,
};
