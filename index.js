#!/usr/bin/env node

var program = require('commander');




program
    .arguments('<init>')
    .action(function (command) {
        if (command == "init") {
            console.log('command: %s', command);
            console.log("initalise new project");
        }
        if (command == "runserver") {
            //console.log('command: %s', command);
            console.log("running on :4242");
            var express = require('express');
            var app = express();

// respond with "hello world" when a GET request is made to the homepage
            app.get('/', function (req, res) {
                res.send('hello world')
            })

            app.listen(4242);
        }
    })
    .parse(process.argv);
