module.exports = function(grunt) {

	// COMPONENTS
	
	var name = 'photomap';
	var libs = [
		'../useful-requests/src/js/useful-requests.js',
		'../useful-polyfills/src/js/useful-polyfills.js'
	];
	var mixins = [
		'../useful/src/scss/_mixins.scss'
	];

	// CONFIGURATION

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
			libs: {
				flatten: true,
				expand: true,
				src: libs,
				dest: './src/lib/'
			},
			mixins: {
				flatten: true,
				expand: true,
				src: mixins,
				dest: './src/scss/'
			},
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
		},
		uglify: {
			all : {
				src: ['./src/lib/*.js', './src/js/*.js'],
				dest: './inc/js/useful-' + name + '.js'
			}
		},
		font_optimizer: {
			all: {
				options: {
					chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_+={}\\/":;><.,\'',
					includeFeatures: ['kern']
				},
				files: {
					'./inc/fonts/': ['./src/fonts/*.ttf']
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 version', 'ie 8', 'ie 9']
			},
			no_dest: {
				src: '**/inc/css/*.css'
			}
		}
	};

	// init
	grunt.initConfig(config);

	// DEPENDENCIES
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-font-optimizer');
	grunt.loadNpmTasks('grunt-autoprefixer');

	// TASKS
	
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('serve', ['connect', 'watch']);
	grunt.registerTask('dev', ['compass', 'autoprefixer', 'concat']);
	grunt.registerTask('prod', ['compass', 'autoprefixer', 'uglify']);
	grunt.registerTask('import', ['copy']);
	grunt.registerTask('fonts', ['font_optimizer']);

};