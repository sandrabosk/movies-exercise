const express = require('express');
const celebrityRouter  = express.Router();
const Celebrity = require("../models/celebrity-model");


// search
//        search?celebSearchTerm=v
celebrityRouter.get('/search', (req, res, next) => {
    const searchTerm = req.query.celebSearchTerm;
    if(!searchTerm){
        res.render('celebrities/no-search-view.hbs');
          return;
    }
    const searchRegex = new RegExp(searchTerm, 'i');
    Celebrity.find(
        // {'name': searchRegex},
        { $or:[ {'name':searchRegex}, {'occupation':searchRegex}]},
        (err, searchResults)=>{
        if(err){
            next(err);
            return;
        }
        res.render('celebrities/search-result-view.hbs',{
        results: searchResults
      });
    }
  );
})



// DISPLAY ALL THE CELEBRITIES
// url: localhost:3000/celebrities
celebrityRouter.get('/', (req, res, next) => {
    Celebrity.find()
    .then( responseFromDB => {
        //          |
        //    anything we get from DB
        // console.log(responseFromDB);
        // const celebrities = responseFromDB;
        //                      
        //                   the name we'll use in the view    the name we use here for the response
        //                                         ^              ^
        //                                         |              |
        res.render('celebrities/list-view', { celebrities: responseFromDB });
    } )
    .catch( error => {
        console.log("Error while displaying:", error );
    } )
});

// CREATE - GET ROUTE
// url: localhost:3000/celebrities/add-new
celebrityRouter.get('/add-new', (req, res, next) => {
    // render follows the physical path (views/celebrities/new-view)
    res.render("celebrities/new-view")
})

// CREATE - POST ROUTE
// this page is what we put in the form in the action part
// url: localhost:3000/celebrities/create but this page won't be displayed because it's POST method
celebrityRouter.post('/create', (req, res, next) => {
    const celebName = req.body.theName;
    // console.log(celebName)
    const celebOcc = req.body.theOccupation;
    const celebCP = req.body.theCatchPhrase;
    const newCelebrity = new Celebrity({
        name:celebName,
        occupation: celebOcc,
        catch_phrase: celebCP
    })
    newCelebrity.save()
    .then(() => {
        // res.redirect just redirects the app to the certain page
        // res.redirect has "/" before, and res.render DOESN'T HAVE IT
        res.redirect('/celebrities');
    })
    .catch(err => {
        console.log("Error while saving: ", err)
    })
})

// EDIT - GET ROUTE
// url: localhost:3000/celebrities/edit/1234567890
celebrityRouter.get('/edit/:id', (req, res, next) => {
    const celebId = req.params.id;
    // console.log(celebId);
    Celebrity.findById(celebId)
    .then(celebrityFromDB => {
        res.render("celebrities/edit-view", { celebrity: celebrityFromDB })
    })
})

// EDIT - POST ROUTE
celebrityRouter.post('/update/:id', (req, res, next) => {
    const celebId = req.params.id;
    const editedName = req.body.editedName;
    const editedOcc = req.body.editedOccupation;
    const editedCP = req.body.editedCatchPhrase;
    // console.log("editedName: ", editedName)
    Celebrity.findByIdAndUpdate(celebId, {
        name: editedName,
        occupation: editedOcc,
        catch_phrase: editedCP
    })
    .then(() => {
        res.redirect(`/celebrities/${celebId}`)
    })
    .catch( error => {
        console.log("Error while updating: ", error)
    })
})

// DELETE 
// url: localhost:3000/celebrities/1234567890/delete
// this route is post route so it won't be displayed, it's the action part of the delete form
celebrityRouter.post('/:theId/delete', (req, res, next) => {
    const celebId = req.params.theId;
    Celebrity.findByIdAndRemove(celebId)
    .then(() => {
        res.redirect("/celebrities");
    })
    .catch( error => {
        console.log("Error while deleting: ", error)
    })
})




// DETAILS PAGE
// url: localhost:3000/celebrities/1234567890
celebrityRouter.get('/:theId', (req, res, next) => {
    const celebId = req.params.theId;
    // console.log(celebId)
    Celebrity.findById(celebId)
    .then(oneCelebrityFromDB => {
        // console.log(oneCelebrityFromDB)
        res.render('celebrities/details-view', { celebrity: oneCelebrityFromDB })
    })
    .catch( error => {
        console.log("Error while getting details: ", error)
    })
})






module.exports = celebrityRouter;
