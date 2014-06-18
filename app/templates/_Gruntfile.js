module.exports = function (grunt) {

	"use strict";
    
    /*
     * Server-side include (SSI) middleware used by connect task.  Parses requested files for
     * SSI and includes in the response.
     */
    var ssi = function ( opt ) {

        var ssi = require( "ssi" ),
            path = require( "path" ),         
            fs = require( "fs" ),

            opt = opt || {},
            ext = opt.ext || ".shtml",
            baseDir = opt.baseDir || __dirname,
            parser = new ssi( baseDir, baseDir );

        return function( req, res, next ) {

            var url = req.url === "/" ? ("/index" + ext) : req.url,
                filename = baseDir + url;
            
            if (fs.existsSync(filename) && url.indexOf(ext) > -1) {            
            
                var contents = parser.parse(filename, fs.readFileSync(filename, {
                    encoding: "utf8"
                })).contents;

                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.end(contents);
            } else {
                next();
            }
        }
    }; 
    
	// Load dependency tasks
	require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );
    
	// Define build tasks
	grunt.registerTask( 
        "default",
        "default build task for the project", 
        [
            "build", 
            "validate"
        ]
    ); 
    
	grunt.registerTask( 
        "build", 
        "creates the distribution files to use in the DEV and PROD server environments",
        [ 
            "clean", 
            "copy", 
            "uglify", 
            "cssmin", 
            "htmlmin",
            "imagemin"
        ]
    );
    
    grunt.registerTask( 
        "validate", 
        "validates the distribution files (JavaScript, CSS and HTML)",
        [
            "jshint", 
            "csslint", 
            "htmllint"
        ]
    ); 
    
    grunt.registerTask( 
        "server", 
        "creates a http://localhost:80 server for testing",
        [
            "connect", 
            "watch"
        ]
    ); 
    
	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),

		// Delete any dist files
		clean: {
			dist: [ "<%= websiteDir %>/*" ]
		},        
        
		// Copy files
		copy: {
            dist: {
                expand: true,
                dot: true,
                cwd: "src/",
                src: "**",                
                dest: "<%= websiteDir %>/"
            }
		},         
        
        // Minify images
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: "src",
                    src: [ "**/*.png" ],
                    dest: "<%= websiteDir %>/",
                    ext: ".png"
                }]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: "src",
                    src: [ "**/*.jpg" ],
                    dest: "<%= websiteDir %>/",
                    ext: ".jpg"
                }]
            }
        },       

        // Minify the JS
		uglify: {
			dist: {            
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: [ 
                        "**/*.js", 
                        "!**/*.min.js", 
                        "!**/*-min.js" 
                    ],
                    dest: "<%= websiteDir %>/"
                }]            
			},
		},
        
        // Minify the CSS
        cssmin: {
            dist: {
                expand: true,
                cwd: "src/",
                src: [ 
                    "**/*.css", 
                    "!**/*.min.css", 
                    "!**/*-min.css" 
                ],
                dest: "<%= websiteDir %>/"
            }
        },
        
        // Minify the HTML
		htmlmin: {
		        dist: {
		            options: {
		                removeComments: true,
                        ignoreCustomComments: [ /^\s*#include/ ],
		                collapseWhitespace: true,
                        conservativeCollapse: true,
		                removeEmptyAttributes: true,
		                removeCommentsFromCDATA: true,
		                removeRedundantAttributes: true,
		                collapseBooleanAttributes: true                        
		            },
                    expand: true,
                    cwd: "src/",
                    src: [ "**/*.html" ],
                    dest: "<%= websiteDir %>/"
		        }
		},        

        // JS validation
		jshint: {
			options: {
                boss: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                expr: true,
                immed: true,
                noarg: true,
                onevar: true,
                smarttabs: true,
                trailing: true,
                undef: true,
                unused: true,
                jquery: true,
                browser: true,
                es3: true,
                globals: {
                    pe: true
                }
            },
			src: {
				src: [
					"src/**/*.js",
                    "!src/**/*.min.js",
                    "!src/**/*-min.js"
				]
            }    
        },
       
        // HTML validation
        htmllint: {        
			all: {
				options: {
					ignore: [
						"The “details” element is not supported properly by browsers yet. It would probably be better to wait for implementations.",
						"The “date” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.",
						"The “track” element is not supported by browsers yet. It would probably be better to wait for implementations.",
						"The “time” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.",						
						"The “longdesc” attribute on the “img” element is obsolete. Use a regular “a” element to link to the description.",
						"The text content of element “time” was not in the required format: The literal did not satisfy the time-datetime format."
					]
                },
				src: [
					"<%= websiteDir %>/**/*.html",
                    "!<%= websiteDir %>/includes/**/*.html"                    
				]        
            }
        },
        
        // CSS validation
        csslint: {
            all: {
                options: {
                    "adjoining-classes": false,
                    "box-model": false,
                    "box-sizing": false,
                    "compatible-vendor-prefixes": false,
                    "duplicate-background-images": false,
                    "duplicate-properties": false,
                    "empty-rules": false,
                    "fallback-colors": false,
                    "floats": false,
                    "font-sizes": false,
                    "gradients": false,
                    "headings": false,
                    "ids": false,
                    "important": false,
                    "known-properties": false,
                    "outline-none": false,
                    "overqualified-elements": false,
                    "qualified-headings": false,
                    "regex-selectors": false,
                    "shorthand": false,
                    "text-indent": false,
                    "unique-headings": false,
                    "universal-selector": false,
                    "unqualified-attributes": false,
                    "zero-units": false
                },            
                src: [ 
                    "src/**/*.css",
                    "!src/**/*.min.css",
                    "!src/**/*-min.css"                
                ]
            }
        },   
        
        // Local testing server
        connect: {
            test: {
                options: {
                    port: 80,
                    livereload: true,
                    middleware: function ( connect, options ) {
                        var middlewares = [],
                            directory = options.directory || options.base[ options.base.length - 1 ];
                        
                        // Server-side includes
                        middlewares.push(ssi({ 
                            baseDir: ".",
                            ext: ".html" 
                        }));
                        
                        if ( !Array.isArray( options.base ) ) {
                            options.base = [ options.base ];
                        }
                        options.base.forEach(function( base ) {
                            // Serve static files.
                            middlewares.push( connect.static( base ) );
                        });

                        // Make directory browse-able.
                        middlewares.push( connect.directory( directory ) );

                        return middlewares;
                    }                    
                }
            }
        },
        
        // Watch for source file changes
		watch: {
            options: {
                livereload: true,
                spawn: false
            },        
            html: {
                files: [ "src/**/*.html" ],
                tasks: [
                    "copy:dist", 
                    "htmlmin:dist"
                ]
            },
            css: {
                files: [ "src/**/*.css" ],
                tasks: [
                    "copy:dist", 
                    "cssmin:dist"
                ],
            },
            js: {
                files: [ "src/**/*.js" ],
                tasks: [
                    "copy:dist", 
                    "uglify:dist"
                ],
            }
        },
	});   
   
    
    /* 
     * Watch event handler.  Dynamically updates build targets to only
     * modify the file that was changed (speeds up responsiveness of livereload).
     */ 
    grunt.event.on( "watch", function( action, filepath, target ) {
    
        // Normalize the directory separators
        filepath = filepath.replace( /\\/g, "/" );  
        
        // Copy the updated file, removing the current working directory first
        grunt.config( "copy.dist.src", filepath.replace( grunt.config( "copy.dist.cwd" ), "" ) );
        
        // For HTML, minifiy only the new file
        if( target === "html" ) {
            grunt.config( "htmlmin.dist.src", filepath.replace( grunt.config( "htmlmin.dist.cwd" ), "" ) );
        }        
    });
};