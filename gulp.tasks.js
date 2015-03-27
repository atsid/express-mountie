"use strict";
var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    eslint = require("gulp-eslint"),
    babel = require("gulp-babel"),
    changed = require("gulp-changed"),
    istanbul = require("gulp-istanbul"),
    runSequence = require("run-sequence"),
    isparta = require("isparta");
require("gulp-semver-tasks")(gulp);

let MOCHA_REPORTER = "nyan",
    paths = {
        source: "src/**/*.js",
        dest: "lib/",
        main: "index.js",
        test: "test/**/*.test.js",
        build: {
            main: "Gulpfile.js",
            tasks: "gulp.tasks.js"
        }
    },
    STATIC_CHECK_GLOB = [
        paths.main,
        paths.source,
        paths.test,
        paths.build.main,
        paths.build.tasks
    ];

/**
 * Transpiling Tasks
 */
gulp.task("babel", () => {
    let BABEL_SRC = paths.source,
        BABEL_DEST = paths.dest;
    return gulp.src(BABEL_SRC)
        .pipe(changed(BABEL_DEST))
        .pipe(babel())
        .pipe(gulp.dest(BABEL_DEST));
});

/**
 * Static Analysis Tasks
 */
gulp.task("lint", () => {
    return gulp.src(STATIC_CHECK_GLOB)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

/**
 * Testing Tasks
 */
gulp.task("test", () => {
    return new Promise((resolve, reject) => {
        gulp.src(paths.source)
            .pipe(istanbul({
                instrumenter: isparta.Instrumenter,
                includeUntested: true
            }))
            .pipe(istanbul.hookRequire())
            .on("finish", () => {
                gulp.src(paths.test)
                    .pipe(mocha({reporter: MOCHA_REPORTER}))
                    .pipe(istanbul.writeReports({
                        reporters: ["lcov", "text-summary"]
                    }))
                    .on("end", resolve);
            })
            .on("error", (err) => {
                reject(err);
            });
    });
});

gulp.task("enableDebugging", () => {
    if (!process.env.DEBUG) {
        process.env.DEBUG = "mountie";
    }
});

gulp.task("ci-config", () => {
    MOCHA_REPORTER = "spec";
});

/**
 * Meta/Control Tasks
 */
gulp.task("build", (cb) => {
    runSequence(
        "enableDebugging",
        ["lint", "babel"],
        "test",
        cb
    );
});

gulp.task("ci-build", (cb) => {
    runSequence(
        "ci-config",
        "build",
        cb
    );
});


gulp.task("default", ["build"]);
