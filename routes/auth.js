//routes related to authentication

const express = require('express')
const passport = require('passport') //we are passing the actual passport dependency not the '../passport' file
const router = express.Router()


//DESCRIPTION:      Auth with Google
//ROUTE:            GET / auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//DESCRIPTION:      Google auth callback
//ROUTE:            GET /auth/google/callback
//if the login fails we send the user back home if its succesful we redirect to the dashboard route
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}),
    (req,res) => {
        res.redirect('/dashboard')
    }
)

//DESCRIPTION:      Logout user
//ROUTE:            GET /auth/logout
//Passport6 now requires the logout function to be asynchronous
router.get('/logout', (req, res, next) => {
    req.logout(function(err){
        if(err) {return next(err)}
        res.redirect('/')
    })
})

module.exports = router