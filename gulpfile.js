var gulp = require('gulp');
var typescript = require('gulp-typescript');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var inlineNg2Template = require('gulp-inline-ng2-template');
var webpack = require('gulp-webpack');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var del = require('del');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var symlink = require('gulp-symlink');
var ejs = require("gulp-ejs");
var fs = require('fs');
var path = require('path');
var rename = require("gulp-rename");

var conf = {
  'gulp': require('./gulpconfig'),
  'webpack': require('./webpack.config.js'),
  'ts': require('./tsconfig')
}

gulp.task('build-ejs', function() {
  return gulp.src(conf.gulp.srcDir + '/**/*.ejs')
    .pipe(
      ejs({
        type: "build",
        bundleFileList: fs.readdirSync(conf.gulp.distDir + "/js")
          .filter(function(file) {
            // dist/js 以下の.jsファイルはすべて埋め込む
            if(/\.js$/.exec(file)) {
              return true;
            }
          })
      }, { "ext": ".html" }))
    .pipe(minifyhtml())
    .pipe(gulp.dest(conf.gulp.distDir));
});

gulp.task('sass', function() {
  var processors = [cssnext()];
  return gulp.src(conf.gulp.srcDir + '/**/*.sass', { base: conf.gulp.srcDir })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(minifycss())
    .pipe(gulp.dest(conf.gulp.srcDir))
});

gulp.task('build-inline', function() {
  return gulp.src(conf.gulp.srcDir + '/**/*.ts', { base: conf.gulp.srcDir })
    .pipe(inlineNg2Template({ UseRelativePaths: true, indent: 0, removeLineBreaks: true, base: conf.gulp.srcDir }))
    .pipe(gulp.dest(conf.gulp.inlineDir));
});

gulp.task('build-clean', function(cb) {
  return del([conf.gulp.inlineDir,
    conf.gulp.distDir,
    conf.gulp.srcDir + '/**/*.css',
  ], cb);
});

gulp.task('build-after', function(cb) {
  return del([conf.gulp.inlineDir,
    conf.gulp.srcDir + '/**/*.css'
  ], cb);
});

gulp.task('build-webpack', function() {
  return gulp.src(conf.webpack.entry.main)
    .pipe(webpack(conf.webpack))
    .pipe(gulp.dest(conf.gulp.distDir + '/js'));
});

gulp.task('build-statics', function() {
  return gulp.src(
    [conf.gulp.srcDir + '*.html',
      conf.gulp.srcDir + '/css/*.css',
      conf.gulp.srcDir + '/js/*.js',
      conf.gulp.srcDir + '/img/*'
    ], { base: conf.gulp.srcDir }
  ).pipe(gulp.dest(conf.gulp.distDir));
});

gulp.task('build-server', function() {
  gulp.src(conf.gulp.distDir)
    .pipe(webserver({
      host: 'localhost',
      port: 8100,
      open: true,
      livereload: false //自動リロードはしない
    }));
});

gulp.task('build', function(cb) {
  return runSequence(
    'build-clean',
    'sass',
    'build-inline', ['build-webpack', 'build-statics'],
    'build-ejs', //ejsで埋め込むjsのパスはwebpackに依存しているのでこの位置
    'build-server',
    'build-after',
    cb
  );
});


gulp.task('local-clean', function(cb) {
  return del([
    conf.gulp.srcDir + '/**/*.css',
    conf.gulp.localDir,
  ], cb);
});

gulp.task('local-ts', function() {

  var tsResult = gulp.src(conf.gulp.srcDir + '/**/*.ts', { base: conf.gulp.srcDir })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(typescript(conf.ts.compilerOptions));
  tsResult.dts.pipe(gulp.dest(conf.gulp.localDir));

  return tsResult.js.pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(conf.gulp.localDir));
});

gulp.task('local-configs', function() {
  return gulp.src(conf.gulp.localDir + "/app/configs/app.configs.dev.js")
    .pipe(rename("app.configs.js"))
    .pipe(gulp.dest(conf.gulp.localDir + "/app/configs"))
});

gulp.task('local-src', function(cb) {
  return runSequence(
    'local-ts',
    'local-configs',
    cb
  );
});

gulp.task('local-nodemodules', function() {
  return gulp.src('node_modules')
    .pipe(symlink(conf.gulp.localDir + '/node_modules'));
});

gulp.task('local-ejs', function() {
  return gulp.src(conf.gulp.srcDir + '/**/*.ejs')
    .pipe(plumber())
    .pipe(ejs({ type: "local" }, { "ext": ".html" }))
    .pipe(gulp.dest(conf.gulp.localDir));
});

gulp.task('local-statics', function() {
  return gulp.src(
    [conf.gulp.srcDir + '/**/*.html',
      conf.gulp.srcDir + '/**/*.css',
      conf.gulp.srcDir + '/**/*.js',
      conf.gulp.srcDir + '/img/*'
    ], { base: conf.gulp.srcDir }
  ).pipe(gulp.dest(conf.gulp.localDir));
});

gulp.task('local-stub', function() {
  return gulp.src(
    [conf.gulp.stubDir + '/**/*'], { base: conf.gulp.srcDir }
  ).pipe(gulp.dest(conf.gulp.localDir + '/stub'));
});

gulp.task('local-server', function() {
  gulp.src(conf.gulp.localDir)
    .pipe(webserver({
      host: 'localhost',
      port: 8200,
      open: true,
      livereload: false //自動リロードはしない
    }));
});

gulp.task('local', function(cb) {
  return runSequence(
    'local-clean',
    'sass', ['local-src', 'local-watch', 'local-statics', 'local-ejs', 'local-nodemodules', 'local-stub'],
    'local-server',
    cb
  );
});

// 自動ビルド
gulp.task('local-watch', function() {
  gulp.watch(conf.gulp.srcDir + '/**/*.sass', ['sass']);
  gulp.watch(conf.gulp.srcDir + '/**/*.ts', ['local-src']);
  gulp.watch(conf.gulp.srcDir + '/**/*.ejs', ['local-ejs']);
  gulp.watch([conf.gulp.srcDir + '/**/*.html',
    conf.gulp.srcDir + '/**/*.css',
    conf.gulp.srcDir + '/**/*.js'
  ], ['local-statics']);
});



gulp.task('clean', ['local-clean', 'build-clean'], function(cb) {
  return del(['/*.log'], cb);
});
