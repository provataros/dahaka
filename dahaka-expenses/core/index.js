var moment = require("moment");

module.exports.setup = function(app){
    app.get("views").push(__dirname+"/views");
    
    app.get("engine").registerHelper("percentage",function(a,b){
        return parseFloat((100*a/b).toFixed(2));
    });
    app.get("engine").registerHelper("getAxisPoints",function(max,div){
        var step = (max/div).toFixed(2);
        var arr = [];
        for (var i=div;i>=0;i--){
            arr.push(parseFloat((i*step).toFixed(2)));
        }
        return arr;
    });

    app.get("/expenses",function(req,res,next){
        app.set("breadcrumb",[{label : "Expenses",url:"/expenses"}]);
        app.locals.breadcrumb = app.get("breadcrumb");

        var col = app.get("expenses_db")().collection("transactions");


        var d1 = req.query.value?moment(req.query.value+"01",["YYYYMMDD","YYYYMMMMDD"]):moment().startOf("month");
        var d2 = moment(d1).endOf("month");

        var data={};
        var substr = 8;
        var step = "days";
        var format = "YYYYMMDD";
        var format2 = ("DD");
        var format3 = "MMMM YYYY";
        var slots = d1.daysInMonth();
        if (req.query.frame=="month"){

        }
        else if (req.query.frame=="week"){ 
            format2 = "dddd"
            d1 = req.query.value?moment(req.query.value+"0101","YYYYMMDD"):moment().startOf("week");
            d2 = moment(d1).endOf("week");
        }
        else if (req.query.frame=="year"){
            substr = 6;
            step = "months";
            format = "YYYYMM"
            format2 = "MMMM"
            format3 = "YYYY"
            slots = 12;
            d1 = req.query.value?moment(req.query.value+"0101","YYYYMMDD"):moment().startOf("year");
            d2 = moment(d1).endOf("year");
        }

        for (var m = moment(d1); m.isBefore(d2); m.add(1, step)) {
            var f = m.format(format);
            data[f] = {date:f,total : 0}
        }

        var max = 0;
        var total = 0;

        var match = {};
        if (req.user && req.user.username){
            match.user = req.user.username;
        }

        if (req.query.frame != "day"){
            col.aggregate([
                {$match: match}
                , {$group:
                    {
                        _id: {$substr: ["$date", 0, substr]}, 
                        total: {$sum: '$amount'}
                    }
                }
            ]).toArray(function(err, docs) {
                //console.log(docs);
                for (var i in docs){
                    if (data[docs[i]._id]){
                        data[docs[i]._id].total = docs[i].total;
                        max = Math.max(max,docs[i].total);
                        total+=docs[i].total;
                    }

                }
                var arr = [];
                var keys = Object.keys(data).sort(function(a,b){
                    if (data[a].date<data[b].date)return -1;
                    if (data[a].date>data[b].date)return 1;
                    return 0;
                });
                for (var i in keys){
                    data[keys[i]].format = moment(data[keys[i]].date,format).format(format2);
                    arr.push(data[keys[i]])
                }
                res.render("expenses/root",{
                    data : arr,
                    max:max,
                    frame:(req.query.frame=="year"?true:false),
                    frameday:(req.query.frame=="month"||!req.query.frame?true:false),
                    month:d1.format("MMMM"),
                    year:d1.format("YYYY"),
                    avg:parseFloat((total/slots).toFixed(2)),
                    total : total
                });
            });
        }
        else{
            var match = {};
            if (req.user && req.user.username){
                match.user = req.user.username;
            }
            match.date = {$gte : moment(req.query.value,"YYYYMMDD").startOf("day").format("YYYYMMDDHHmmss"),$lte : moment(req.query.value,"YYYYMMDD").endOf("day").format("YYYYMMDDHHmmss")}

            console.log(req.query.value);

            app.get("expenses_db")().collection("transactions").find(
                match
            ).sort({date : -1}).toArray().then(function(docs){
                var total = 0;
                for (var i in docs){
                    docs[i].date = moment(docs[i].date,["YYYYMMDDHHmmss","YYYYMMDD"]).format("D MMMM YYYY");
                    total += docs[i].amount;
                }
                var stuff = {
                    frameday : true,
                    month:moment(req.query.value,"YYYYMMDD").format("MMMM"),
                    year:moment(req.query.value,"YYYYMMDD").format("YYYY"),
                    day:moment(req.query.value,"YYYYMMDD").format("dddd DD"),
                    docs : docs,
                    total : total
                };
                res.render("expenses/root_day",stuff);
            }).catch(function(err){
                console.log(err);
            })
        }

    })
}
