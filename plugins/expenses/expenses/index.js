var core = require("../core");
module.exports.setup = function(app){
    app.get("/expenses/expenses",function(req,res,next){

        app.set("breadcrumb",[{label : "Expenses",url:"/expenses"},{label : "Expenses",url:"/expenses/expenses"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        app.locals.app_menu = core._appmenu;
        res.render("expenses/expenses");
    })
}