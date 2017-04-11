"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var nested = require("postcss-nested");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();


gulp.task("style", function() {
  var processors = [
    autoprefixer({browsers: ["last 2 versions"]}),
    nested
  ];
  return gulp.src("postcss/style.css")
    .pipe(plumber())
    .pipe(postcss(processors))
    .pipe(gulp.dest("css"))
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
