var gulp   = require("gulp"),
    jade   = require("gulp-jade"),      // compiler for Jade;
    server = require("gulp-webserver"), // a web server for local development;
    file   = require("file"),           // allow us to traverse the file system;
    // set the paths to the files we're going to manipulate;
    paths = {
        "jade": {
            // whenever any of these files change;
            "watch":   ["./src/**/*.jade"],
            // these files will be compiled;
            // don't include partials (those are being included somewhere else);
            "compile": ["./src/pages/**/*.jade", "!./src/pages/**/_*.jade"],
            // to this location (with the same path/filename);
            "dest":    "./dist/html"
        },
        "json": {
            "watch":   ["./src/**/_*.json"],
            "compile": "src/modules/"
        }
    },
    json,
    // cf. http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate
    // function to clear the require cache so we can load newer versions of the JSON data;
    requireUncached = function (module) {
        delete require.cache[require.resolve(module)];
        return require(module);
    };

gulp.task("jade", function() {
    // pass in the sass files that we want to compile;
    return gulp.src(paths.jade.compile)
        // compile the jade;
        // cf. http://jade-lang.com/api/
        .pipe(jade({
            pretty: true,
            locals: json
        }))
        // finally put the compiled jade into a jade file;
        .pipe(gulp.dest(paths.jade.dest));
});

gulp.task("json", function() {
    // blow away any previously set value for this object;
    json = {};
    
    // go through the file system, grab all data JSON files and put the values into this object;
    file.walkSync (paths.json.compile, function (dirPath, dirs, files) {
        if (files.length) {
            files.forEach(function (currentValue, index) {
                // create a unique key per JSON file made up of the directory it is in;
                var path = dirPath.replace(paths.json.compile, "") + "/" + currentValue,
                    newPath = "./" + dirPath + "/" + currentValue;
                // if we're actually dealling with a json file;
                if (currentValue.indexOf(".json") > 0) {
                    // save the value in the json object so we reference it later with Jade;
                    json[path] = requireUncached(newPath);
                }
            });
        }
    });
});

gulp.task("server", function () {
    return gulp.src(".")
        // start a web server so we can start playing;
        .pipe(server({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task("watch", function () {
    // report when a file is changed;
    var onChange = function (evt) {
            console.log("[watcher] File " + evt.path + " was " + evt.type + ", compiling...");
        };

    // watch the files in the paths object, and when there is a change, run the functions in the array;
    gulp.watch(paths.json.watch, ["json", "jade"]).on("change", onChange);
    gulp.watch(paths.jade.watch, ["jade"]).on("change", onChange);
});

// this is the default task - which is run when "gulp" is run;
// the tasks passed in as an array are run before the tasks within the function (function not defined here);
gulp.task("default", ["json", "jade", "watch", "server"], function () {
});
