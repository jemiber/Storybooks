//this is where our strategy goes

const Googlestrategy = require('passport-google-oauth20').Strategy
const mogoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new Googlestrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accesToken, refreshToken, profile, done) => {
        //store the data in the db and reference it when we need to. We are pulling apart the profile given by google and puting the parts we need in a new object that matches our user schema
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        //checking the db to see if a user with that id exists, if it does we dont need to add it to the db again, if its new we add it to the db and then we use the done callback
        try {
            let user = await User.findOne({ googleId: profile.id })

            if(user){
                done(null, user)
            } else{
                user = await User.create(newUser)
                done(null,user)
            }
        } catch (error) {
            console.error(error)
        }
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        
        User.findById(id)
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            done(error)
        })
        // }
        // User.findById(id, function (err,user){
        //     done(err,user)
        // }) these lines of code are deprecated.
    })
    
}
//all the token things are given by google
//serialize and deserialize are making sure that we can pass the user id where it needs to go and hit the db with it and still remain anonymous. When passport saves the user, it doesnt want to save the ENTIRE user so we tell it how to do so in a way we can reverse
//findById is a mongoose method now with .findById mongoose6 wants us to use promises or async await or try catch