config = require('./config/config.json');
var configurl = "http://<username>:<password>@<ipAddress>/Monarch/syncconnect/sdk.aspx?command=<command>",
secureurl = configurl.replace('<username>', config.username).replace('<password>', config.password).replace('<ipAddress>', config.ipAddress),
request = require('request'),
colors = require('colors'),

getStatus = function (){
  var url = secureurl.replace('<command>', 'GetStatus');
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Status: ' + body.blue);
    } else {
      console.log(error);
    }
  });
},

record = function(){
  var url = secureurl.replace('<command>', 'StartRecording');
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Recording: ' + body.green);
      setTimeout(function(){
        stop();
      }, 15000)
    } else {
      console.log('Error, starting record: ' + error.red);
    }
  });
},

stop = function(){
  var url = secureurl.replace('<command>', 'StopRecording');
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Stop recording: ' + body.green);
    } else {
      console.log('Error, stoping record: ' + error.red);
    }
  });
},

test = function(){
  record();
};

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What do you think of node.js? ", function(answer) {
  // TODO: Log the answer in a database
  console.log("Thank you for your valuable feedback:", answer);
  rl.close();
});

getStatus();

test();

setInterval(function(){
  test();
}, 60000);