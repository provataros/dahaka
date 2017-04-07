var core = require("../core");
var moment = require("moment");
var mongo = require("mongodb");

module.exports.setup = function(app){
    app.get("/expenses/transactions",function(req,res,next){

        app.set("breadcrumb",[{label : "Expenses",url:"/expenses"},{label : "Transactions",url:"/expenses/transactions"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        app.locals.app_menu = core._appmenu;

        date={};
        
        if (req.query.from){
            date["$gte"] = req.query.from;
        }
        if (req.query.until){
            date["$lte"] = req.query.until;
        }
        Object.keys(date).length!=0?date={date : date}:null;
        // req.query.from?

        
        if (req.user && req.user.username){
            date.user = req.user.username;
        }
        console.log(date);

        app.get("expenses_db")().collection("transactions").find(date).sort({date : -1}).toArray().then(function(docs){

            for (var i in docs){
                docs[i].date = moment(docs[i].date,"YYYYMMDDHHmmss").format("D MMMM YYYY");
            }

            res.render("expenses/transactions",{docs : docs});
        }).catch(function(err){
            console.log(err);
        })
        
    })
    app.post("/expenses/submit_adjustment",function(req,res,next){
        var date = moment(req.body.date,["DD/MM/YYYY","DD/MM","DD/MM/YYYY HH:mm:ss"]);
        date = date.isValid()?date:moment();

        if (req.body.amount || req.body.category || req.body.detail){
            var params = {
                amount : parseFloat(req.body.amount) || 0,
                category : req.body.category || "-",
                detail : req.body.detail || "-",
                date : date.format("YYYYMMDDHHmmss"),
            };
            if (req.user && req.user.username){
                params.user = req.user.username;
            }
            app.get("expenses_db")().collection("transactions").insert(params).then(function(result){
                //console.log(result);
                res.redirect("/expenses/transactions");
            }).catch(function(err){
                console.log(err);
                res.redirect("/expenses/transactions");
            })
        }        
        else{
            res.redirect("/expenses/transactions");
        }
    })

    
    app.post("/expenses/delete_transactions",function(req,res,next){
        var ids = Array.isArray(req.body.selected)?req.body.selected:[req.body.selected];
        //console.log(ids);
        if (ids){
            for (var i in ids){
                ids[i] = new mongo.ObjectID(ids[i]); 
            }
            var params = {
                _id : {$in : ids}
            };
            if (req.user && req.user.username){
                params.user = req.user.username;
            }
            app.get("expenses_db")().collection("transactions").remove(params).then(function(result){
                //console.log(result);
                res.redirect("/expenses/transactions");
                //console.log("OK");
            }).catch(function(err){
                //console.log(err);
                res.redirect("/expenses/transactions");
                //console.log("error");
            }) 
        }
        else{
            res.redirect("/expenses/transactions");
        }
        
    })
}