const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override') //to make our form make put and delete req
const dotenv = require ('dotenv')
const morgan = require('morgan') //this is for login
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo') //this is to store a session in the db
const connectDB = require('./config/db')
const { error } = require('console')


//LOAD CONFIG
dotenv.config({ path: '.env' })

//PASSPORT CONFIG
require('./config/passport')(passport)

connectDB()

const app = express()

//BODY PARSER
//Middleware that allows us to get data from the form
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//METHOD OVERRIDE
//Middleware to intercept post req from form and change it for another method
//It checks if there is a body from the form and if it's an object and if we passed an override method at all
//it will delete the og form method and replace it with whatever we use as a hidden input in the edit.hbs using <input type="hidden" name="_method" value="PUT">
app.use(methodOverride(function(req,res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        //look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//LOGIN
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//HANDLEBARS HELPERS
//Here we bring our hbs.js file using destructuring bc we are going to bring in a bunch of different functions from the same location
//We are also taking the helpers and putting them in the 'HELPERS' block
const {formatDate, truncate, stripTags, editIcon, select} = require('./helpers/hbs')

//HANDLEBARS
//Setting the view engine and using the handlebars extension. the layout wraps around the views, it has the html head and body tag.
app.engine('hbs', engine({
    helpers: {
        formatDate,
        truncate,
        stripTags,
        editIcon,
        select
    },
    layoutsDir: __dirname + '/views/layouts', //new configuration parameter, it tells express to look for the layouts folder
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', './views')

//EXPRESS-SESSION MIDDLEWARE (this HAS to be above passport middleware because passport sessions look for a session manager attached to the request which express session does)
app.use(
    session({
        secret: 'keyword cat',
        resave: false, //is fals bc we don't want to save a session if nothing is modified
        saveUninitialized: false, //false to say 'don't create a session if nothing is stored'
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
)
//the store is what is going to save our session so the app doesnt kick us out after every update. This is in the db

//PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

//SET GLOBAL VARIABLE
//(this has to be set like middleware)
//when we are done we call next to say 'go to the next middleware'
//this block of code we are basically creating a global variable so that handlebars can access the user from within our templates
//check user model comment in Story.js to understand what happens when null
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})

//STATIC FOLDER (public folder)
app.use(express.static(path.join(__dirname, 'public')))


//ROUTES
app.use('/', require('./routes/index')) //anything that is just '/' is going to be linked to the main.hbs file
app.use('/auth', require('./routes/auth')) //this is linking to the routes auth file. 
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server runnning in ${process.env.NODE_ENV} mode on port ${PORT}`))
