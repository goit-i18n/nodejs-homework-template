const passport = require('passport');
const passportJWT = require('passport-jwt');

const Users = require('../repository/users');

require('dotenv').config();



const SECRET_KEY = process.env.JWT_SECRET_KEY;

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
};

passport.use(
    new Strategy(params, async (payload, done) => {
        try {
            const user = await Users.findById(payload.id);

            if (!user) {
                return done(new Error('User not found'), false);
            }
            if (!user.token) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }),
);