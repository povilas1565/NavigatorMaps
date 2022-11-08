'use strict';
var lrSnippet, mountFolder,
	LIVERELOAD_PORT = 35728,
	PORT = process.env.PORT || 9000,
	HOSTNAME = process.env.IP || 'localhost';

lrSnippet = require('connect-livereload')({
	port: LIVERELOAD_PORT
});

mountFolder = function (connect, dir) {
	return connect['static'](require('path').resolve(dir));
};

module.exports = function (grunt) {
	var yeomanConfig;
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	yeomanConfig = {
		app: 'src',
		dist: 'dist'
	};

	try {
		yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
	} catch (_error) {}

	// grunt.loadNpmTasks('grunt-heroku-deploy');

	grunt.initConfig({
		yeoman: yeomanConfig,
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			less: {
				files: ['<%= yeoman.app %>/styles-less/**/*.less'],
				tasks: ['less:server']
			},
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%= yeoman.app %>/index.html',
					'<%= yeoman.app %>/views/**/*.html',
					'<%= yeoman.app %>/styles-less/**/*.less',
					'.tmp/css/**/*.css',
					'{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
					'<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		connect: {
			options: {
				port: PORT,
				hostname: HOSTNAME,
			},
			livereload: {
				options: {
					base: ['<%= yeoman.app %>'],
					middleware: function (connect) {
						return [lrSnippet, mountFolder(connect, '.tmp'), mountFolder(connect, yeomanConfig.app)];
					}
				}
			},
			test: {
				options: {
					middleware: function (connect) {
						return [mountFolder(connect, '.tmp'), mountFolder(connect, 'test')];
					}
				}
			},
			dist: {
				options: {
					middleware: function (connect) {
						return [mountFolder(connect, yeomanConfig.dist)];
					}
				}
			}
		},

		open: {
			server: {
				url: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'<%= yeoman.app %>/js/**/*.js',
				'Gruntfile.js',
				'!<%= yeoman.app %>/js/old/**/*.js',
				'!<%= yeoman.app %>/js/config.js',
				'!<%= yeoman.app %>/**/*.min.js'
			]
		},

		less: {
			server: {
				options: {
					strictMath: true,
					dumpLineNumbers: true,
					sourceMap: true,
					sourceMapRootpath: '',
					outputSourceFiles: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/styles-less',
					src: 'app.less',
					dest: '.tmp/css',
					ext: '.css'
				}]
			},
			dist: {
				options: {
					cleancss: true,
					report: 'min'
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/styles-less',
					src: 'app.less',
					dest: '.tmp/css',
					ext: '.css'
				}]
			}
		},

		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/js/{,*/}*.js',
						'<%= yeoman.dist %>/css/{,*/}*.css'
					]
				}
			}
		},

		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>',
				flow: {
					steps: {
						js: [
							'concat',
							'uglifyjs'
						],
						css: ['concat']
					},
					post: []
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'<%= yeoman.dist %>/css/app.css': ['.tmp/css/{,*/}*.css']
				}
			}
		},

		usemin: {
			html: [
				'<%= yeoman.dist %>/{,*/}*.html',
				'!<%= yeoman.dist %>/bower_components/**'
			],
			css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
			options: {
				dirs: ['<%= yeoman.dist %>']
			}
		},

		htmlmin: {
			dist: {
				options: {},
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>',
					src: [
						'*.html',
						'views/**/*.html'
					],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'.htaccess',
						'*.html',
						'robots.txt',
						'favicon.ico',
						'js/mocks/*',
						'img/**/*'
					]
				}, {
					expand: true,
					flatten: true,
					cwd: '<%= yeoman.app %>',
					src: [
						'fonts/*',
						'bower_components/font-awesome/fonts/*',
						'bower_components/bootstrap/fonts/*'
					],
					dest: '<%= yeoman.dist %>/fonts'
				}, {
					expand: true,
					flatten: true,
					cwd: '',
					dest: '/js',
					src: ['bower_components/underscore/underscore-min.map']
				}, {
					expand: true,
					cwd: '.tmp',
					src: [
						'css/**',
						'assets/**'
					],
					dest: '<%= yeoman.dist %>'
				}, {
					expand: true,
					cwd: '.tmp/images',
					src: ['generated/*'],
					dest: '<%= yeoman.dist %>/images'
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/css/',
				src: '**/*.css'
			}
		},

		concurrent: {
			lessServer: ['less:server', 'copy:styles'],
			lessDist: ['less:dist', 'copy:styles', 'htmlmin']
		},

		concat: {
			options: {
				separator: grunt.util.linefeed + ';' + grunt.util.linefeed
			}
		},

		uglify: {
			production: {
				options: {
					mangle: false,
					compress: {
						drop_console: true
					}
				},
				files: [{
					expand: true,
					cwd: '.tmp/concat/js',
					src: ['**/*.js'],
					dest: '<%= yeoman.dist %>/js'
				}]
			}
		},

		autoprefixer: {
			dist: {
				src: '.tmp/css/app.css',
				dest: '.tmp/css/app.css'
			},
		},

		ngconstant: {
			// Options for all targets
			options: {
				space: '  ',
				wrap: '"use strict";\n\n {%= __ngModule %}',
				name: 'navigatorConfig',
			},
			// Environment targets
			dev: {
				options: {
					debug: true,
					dest: '<%= yeoman.app %>/js/config.js'
				},
				constants: {
					API: {
						apiUrl: 'http://api.navigatorglass.com/api/'
					}
				}
			},

			stage: {
				options: {
					debug: true,
					dest: '<%= yeoman.app %>/js/config.js'
				},
				constants: {
					API: {
						apiUrl: 'http://api.navigatorglass.com/api/'
					}
				}
			},

			prod: {
				options: {
					debug: true,
					dest: '<%= yeoman.app %>/js/config.js'
				},
				constants: {
					API: {
						apiUrl: 'http://api.navigatorglass.com/api/'
					}
				}
			}
		}

	});

	grunt.registerTask('lessServer', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['buildLess', 'open', 'connect:dist:keepalive']);
		}
		return grunt.task.run(['clean:server', 'concurrent:lessServer', 'connect:livereload', 'open', 'watch']);
	});


	grunt.registerTask('buildLess', [
		'clean:dist',
		'useminPrepare',
		'less:dist',
		'autoprefixer',
		'copy:styles',
		'htmlmin',
		'copy:dist',
		'concat',
		'uglify:production',
		'cssmin',
		'rev',
		'usemin'
	]);

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('testless', [
		'jshint',
		'useminPrepare',
		'concurrent:lessDist'
	]);

	grunt.registerTask('default', ['serve:dev']);
	grunt.registerTask('build', ['buildLess']);

	grunt.registerTask('serve:dev', [
		'jshint',
		'clean:server',
		'ngconstant:dev',
		'concurrent:lessServer',
		'autoprefixer',
		'connect:livereload',
		'open',
		'watch'
	]);

	grunt.registerTask('serve:stage', [
		'jshint',
		'clean:stage',
		'ngconstant:prod',
		'concurrent:lessServer',
		'autoprefixer',
		'connect:livereload',
		'open',
		'watch'
	]);

	grunt.registerTask('serve:prod', [
		'jshint',
		'clean:server',
		'ngconstant:prod',
		'concurrent:lessServer',
		'autoprefixer',
		'connect:livereload',
		'open',
		'watch'
	]);
	grunt.registerTask('c9', [
		'jshint',
		'clean:server',
		'concurrent:lessServer',
		'connect:livereload',
		'watch'
	]);
};