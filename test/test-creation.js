/*global describe, beforeEach, it */
"use strict";

var path = require( "path" );
var helpers = require( "yeoman-generator" ).test;

describe( "pwgsc-intranet generator", function () {
	beforeEach(function( done ) {
		helpers.testDirectory( path.join( __dirname, "temp" ), function ( err ) {
			if ( err ) {
				return done( err );
			}

			this.app = helpers.createGenerator( "pwgsc-intranet:app", [
				"../../app"
			]);
			done();
		}.bind( this ));
	});

	it( "creates expected files", function ( done ) {

		var expected = [
			".jshintrc",
			".editorconfig",
			"Gruntfile.js",
			"package.json",
			"src",
			"boew-wet",
			"site"
		];

		// Give the copy task time to do it's thing
		this.timeout( 0 );

		this.app.options[ "skip-install" ] = true;
		this.app.run( {}, function () {
			helpers.assertFile( expected );
			done();
		});
	});
});
