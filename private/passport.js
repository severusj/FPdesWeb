const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
    done(null , user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID, //cliente del .env
    clientSecret: process.env.CLIENT_SECRET, // credenciales
    callbackURL: "http://localhost:2000/auth/google/callback",
    passReqToCallback: true
},
function(request, accesToken, refreshToken, profile, done){
    return done(null, profile);
}
));