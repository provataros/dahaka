var moment = require("moment");
var hbs = require("hbs");
module.exports.setup = function(app){
    app.get("views").push(__dirname+"/views");

    app.get("/expenses",function(req,res,next){

        app.set("breadcrumb",[{label : "Expenses",url:"/expenses"}]);
        app.locals.breadcrumb = app.get("breadcrumb");
        app.locals.app_menu = appmenu;

        hbs.registerHelper("percentage",function(a,b){
            return parseFloat((100*a/b).toFixed(2));
        });

        var col = app.get("expenses_db").collection("transactions");



        var d1 = req.query.value?moment("01"+req.query.value,"DDMMYYYY"):moment().startOf("month");
        var d2 = moment(d1).endOf("month");

        var data={};
        var substr = 8;
        var step = "days";
        var format = "YYYYMMDD";
        var format2 = ("DD");
        if (req.query.frame=="month"){

        }
        else if (req.query.frame=="year"){
            substr = 6;
            step = "months";
            format = "YYYYMM"
            format2 = "MMMM"
            d1 = req.query.value?moment("0101"+req.query.value,"DDMMYYYY"):moment().startOf("year");
            d2 = moment(d1).endOf("year");
        }


        for (var m = moment(d1); m.isBefore(d2); m.add(1, step)) {
            var f = m.format(format);
            console.log(f);
            data[f] = {date:f,total : 0}
        }

        var max = 0;
        col.aggregate([
            {$match: {}}
            , {$group:
                {_id: {$substr: ["$date", 0, substr]}, total: {$sum: '$amount'} }
            }
        ]).toArray(function(err, docs) {
            console.log(docs);
            for (var i in docs){
                if (data[docs[i]._id]){
                    data[docs[i]._id].total = docs[i].total;
                    max = Math.max(max,docs[i].total);
                }

            }
            var arr = [];
            var keys = Object.keys(data).sort(function(a,b){
                if (data[a].date<data[b].date)return -1;
                if (data[a].date>data[b].date)return 1;
                return 0;
            });
            for (var i in keys){
                data[keys[i]].date = moment(data[keys[i]].date,format).format(format2);
                arr.push(data[keys[i]])
            }
            res.render("expenses/root",{data : arr,max:max});
        });





    })
}

var appmenu = [{
    label : "Transactions",
    url : "/expenses/transactions",
    icon : "<i class='fa fa-plus'></i>",
    style : "color : red",
    order : 1
}
,
/*{
    label : "Settings",
    url : "/expenses/settings",
    icon : "<i class='fa fa-cogs'></i>",
    style : "color : red",
    order : 1,
    enabled : false;
}*/
]

module.exports._appmenu = appmenu;