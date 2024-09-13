const mongoose = require('mongoose')

//using mongoose.connect returns a promise so we have to use async/await
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true, //this 3 lines of code are to prevent errors in the console. This 3 lines are no longer used, mongoose 6 does these actions automatically now
            // useFindAndModify: false
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1) //this stops whatever is happening if theres an error
    }
}

module.exports = connectDB //this code allows the use of this file in the app.js file
//the line above will be required in the app.js file with this code: const connectDB = require('./congif/db')