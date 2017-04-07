var express = require("express");

var session = require("express-session");
var passport = require("passport");

var LocalStrategy   = require('passport-local').Strategy;


var mongosession = require("connect-mongodb-session")(session);

var authenticated = true;
module.exports.order = 0;

module.exports.name = "dahaka-auth";

module.exports.setup = function(app,options){
    
    app.get("views").push(__dirname+"/views");
    app.use(session({  
        store: new mongosession({
            uri: options.url || app.get("database_url"),
            collection : "sessions"
        }),
        secret: options.secret,
        resave: true,
        saveUninitialized: true
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions


    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );


    passport.serializeUser(function(user, done) {
        delete user.password;
        delete user._id;
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        
        delete user.password;
        delete user._id;
        done(null,user);
    });


    passport.use("local",new LocalStrategy(
        function(email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            //console.log(email,password);
           app.get("database").collection("users").findOne({username : email}).then(function(user) {
                // if no user is found, return the message
                if (!user){
                    //console.log("no such user");
                    return done(null, false); // req.flash is the way to set flashdata using connect-flash
                }

                //console.log(user);
                // if the user is found but the password is wrong
                if (user.password != password){
                    //console.log("invalid passwrod");
                    return done(null, false); // create the loginMessage and save it to session as flashdata
                }
                // all is well, return successful user
                return done(null, user);
            }).catch(function(err){
                return done(err);
            });

        }));

        app.get("/logout",function(req,res,next){
            req.logout();
            res.redirect("/");
        })

        app.get("/login",passport.authenticate('local', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : false // allow flash messages
        }));

    app.use(function(req,res,next){
        if (req.isAuthenticated()){
            next();
        }
        else{
            if (req.url=="/")res.render("auth/login",{layout : false});
            else res.redirect("/");
        }
    })
}
