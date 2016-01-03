// //Add express for simplified http server
// var express = require('express');
// //Initiate http server
// var app = express();
//
//
// //Include static HTML in the 'html' directory
// app.use(express.static('public'));
//
// //Start the http server on port 4005
// var server = app.listen(4005);
// server.listen(4005, function() {
//     console.log('Server listening at http://localhost:4005/');
// });

//HTTP server framework
var express = require('express');
var winston = require('winston');
var mysql      = require('mysql');

var M2X = require("m2x");
var m2x = new M2X("efdb39cd5b23032a5ef51bc2d7f0e64f");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bingeez'
});

//Websockets library
var sio = require('socket.io');

//Initiate web server
var app = express();
//Used to save the last image uploaded
var lastUpload = "";

//Add additional HTTP headers to allow other web servers to use snapshots
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Include static HTML in the 'html' directory
app.use(express.static('public'));

//Listen on port 4001
var server = app.listen(4005);
server.listen(4005, function() {
    console.log('Server listening at http://localhost:4005/');
});

//This endpoint will respond with the last image upload from capture.html
//Not currently used, but useful for debugging
app.get('/get', function(req, res) {
    res.type("image/jpg");
    res.send(lastUpload);
    res.end();
});

// Attach the socket.io server
var io = sio.listen(server);
var sessions = [];

// Define the message handler
io.on('connection', function(socket) {

    socket.on("log", function(data) {
        winston.log("info", data);
    });

    socket.on("back_pay", function(data) {
        winston.log("info", "BACK PAY");
        io.sockets.emit('back_pay1', {"a":"b"});
    });

    socket.on("collect_pay", function(data) {

        var serverTimestamp = Math.ceil(new Date().getTime() / 1000)
        // check to see if we have a session
//              connection.connect();

        connection.query("SELECT * FROM `sessionData` WHERE `active` = 1 AND `session` = ? AND `show` = ?", [data["session"], data["show"]], function(err, rows, fields) {
          if (err) {
              throw err;
          }

          dd = {amount: 0, session: data["session"], show: data["show"], tstmp: serverTimestamp, active: 1}
          if (!!!rows[0] || "session" in rows[0] && rows[0].session == "") {
              dd["amount"] = 0.01;
              var query = connection.query('INSERT INTO `sessionData` SET `session` = ?, `show` = ?, `timestamp` = ?, `amount` = 00.01, `active` = 1 ', [data["session"], data["show"], serverTimestamp], function(err, result) {
                  winston.log(result.insertId);
                  winston.log('info', "Inserted new data into the database");
              });
          }


          winston.log('info', rows[0]);
          if (rows[0]) {
              winston.log('info', "s");
              ts = rows[0].timestamp;
              winston.log('info', ts);
              dd["amount"] = rows[0].amount;

              winston.log('info', ts);
              winston.log('info', serverTimestamp);
              if (ts < serverTimestamp) {
                   winston.log('info', "bump");
                  dd["amount"] = (Math.round(dd["amount"] * 100) / 100) + 0.01;
              }
          }

        //   var device_id = "6d13e32ab8025c06412a32fb91ae9e99";
        //   m2x.devices.setStreamValue(device_id, data["show"], {value:dd["amount"]}, function(response, responses){
        //       var m = JSON.parse(response["raw"])
        //       winston.log('info', m["message"]);
        //       if (m["message"] == "Stream Not Found") {
        //           m2x.devices.updateStream(device_id, data["show"], {value: dd["amount"]}, function(response, responses){
        //                 winston.log('info', "created a new stream...");
        //                 m2x.devices.setStreamValue(device_id, data["show"], {value:dd["amount"]}, function(response, responses){});
          //
        //            });
        //     }
        //   });

          var query = connection.query('UPDATE `sessionData` SET `amount` = ?, `timestamp` = ? WHERE `session` = ? AND `show` = ?', [dd["amount"], dd["tstmp"], dd["session"], dd["show"]], function(err, result) {
              if (err) {
                  winston.log('error', err);
                  return;
              }

              winston.log('info', data);
              var re = /^(.[^\.]*).(..).*/g;
              socket.emit('amount', {
                  "currency_a": ((Math.round(dd["amount"] * 100) / 100).toString() + "00").replace(re, "$1.$2")
              });
        });

        });

//        connection.end();



        winston.log('info', "fired back");
    });
});
