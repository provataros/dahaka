var express = require("express");
var bodyParser = require("body-parser")
module.exports.order = 0;


module.exports.start = function(args){

  opts = {
    port : 3000,
    config : "config.json",
    plugins : []
  }

  args.forEach((val, index) => {
    var f = val.split("=");
    opts[f[0]] = f[1]
  });

  if (opts.config){
    try{
      var f = require("../"+opts.config);
      if (Array.isArray(f.plugins)){
        opts.plugins = f.plugins;
      }
    }
    catch(e){
      console.log(e);
    }
  }

  app = express();


  //hbsutils.registerPartials(global.__root + '/client/views/partials');
  //hbsutils.registerWatchedPartials(global.__root + '/client/views/partials');

  var hbs = require("hbs").create();


  app.set('view engine', 'hbs');
  app.set('views',[__dirname + "/views"]);
  app.set('view options', { layout: 'core/layouts/main' });
  app.engine("hbs",hbs.__express);
  app.set("engine",hbs);

  app.use('/static', express.static('resources/public'))
  app.use('/css', express.static('resources/public/css'))
  app.use('/fonts', express.static('resources/public/fonts'))
  app.use('/js', express.static('resources/public/js'))
  app.use("/favicon.ico",function(){});
  app.set("breadcrumb",[])

  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 


  var MongoClient = require('mongodb').MongoClient;


  var url = require("./secret.js").url;
  MongoClient.connect(url, function(err, _db) {
    if (err){
      console.log("Error while connecting to the database Dahaka");
      return;
    }
    console.log("Connected successfully to the database Dahaka");
    app.set("database",_db);
  })


  menu = [];
  
  opts.plugins.forEach(function(module){
    module = require(module);
    if (!module || module.enabled == false){
        console.log(`module ${module.name} not active`);
        return;
    }
    if (module && module.setup)module.setup(app);
    if (module && module.menu){
      for (var m=0; m<module.menu.length;m++){
        if (module.menu[m].enabled == false){
        }
        else{
          menu.push(module.menu[m]);
        }
      }
    }
    console.log(`module ${module.name} initiated successfully`);
  })

  function compare(a,b) {
    if (a.order < b.order)
      return -1;
    if (a.order > b.order)
      return 1;
    return 0;
  }
  menu = menu.sort(compare);



  app.locals.menu = menu;


  app.get("/",function(req,res){
      app.set("breadcrumb",[]);
      app.locals.app_menu = null;
      app.locals.breadcrumb = app.get("breadcrumb");
      res.render("core/root",{url : req.url});
  })

  app.get("/*",function(req,res){
      app.set("breadcrumb",[]);
      app.locals.app_menu = null;
      app.locals.breadcrumb = app.get("breadcrumb");
      res.render("core/404",{url : req.url});
  })

  app.listen(opts.port || 80);   


}