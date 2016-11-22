/*This is a simple nodetest tutorial found here: http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/

The objective of this tutorial is to get started with the MEAN stack.
1. Set up a simple node app.
2. Connect to server (express framework)
3. Connect to database (MongoDB)
4. Display userlist, and add a user through the web view, and redirect to the newly updated userlist.

*/


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function (req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/*GET users page */
router.get('/userlist', function (req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.render('userlist', {
            "userlist": docs
        });
    });
});

/*GET new user page*/
router.get('/newuser', function (req, res) {
    res.render('newuser', { title: 'Add New User'});
});

/* POST to Add User Service */
router.post('/adduser', function (req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username": userName,
        "email": userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/userlist");
        }
    });
});

module.exports = router;