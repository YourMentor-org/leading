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
var run = require("run-sequence");

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

gulp.task("watch", function(){
    gulp.watch(["postcss/**/*.css"], function(event, cb) {
      gulp.start("style");
    });
    gulp.watch(["*.html"], function(event, cb) {
      gulp.start(server.reload);
    });
});

gulp.task("serve", function() {
  var config = {
    server: {
      baseDir: "."
    },
    host: "localhost",
    port: 9000,
    logPrefix: "Team_Leading"
  };

  server.init(config);
});

gulp.task("default", ["serve", "style", "watch"]);

gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,gif,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("img"));
});

gulp.task("symbols", function() {
  return gulp.src("img/**/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(cheerio(function ($) {
      $("svg").attr("style",  "display:none");
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});
