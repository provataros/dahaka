var core = require("./core");
var income = require("./income");
var expenses = require("./expenses");
var settings = require("./settings");


var MongoClient = require('mongodb').MongoClient;



var url = require("./secret.js").url;

module.exports.order = 10;

module.exports.setup = function(app){

    MongoClient.connect(url, function(err, _db) {
        if (err){
            console.log("Error while connecting to the database Expenses");
            return;
        }
        console.log("Connected successfully to the database Expenses");
        app.set("expenses_db",_db);
    });


    app.get("views").push(__dirname+"/views");
    core.setup(app);
    income.setup(app);
    expenses.setup(app);
    settings.setup(app);
}

module.exports.menu = [{
    label : "Expenses",
    url : "/expenses",
    icon : "<i class='fa fa-eur'></i>",
    style : "color : red",
    order : 1
}]