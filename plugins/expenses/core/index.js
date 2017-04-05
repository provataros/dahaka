

module.exports.setup = function(app){
    app.get("views").push(__dirname+"/views");

    app.get("/expenses",function(req,res,next){

        app.set("breadcrumb",[{label : "Expenses",url:"/expenses"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        app.locals.app_menu = appmenu;
        res.render("expenses/root");
    })
}

var appmenu = [{
    label : "Income",
    url : "/expenses/income",
    icon : "<i class='fa fa-plus'></i>",
    style : "color : red",
    order : 1
},{
    label : "Expenses",
    url : "/expenses/expenses",
    icon : "<i class='fa fa-minus'></i>",
    style : "color : red",
    order : 1
},{
    label : "Settings",
    url : "/expenses/settings",
    icon : "<i class='fa fa-cogs'></i>",
    style : "color : red",
    order : 1
}]

module.exports._appmenu = appmenu;