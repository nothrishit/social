const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');
const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.CODEIAL_JWT_SECRET
}


passport.use(new JWTStrategy(opts,async function(jwtPayLoad,done){
    try{
        let user = await User.findById(jwtPayLoad._id);
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    }
    catch(err){
        console.log('error in finding user',err);
    }
    

}

));
module.exports = passport;
