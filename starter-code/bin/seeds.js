const mongoose     = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose-celebrities');

const Celebrity = require("../models/celebrity-model");


const arrayOfCelebrities = [
    {
        name: "Celebrity 1",
        occupation: "actor",
        catch_phrase: "Cool!"
    },
    {
        name: "Celebrity 2",
        occupation: "actress",
        catch_phrase: "Whatever!"
    },
    {
        name: "Celebrity 3",
        occupation: "actor",
        catch_phrase: "Blah blah!"
    }
]

Celebrity.create(arrayOfCelebrities, (err) => {
    if(err){
        throw err;
    }
    arrayOfCelebrities.forEach(oneCelebrity => {
        console.log("Celebrity added to DB: ", oneCelebrity.name);
    })
    mongoose.disconnect();
    // mongoose.connect.close()
})














