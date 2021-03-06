// Generated on 2014-10-13 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app:'app',
    dist: 'www',
    stage: 'stage'
  };
    

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
//        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
//        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css','<%= yeoman.app %>/styles/less/*.less'],
        tasks: ['less:development', 'newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
//    jshint: {
//      options: {
//        jshintrc: '.jshintrc',
//        reporter: require('jshint-stylish')
//      },
//      all: {
//        src: [
//          'Gruntfile.js',
//          '<%= yeoman.app %>/scripts/{,*/}*.js'
//        ]
//      },
//      test: {
//        options: {
//          jshintrc: 'test/.jshintrc'
//        },
//        src: ['test/spec/{,*/}*.js']
//      }
//    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      stage: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.stage %>/{,*/}*',
            '!<%= yeoman.stage %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      stage: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        //ignorePath:  /\.\.\//
      },
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      },
      stage: {
        src: [
          '<%= yeoman.stage %>/scripts/{,*/}*.js',
          '<%= yeoman.stage %>/styles/{,*/}*.css',
          '<%= yeoman.stage %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
        dist: {
          html: '<%= yeoman.app %>/index.html',
          options: {
            dest: '<%= yeoman.dist %>',
            flow: {
              html: {
                steps: {
                  js: ['concat'],
                  css: ['cssmin']
                },
                post: {}
              }
            }
          }
        },
        stage: {
          html: '<%= yeoman.app %>/index.html',
          options: {
            dest: '<%= yeoman.stage %>',
            flow: {
              html: {
                steps: {
                  js: ['concat'],
                  css: ['cssmin']
                },
                post: {}
              }
            }
          }
        }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      dist:{
        html: ['<%= yeoman.dist %>/{,*/}*.html'],
        css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
        options: {
          assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
        }
      },
      stage: {
        html: ['<%= yeoman.stage %>/{,*/}*.html'],
        css: ['<%= yeoman.stage %>/styles/{,*/}*.css'],
        options: {
          assetsDirs: ['<%= yeoman.stage %>','<%= yeoman.stage %>/images']
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js', 
          ]
        }
      },
      stage: {
        files: {
          '<%= yeoman.stage %>/scripts/scripts.js': [
            '<%= yeoman.stage %>/scripts/scripts.js', 
          ]
        }
      }
    },
    
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      },
      stage: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.stage %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      },
      stage: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.stage %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: false,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html', 'views/templates/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      },
      stage: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: false,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.stage %>',
          src: ['*.html', 'views/{,*/}*.html', 'views/templates/{,*/}*.html'],
          dest: '<%= yeoman.stage %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: ['*.js'],
          dest: '<%= yeoman.dist %>/scripts'
        }]
      },
      stage: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.stage %>/scripts',
          src: ['*.js'],
          dest: '<%= yeoman.stage %>/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/index.html']
      },
      stage: {
        html: ['<%= yeoman.stage %>/index.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt,py,yaml}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
			      'views/templates/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'braintree/{,*/}*',
            'braintree/util/{,*/}*',
            'dateutil/{,*/}*',
            'certs/*',
            'email/*',
            'email_footers/*',
            'files/*',
            'requests/*',
            'cloudstorage/*',
            'lib/**',
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      stage: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.stage %>',
          src: [
            '*.{ico,png,txt,py,yaml}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'views/templates/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'braintree/{,*/}*',
            'braintree/util/{,*/}*',
            'dateutil/{,*/}*',
            'certs/*',
            'email/*',
            'email_footers/*',
            'files/*',
            'requests/*',
            'cloudstorage/*',
            'lib/**',
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.stage %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.stage %>'
        }]
      },
      server:{
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.stage %>',
          src: [
            'lib/**'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin:dist',
        'svgmin:dist'
      ],
      stage: [
        'copy:styles',
        'imagemin:stage',
        'svgmin:stage'
      ]
    },
    less: {
      development: {
        options: {
          paths: ["styles"]
        },
        files: {
          "<%= yeoman.app %>/styles/main.css": "<%= yeoman.app %>/styles/less/main.less"
        }
      },
      production: {
        options: {
          paths: ["styles"],
          cleancss: true,
        },
        files: {
          "<%= yeoman.app %>/styles/main.css": "<%= yeoman.app %>/styles/less/main.less"
        }
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less:development',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });
    


  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);


  grunt.registerTask('copyServer', [
      'copy:server'
  ])

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare:dist',
    'concurrent:dist',
    'autoprefixer:dist',
    // 'concat',
    // 'ngAnnotate',
    // 'copy:dist',
    // 'cssmin',
    // 'filerev',
    // 'usemin',
    // 'htmlmin'
  ]);

  grunt.registerTask('stage', [
    'clean:stage',
    'wiredep',
    'useminPrepare:stage',
    'concurrent:stage',
    'autoprefixer:stage',
    'concat',
    // 'concat:dist',
    'ngAnnotate',
    'copy:stage',
    // 'cdnify',
    'cssmin',
    // 'uglify',
    'filerev',
    'usemin',
    'htmlmin'
    ])

  grunt.registerTask('default', [
//    'newer:jshint',
    'test',
    'build'
  ]);
};
