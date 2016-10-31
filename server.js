// === Initialize ===
// grab npm modules
var express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
// initialize express app
var app = express();
// set up the port
var port = process.env.PORT || 3000;
// load the database config
var database = require("./config/database");
// connect to database
mongoose.connect(database.url);
// === Configure ===
// set up list of express middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // parse application/json
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: "application/vnd.api+json"}));
app.use(bodyParser.urlencoded({"extended": "true"}));
app.use(methodOverride());
// load the routes
app.use("/api/dogs", require("./app/routes/dogs-routes"));
app.use("/api/cats", require("./app/routes/cats-routes"));
// default route will lead to index.html
app.get("*", function(req, res) {
  // load the single view file
  // Angular will handle the page changes on the front-end
  res.sendFile("./public/index.html");
});
// === Start server ===
// listen port
app.listen(port);
console.log("Server started at port " + port);
