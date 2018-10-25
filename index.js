#!/usr/bin/env node

var program = require('commander');

program
    .arguments('<init>')
    .action(function (command) {
        if (command == "init") {
            console.log('command: %s', command);
            console.log("initalise new project");
        }
        if (command == "run"){
            
        }

    })
    .parse(process.argv);