module.exports.order = 10;
module.exports.name = "dahaka-external";

module.exports.setup = function(app){
    app.get("views").push(__dirname+"/views");


    app.get("/SpagoBI",function(req,res,next){
        app.set("breadcrumb",[{label : "SpagoBI",url:"/SpagoBI"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        res.render("externals/frame",{layout:"core/layouts/full-frame",url : "http://10.230.2.22:8080/SpagoBI"});
    })


    
    app.get("/Kibana",function(req,res,next){
        app.set("breadcrumb",[{label : "Kibana",url:"/Kibana"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        res.render("externals/frame",{layout:"core/layouts/full-frame",url : "http://10.233.1.100:5601"});
    })
    
}

module.exports.menu = [
    {
        label : "SpagoBI",
        url : "/SpagoBI",
        icon : "<i class='fa fa-bar-chart'></i>",
        style : "color : red",
        order : 1,
        enabled : false
    },
    {
        label : "Kibana",
        url : "/Kibana",
        icon : "<i class='fa fa-compass'></i>",
        style : "color : red",
        order : 1,
        enabled : false
    },
]