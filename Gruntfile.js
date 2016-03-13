module.exports = function (grunt) {
	
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			options: {
				separator: '\n\n',
				//banner: '/*! <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				banner: "'use strict';\n",
				
				// Replace all 'use strict' statements in the code with a single one at the top
				process: function(src, filepath) {
					return '/* Source: ' + filepath + ' */' + '\n' +
					src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
				},
			},
			dist: {
				src: ['app/app.js', 'app/controllers/*.js', 'app/services/*.js'],
				dest: 'app/<%= pkg.name %>.js',
			},
		},

		watch: {
			scripts: {
				files: ['**/*.js', '!app/<%= pkg.name %>.js'],
				tasks: ['concat'],
				options: {
					spawn: false,
				},
			},
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'app/<%= pkg.name %>.js',
				dest: 'dest/app/<%= pkg.name %>.js'
			}
		},

		ngAnnotate: {
			options: {
				singleQuotes: true,
			},
			appFile: {
				files: [
				{
					expand: true,
					src: ['app/<%= pkg.name %>.js'],
				},
				],
			}
		},

		copy: {
			main: {
				files: [
				{
			      	expand: false, 
			      	src: [
				      	'app/css/**',
				      	'app/libs/**',
				      	'app/res/**',
				      	'app/templates/**',
				      	'app/index.html'
			      	], 
			      	dest: 'dest/'
			    },  
			    ],
			},
		},


	});

 	// Load the plugin that provides the "uglify" task.
 	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Load the plugin that provides the "concat" task.
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Load the plugin that provides the "watch" task.
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Load the plugin that provides the "copy" task.
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Load the plugin that provides the "ngAnnotate" task.
	grunt.loadNpmTasks('grunt-ng-annotate');


	// Default task(s).
	grunt.registerTask('default', ['concat']);


};