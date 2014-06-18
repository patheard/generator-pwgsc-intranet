"use strict";

var util = require( "util" );
var path = require( "path" );
var yeoman = require( "yeoman-generator" );
var yosay = require( "yosay" );
var chalk = require( "chalk" );

var PwgscIntranetGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = require( "../package.json" );

		this.on( "end", function () {
			if ( !this.options[ "skip-install" ] ) {
				this.installDependencies();
			}
		});
	},

	askFor: function () {
		var done = this.async(),
		cwd = process.cwd().replace( /\\/g, "/" );

		// Use current working dir to configure project
		this.websiteDir = cwd.split( "/" ).pop(); 
		
		// Say hello
		this.log( yosay( "Generating PWGSC Intranet website: " + this.websiteDir ) );

		done();
	},

	app: function () {	 
		this.copy( "_package.json", "package.json" );
		this.copy( "_Gruntfile.js", "Gruntfile.js" );
	
		// Copy PWGSC WET intranet resources
		this.directory( "boew-wet", "boew-wet" );
		this.directory( "site", "site" );
		this.directory( "site31_intra", "src" );
	},

	projectfiles: function () {
		this.copy( "editorconfig", ".editorconfig" );
		this.copy( "jshintrc", ".jshintrc" );
	}
});

module.exports = PwgscIntranetGenerator;
