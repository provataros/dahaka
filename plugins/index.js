var normalizedPath = require("path").join(__dirname, ".");

var plugins = [];

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    if (file != "index.js"){
        var obj = {name : file};
        obj["module"] = require("./" + file);
        plugins.push(obj);
    }
});



function compare(a,b) {
  if (a.module.order < b.module.order)
    return -1;
  if (a.module.order > b.module.order)
    return 1;
  return 0;
}
plugins = plugins.sort(compare);

module.exports =  plugins;