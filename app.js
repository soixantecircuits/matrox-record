'use strict';

var config = require('./config/config.json'),
  configurl = "http://<username>:<password>@<ipAddress>/Monarch/syncconnect/sdk.aspx?command=<command>",
  secureurl = configurl.replace('<username>', config.username).replace('<password>', config.password).replace('<ipAddress>', config.ipAddress),
  request = require('request'),
  colors = require('colors'),
  inquirer = require('inquirer'),
  options = {
    timeout: 3000,
    permanentTestInterval: 60000,
    recordDuration: 15000,
    hdx: true
  },
  encoderOptions = ['StartRecording', 'StartEncoder1', 'StartEncoder2', 'StartBothEncoders'],
  stopOptions = ['StartRecording', 'StopEncoder1', 'StopEncoder2', 'StopBothEncoders'],
  permanentTest,

  getStatus = function() {
    var url = secureurl.replace('<command>', 'GetStatus');
    console.log(url);
    request({
      url: url,
      timeout: options.timeout
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Status: ' + body.blue);
      } else {
        if (error.code === 'ETIMEDOUT') {
          console.error('Can\'t reach host. Please verify your config or that the address is well configured.\n');
          process.exit();
        } else {
          console.log('Status error: ', error);
        }
      }
    });
  },


  startRecord = function(encodeIndex) {
    if (encodeIndex < encoderOptions.length && encodeIndex > -1) {
      var url = secureurl.replace('<command>', encoderOptions[encodeIndex]);
      console.log('Start record with:', url);
      request({
        url: url,
        timeout: options.timeout
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Recording: ' + body.green);
          setTimeout(function() {
            stopRecord();
          }, options.recordDuration);
        } else {
          console.log('Error, starting record: ' + error.red);
        }
      });
    } else {
      console.log('the stopOptions is too short or too long...');
    }
  },

  stopRecord = function(stopIndex) {
    if (stopIndex < stopOptions.length && stopIndex > -1) {
      var url = secureurl.replace('<command>', stopOptions[stopIndex]);
      console.log('Stop record with:', url);
      request({
        url: url,
        timeout: options.timeout
      }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Stop recording: ' + body.green);
        } else {
          console.log('Error, stoping record: ' + error.red);
        }
      });
    } else {
      console.log('the stopOptions is too short or too long...');
    }
  },

  testCall = function(optionIndex) {
    startRecord(optionIndex);
  },

  runPermanentTest = function(optionsNumber) {
    clearInterval(permanentTest);
    permanentTest = setInterval(function() {
      testCall(optionsNumber);
    }, options.permanentTestInterval);
  },

  stopPermanenTest = function() {
    clearInterval(permanentTest);
  };

var questions = [
  {
    type: "list",
    name: "command",
    message: "What do you want to do?",
    choices: [
      "Get status for Matrox HD",
      "Start recording",
      "Stop recording",
      "Run permanent test",
      "Stop permanent test",
      "Exit"
    ]
  }
];

function ask() {
  inquirer.prompt(questions, function(answers) {
    if (answers.command === 'Exit') {
      process.exit();
    } else {
      var optionIndex = 0;
          if (options.hdx) {
            optionIndex = 3;
          } else {
            optionIndex = 0
          }
      switch (answers.command) {
        case 'Get status for Matrox HD':
          console.log('Getting status...');
          getStatus();
          break;
        case 'Start recording':
          console.log('Start recording for ' + options.recordDuration + ' Do not forget to stop it!');
          startRecord(optionIndex);
          break;
        case 'Stop recording':
          console.log('Stop recording...');
          stopRecord(optionIndex);
          break;
        case 'Run permanent test':
          console.log('Run permanent test based on every ' + options.permanentTestInterval + 'ms');
          runPermanentTest(optionIndex);
          break;
        case 'Stop permanent test':
          console.log('Stoping test...');
          stopPermanenTest();
          break;
        default:
          console.log("Wtf ???");
      }
      ask();
    }
  });
}

ask();

