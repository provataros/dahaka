var express = require("express");

var authenticated = true;
module.exports.order = 001;

module.exports.setup = function(app){
    app.use(function(req,res,next){
        if (!authenticated){
            res.send("no auth");
        }
        else{
            next();
        }
    })
}
