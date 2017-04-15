"use strict";

var gulp = require("gulp");
var del = require("del");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var precss = require("precss");
var cssnano = require("cssnano");
var calc = require("postcss-calc");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var server = require("browser-sync").create();
var sourcemaps = require("gulp-sourcemaps");
var run = require("run-sequence");

var path = {
  build: {
    html: "build/",
    js: "build/js/",
    css: "build/css/",
    img: "build/img/",
    icon: "build/img/icons/",
    fonts: "build/fonts/"
  },
  src: {
    html: "src/*.html",
    js: "src/js/script.js",
    css: "src/postcss/style.css",
    img: "src/img/**/*.{png,jpg,gif,svg}",
    icon: "src/img/icons/*.svg",
    fonts: "src/fonts/**/*.*"
  },
  watch: {
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    css: "src/postcss/**/*.css",
    img: "src/img/**/*.{png,jpg,gif,svg}",
    icon: "src/img/icons/*.svg",
    fonts: "src/fonts/**/*.*"
  },
  clean: "./build"
};

gulp.task("clean", function() {
  return del(path.clean);
});

gulp.task("html", function() {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(server.stream());
});

gulp.task("js", function() {
  gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(server.stream());
});

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
  return gulp.src(path.src.css)
    .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(postcss(processors))
      .pipe(postcss(cssnano))
    .pipe(sourcemaps.write())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.css))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src(path.src.img)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(server.stream());
});

gulp.task("cleanIcons", function() {
  return del(path.build.icon);
});

gulp.task("symbols", function() {
  return gulp.src(path.src.icon)
    .pipe(svgmin({
      plugins: [{
        removeStyleElement: true
      }]
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest(path.build.img))
    .pipe(server.stream());
});

gulp.task("fonts", function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(server.stream());
});

gulp.task("serve", function() {
  var config = {
    server: {
      baseDir: "./build"
    },
    host: "localhost",
    port: 9000,
    logPrefix: "Team_Leading"
  };

  server.init(config);
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "html",
    "js",
    "style",
    "images",
    "cleanIcons",
    "symbols",
    "fonts",
    fn
  );
});

gulp.task("watch", function() {
  gulp.watch([path.watch.html], function(event, cb) {
    gulp.start("html");
  });
  gulp.watch([path.watch.css], function(event, cb) {
    gulp.start("style");
  });
  gulp.watch([path.watch.js], function(event, cb) {
    gulp.start("js");
  });
  gulp.watch([path.watch.img], function(event, cb) {
    gulp.start("images");
  });
  gulp.watch([path.watch.icon], function(event, cb) {
    gulp.start("symbols");
  });
  gulp.watch([path.watch.fonts], function(event, cb) {
    gulp.start("fonts");
  });
});

gulp.task("default", function(fn) {
  run(
    "build",
    "serve",
    "watch",
    fn
  );
});
