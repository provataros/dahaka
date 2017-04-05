var core = require("../core");
module.exports.setup = function(app){
    app.get("/expenses/income",function(req,res,next){

        app.set("breadcrumb",[{label : "Expenses",url:"/expenses"},{label : "Income",url:"/expenses/income"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        app.locals.app_menu = core._appmenu;
        res.render("expenses/income");
    })
}