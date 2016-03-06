'use strict';

var browserSync = require( 'browser-sync' ).create();
var reload      = browserSync.reload;

var browserify  = require( 'browserify' );
var babelify    = require( 'babelify' );
var source      = require( 'vinyl-source-stream' );

var gulp        = require( 'gulp' );
var addSrc      = require( 'gulp-add-src' );
var concat      = require( 'gulp-concat' );
var notify      = require( 'gulp-notify' );
var rename      = require( 'gulp-rename' );
var streamify   = require( 'gulp-streamify' );
var uglify      = require( 'gulp-uglify' );
var watch       = require( 'gulp-watch' );
var runSequence = require( 'run-sequence' ).use( gulp );


gulp.task( 'browser-sync', function () {

  browserSync.init( {
    server: {
      baseDir: './',
      directory: true
    },
    startPath: './examples/'
  } );

} );


gulp.task( 'build:ClearCoat', function () {

  return browserify( {
    entries: './src/ClearCoatMaterial.js',
    standalone: 'ClearCoatMaterial'
  } )
  .transform( babelify.configure( {
    presets: [ 'es2015-loose' ],
    plugins: [
      'add-module-exports',
      // for IE9
      // see https://gist.github.com/zertosh/4f818163e4d68d58c0fa
      'transform-proto-to-assign'
    ]
  } ) )
  .bundle()
  .on( 'error', function( err ) {

    // print the error
    console.log( 'Error : ' + err.message );

    // Keep gulp from hanging on this task
    this.emit( 'end' );

    return notify().write( err.message );

  } )
  .pipe( source( 'ClearCoatMaterial.js' ) )
  .pipe( addSrc.prepend( 'src/_header.js' ) )
  .pipe( streamify( concat( 'ClearCoatMaterial.js' ) ) )
  .pipe( gulp.dest( './build/' ) )
  .pipe( uglify( { preserveComments: 'some' } ) )
  .pipe( rename( { extname: '.min.js' } ) )
  .pipe( gulp.dest( './build/' ) )

} );


gulp.task( 'watch', function () {

  watch( [ './src/*.js' ], function () {
    runSequence( 'build:ClearCoat', browserSync.reload );
  } );

} );


gulp.task( 'default', function ( callback ) {

  return runSequence( 'browser-sync', 'build:ClearCoat', 'watch', callback );

} );
