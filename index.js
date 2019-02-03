#!/usr/bin/env node

var program = require('commander');
var path = require("path");
var fs = require('fs');


program
    .version('0.1.0')
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook');


program
    .command('startproject <dir>')
    .description('init new project')
    //.option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action(function (dir, options) {
        //var mode = options.setup_mode || "normal";
        //env = env || 'all';
        console.log('init into dir : ', dir);

        var ncp = require('ncp').ncp;
        ncp.limit = 16;

        /*if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }*/

        ncp(path.join(__dirname, "templates", "init"), path.join(process.cwd(), dir), function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('setup project in ' + dir);
        });
    });

program
    .command("runserver")
    .action(function () {
        console.log("running on :4242");
        var express = require('express');
        var app = express();
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');

        //This loads engine needed assets
        app.use("/engine", express.static(path.join(__dirname)));

        //This loads the app directory staticly
        app.use("/app", express.static(process.cwd()));


        //browserify party.js -o ./dist/party.js -t [ babelify --presets [ env ] ]

        //const {spawn} = require('child_process');

        //const child = spawn('ls', ['-a', '-l']);


        var browserify = require('browserify');
        var sourceify = require('sourceify');
        //app.get('/_dazzlecompile/', browserify(__dirname + '/client/file.js');s

        //https://github.com/browserify/browserify-handbook#using-the-api-directly
        app.get("/_dazzlecompile/", function (req, res) {
            res.setHeader('content-type', 'application/javascript');
            var b = browserify({
                debug: true,
                // options
                transform: [sourceify]
            });
            b.add(process.cwd() + "/" + req.query["path"]);
            console.log("hello");
            console.log(process.cwd() + req.query["path"]);
            b.on('error', console.error);
            b = b.bundle();
            b.pipe(res);
        });

        app.get('/', function (req, res) {
            res.render('index.ejs', {title: 'Hey', message: 'Hello there!'})
        });

        /*
        var app_dir = process.cwd();
        var command = 'echo \'hello\' && /usr/local/bin/browserify ' + app_dir + '/components/functionalSequencer/functionalSequencer.js -o ' + app_dir + '/components/functionalSequencer/.functionalSequencer.js.compiled';
        const {exec} = require('child_process');
        console.log(command);
        exec('command', (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                return;
            }

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });*/


        app.listen(4242);
    });

program
    .command("build")
    .action(function () {
        console.log("building...");

        var ncp = require('ncp').ncp;
        ncp.limit = 16;

        var destinationDir = path.join(process.cwd(), "build");
        var destinationDirApp = path.join(process.cwd(), "build", "app");
        var destinationDirEngine = path.join(process.cwd(), "build", "engine");

        if (!fs.existsSync(destinationDir)) {
            fs.mkdirSync(destinationDir);
        }

        if (!fs.existsSync(destinationDirApp)) {
            fs.mkdirSync(destinationDirApp);
        }

        if (!fs.existsSync(destinationDirEngine)) {
            fs.mkdirSync(destinationDirEngine);
        }

        ncp(path.join(__dirname, "scripts"), path.join(destinationDir, "engine", "scripts"), function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('copied scripts');
        });

        fs.copyFile(path.join(process.cwd(), "index.json"), path.join(destinationDir, "app", "index.json"), function (err) {
            if (err) throw err;
            console.log('copied index.json');
        });

        ncp(path.join(process.cwd(), "components"), path.join(destinationDir, "app", "components"), function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('copied components2');
        });

        fs.copyFile(path.join(__dirname, "views", "index.ejs"), path.join(destinationDir, "index.html"), function (err) {
            if (err) throw err;
            console.log('copied index.ejs -> index.html');
        });
    });


program.parse(process.argv);


