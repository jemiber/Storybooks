//for top level stuff
//in order to use this file it has to be linked to the app.js file

const express = require('express')
const router = express.Router()
const Story = require('../models/Story')
const { ensureAuth, ensureGuest } = require('../middleware/auth') //this says 'get both of these things and do something with them at the same time' this things will go into the login part and the dashboard part below


//DESCRIPTION:      Login/Landing page
//ROUTE:            GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    }) //looks for a template or Views called login and renders it
})

//DESCRIPTION:      Dashboard
//ROUTE:            GET /dashboard
router.get('/dashboard', ensureAuth, async(req, res) => {
    try {
        const stories = await Story.find({ user:
            req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
//const stories = 'go into Story and find all the matches for the specific user'
//we are using async await bc we are dealing with the db.
//With handlebars we have to use .lean() to convert the mongoose object we get back into JSON

module.exports = router