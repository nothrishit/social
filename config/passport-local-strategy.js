//requiring passport
const passport = require('passport');

//requiring passport local strategy

const LocalStrategy = require('passport-local').Strategy;
//requiring user

const User = require('../models/user');

//authentication using passport

passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback : true
},
function(req,email,password,done){
    //find a user and establish the identity
     User.findOne({email : email}).then(function(user){
        
        if(!user || user.password != password){
            console.log(`Invalid username / password`);
            req.flash("error","Invalid Username/Password");
            return done(null,false);
        }

        return done(null,user);
     }).catch(function(err){
        
        req.flash('error',err)
            return done(err);
        
     });


}
));

//serializing the user to decide which key is to be kept in cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing the user from the key in cookies

// passport.deserializeUser(function(id,done){
//     User.findById(id).then(function(err,user){
//         return done(null,true);
//     }).catch((err)=>{
        
//             console.log(`error in finding user ---> passport : ${err}`);
//             return done(err);
        
//     })
// });
passport.deserializeUser(async function(id,done){
        //  User.findById(id).then(function(err,user){
        //     if(err){
        //         console.log(err);
        //         }         
        //     return done(null,true);     
        // })  
        try{             
            let user= await User.findById(id);        
             return done(null,user);     
            }     
            catch{         
                console.log('error is ', err);
                 }         
    });
//check if user is authenticated

passport.checkAuthentication = function (req,res,next){
    //if the user is signed in then pass on the request to the next function(controllers action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;