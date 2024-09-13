//this is what our user is going to look like
//googleId is different from the id given by google
//displayName is the first and last name, google gives it

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: { 
        type: String,
        required: true
},
    displayName: {
        type: String,
        required: true
},
    firstName: {
        type: String,
        required: true
},
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)

//if we dont have an existing collection in the db a new collection will be created and it will be a plural ('Users') You can specify collection name with a 3rd arg ('collection-name')
//default will asign a value if none is provided, so each time is going to add a date time automatically
//if there is no image asociated with the user is going to cause the app to look weird
//having a schema is a blueprint for what goes in our db, we can control what type of data goes thru, we can control certain properties