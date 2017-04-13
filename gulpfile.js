"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var precss = require("precss");
var cssnano = require("cssnano");
var calc = require("postcss-calc");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var server = require("browser-sync").create();

gulp.task("style", function() {
  var processors = [
    precss,
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
