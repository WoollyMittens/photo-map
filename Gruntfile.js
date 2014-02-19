module.exports = function(grunt) {

	// components
	var name = 'photomap';
	var libs = [
		'../useful-requests/src/js/useful-requests.js',
		'../useful-polyfills/src/js/useful-polyfills.js'
	];

	// configuration.
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			serve: {
				options: {
					port: 8000,
					base: './'
				}
			}
		},
		watch: {
			compass: {
				files: ['./src/scss/*.{scss,sass}'],
				tasks: ['compass']
			},
			jshint: {
				files: ['./src/js/*.js'],
				tasks: ['jshint']
			},
			concat: {
				files: ['./src/js/*.js'],
				tasks: ['concat']
			}
		},
		copy: {
			target: {
				flatten: true,
				expand: true,
				src: libs,
				dest: './src/lib/'
			}
		},
		compass: {
			dev : {
				options: {
					sassDir: ['./src/scss'],
					cssDir: ['./inc/css'],
					environment: 'development'
				}
			},
			prod : {
				options: {
					sassDir: ['./src/scss'],
					cssDir: ['./inc/css'],
					environment: 'production'
				}
			}
		},
		jshint: {
			files: ['./src/js/*.js'],
			options: {
				globals: {
					console: true
				}
			}
		},
		concat: {
			all : {
				src: ['./src/lib/*.js', './src/js/*.js'],
				dest: './inc/js/useful-' + name + '.js'
			}
		}
	};

	// named properties
	config.uglify = {};
	config.uglify.files = {};
	config.uglify.files['./inc/js/useful-' + name + '.js'] = ['./src/lib/*.js', './src/js/*.js'];

	// init
	grunt.initConfig(config);

	// dependencies
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// tasts
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('serve', ['connect', 'watch']);
	grunt.registerTask('dev', ['compass', 'jshint', 'concat']);
	grunt.registerTask('prod', ['compass', 'jshint', 'uglify']);
	grunt.registerTask('import', ['copy']);

};