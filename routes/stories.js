const express = require('express')
const router = express.Router()
const Story = require('../models/Story')
const { ensureAuth } = require('../middleware/auth') //this says 'get both of these things and do something with them at the same time' this things will go into the login part and the dashboard part below


//DESCRIPTION:      Show add page
//ROUTE:            GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

//DESCRIPTION:      Process add form
//ROUTE:            POST /stories
//taking the body and grabing the user id and populating the Stories model
//create a new key in our body and grab the user id thats currently loged in and then our body that contains the user id is passed to the db thru the Stories model
//when we post the story and it goes to the db we redirect to the dashboard
router.post('/', ensureAuth, async(req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')   
    }
})
//this will only be accesed by a registered user, that's why we only use ensureAuth


//DESCRIPTION:      Show all stories
//ROUTE:            GET /stories
//we are going to get every story with the status of public and also grabing the user data as well so that we can fill it in the card.
//we are also sorting the acrds so they show from new to old
//lean() takes a mongoose object and turns it into json so handlebars can use it
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
            
        res.render('stories/index', {
            stories,
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

//DESCRIPTION:      Show single story
//ROUTE:            GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        if(!story) {
            return res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
        
    } catch (error) {
        console.error(error)
        res.render('error/404')
    }
})

//DESCRIPTION:      Show edit page
//ROUTE:            GET /stories/edit/id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story,
            })
        }
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})
//:id is a parameter, we are telling the function to grab it and make
//sure it has the right id for the right story 

//DESCRIPTION:      Update story
//ROUTE:            PUT /stories/:id
//if we try to pass a story that's not logged in, we
//redirect to stories page. If it passes all the checks
//we use another mongoose method to find one story and update it
//we are finding that story by the id, we want to replace it with the entire content using the monggose method findOneAndUpdate 
//of the request. If we want to update a story that doesn't exist it will create a new one (idk how that would happen tho)
//run validators: makes sure that all validaton gets run (Story model) so when a story is edited it still follows
//all the rules that are expected to follow
router.put('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story){
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')

        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body,{
                new: true,
                runValidators: true
            })
        }
        res.redirect('/dashboard')
        
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

//DESCRIPTION:      Delete story
//ROUTE:            DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.deleteOne({_id: req.params.id})
        res.redirect('/dashboard')

    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
})

//DESCRIPTION:      User stories
//ROUTE:            GET /stories/user/:userId
//this will show stories from a specific user and just the ones that are public
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})
module.exports = router