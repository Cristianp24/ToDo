const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/Users'); // Asegúrate de que esta línea importe tu modelo de User
require('dotenv').config();



module .exports = () => passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/users/auth/google/callback',
  scope: ['profile', 'email'] 


},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar al usuario por su ID de Google
    let user = await User.findOne({ where: { email: profile.emails[0].value } });
    
    if (!user) {
      // Si no existe, crea uno nuevo
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: null // No se usa contraseña en este caso
      });
      
      
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
  });

