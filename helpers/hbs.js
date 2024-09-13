//This is to format our date so that it looks nice
//In order to use this file we need to register to handelbars in app.js

const moment = require('moment')

module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format)
    },

    truncate: function(str, len) {
        if (typeof str !== 'string') {
            return ''
        } //check to see is str is a string
        if(str.length > len && str.length > 0) {
            let new_str = str.slice(0, len) //using slice to truncate
            new_str = new_str.slice(0, new_str.lastIndexOf(' ')) //removing incomplete words
            new_str = new_str.length > 0 ? new_str : str.slice(0, len) //fallback if new_str is empty
            return new_str + '...' //apend ...
        }
        return str //return original str if not truncated
    },

    stripTags: function(input){
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },

    editIcon: function(storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if(floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit fa-small"></i></a>`
            }
        } else {
            return ''
        }
    },
    
    select: function(selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option'),
                ' selected="selected"$&'
            )

    }
}

//the truncate function basically truncates the text of the stories

//The slice(start, end) method returns the part of the string between the start index and end index (not including the end index). When you want a substring starting from 0 to a specified length, slice(0, len) works perfectly.

//new_str.lastIndexOf(' ') finds the last space character, allowing the function to truncate at a complete word.

//stripTags replaces the tags on the text with "nothing" so that they don't show on the page

//editIcon: checks each story in the public dashboard and say 'did the user whos currently logged in write this? we are checking to see
//if the user id is a string and if it matches with the logged user id, if it does, we check if theres a floating icon, if there is
//a link to edit will be returned and an icon will be created, else an empty space will be returned

//the select function replaces the selected thing with nothing and then the value with the selected tag, so we are clearing out the default
//and we are grabbing the selected value from what's being passed in and putting it there