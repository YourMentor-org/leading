"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var simpleVars = require("postcss-simple-vars");
var mixins = require("postcss-mixins");
var nested = require("postcss-nested");
var cssnano = require("cssnano");
var calc = require("postcss-calc");
var colorFunction = require("postcss-color-function");
var styleImport = require("postcss-import");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var server = require("browser-sync").create();

gulp.task("style", function() {
  var processors = [
    styleImport,
    nested,
    colorFunction,
    simpleVars({
      silent: true
    }),
    mixins,
    calc({
      mediaQueries: true
    }),
    autoprefixer({
      browsers: [
        "last 2 versions"
      ]
    }),
    mqpacker({
      sort: true
    })
  ];
  return gulp.src("postcss/style.css")
    .pipe(plumber())
    .pipe(postcss(processors))
    .pipe(gulp.dest("css"))
    .pipe(postcss(cssnano))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("postcss/**/*.css", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});
