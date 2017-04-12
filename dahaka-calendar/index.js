module.exports.order = 10;
module.exports.name = "dahaka-external";

module.exports.setup = function(app){
    app.get("views").push(__dirname+"/views");


    app.get("/calendar",function(req,res,next){
        app.set("breadcrumb",[{label : "Calendar",url:"/calendar"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        res.render("calendar/root");
    })
    
}

module.exports.menu = [
    {
        label : "Calendar",
        url : "/calendar",
        icon : "<i class='fa fa-calendar'></i>",
        style : "color : red",
        order : 1,
    },
]