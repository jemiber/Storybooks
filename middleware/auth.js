//This is to protect our routes

module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}

//this is checking to see the user status and depending on that the user can go certain places
//if someone is authenticated they can proceed with the next routes and middleware if not send them back to the dashboard