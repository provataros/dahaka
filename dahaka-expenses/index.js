var core = require("./core");
var transactions = require("./transactions");
var settings = require("./settings");


var MongoClient = require('mongodb').MongoClient;



module.exports.order = 10;
module.exports.name = "dahaka-expenses";

module.exports.setup = function(app,options){
    if (options && options.url){
        MongoClient.connect(options.url, function(err, _db) {
            if (err){
                console.log("Error while connecting to the database Expenses");
                return;
            }
            console.log("Connected successfully to the database Expenses");
            app.set("expenses_db",function(){
                return _db;
            });
        });
    }
    else{
        console.log("Using main database for Expenses");
        console.log(app.get("database"));
        app.set("expenses_db",function(){
            return app.get("database");
        });
    }


    app.get("views").push(__dirname+"/views");
    core.setup(app);
    transactions.setup(app);
    settings.setup(app);
}

module.exports.menu = [{
    label : "Expenses",
    url : "/expenses",
    icon : "<i class='fa fa-eur'></i>",
    style : "color : red",
    order : 1
}]