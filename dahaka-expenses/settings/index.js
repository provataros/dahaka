var core = require("../core");
const util = require('util');


module.exports.setup = function(app,mongo){
    return;
    app.get("/expenses/settings",function(req,res,next){

        app.get("expenses_db")().collection("misc").findOne({id:"settings"},function(err,doc){
            doc = doc || {};
            app.set("breadcrumb",[{label : "Expenses",url:"/expenses"},{label : "Settings",url:"/expenses/settings"}]);
            app.locals.breadcrumb = app.get("breadcrumb");
            app.locals.app_menu = core._appmenu;
            res.render("expenses/settings",{config : doc});
            
        });
    })

    app.post("/expenses/save_settings",function(req,res,next){

        //console.log(req.body);

        app.get("expenses_db")().collection("misc").update({id:"settings"},{$set : {balance : req.body.balance,payday : req.body.payday}},{upsert : true}).then(function(result){
            app.set("breadcrumb",[{label : "Expenses",url:"/expenses"},{label : "Settings",url:"/expenses/settings"}]);
            app.locals.breadcrumb = app.get("breadcrumb");
            app.locals.app_menu = core._appmenu;
            res.redirect("/expenses/settings");
        });        
    })
}