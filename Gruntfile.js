module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({

    // Lint js files
    jshint: {
      all: {
        options: {
          'node': true,
          'laxcomma': true
        },
        src: [
          '*.js',
          'lib/**/*.js',
          'public/js/**/*.js',
          'widgets/**/*.js',
          'producers/**/*.js',
          'test/**/*.js'
        ]
      }
    },

    // Compile hbs templates to js
    handlebars: {
      compile: {
        files: {
          // Make sure we don't put in in the JSHint path
          'public/templates.js': 'public/hbs/**/*.hbs'
        },
        options: {
          namespace: 'JST',
          processName: function(filename) {
            // Remove the leading 'public/hbs/' 
            // and file extension '.hbs' in path
            return filename.replace(/^public\/hbs\//, '').replace(/.hbs$/, '');
          }
        }
      }
    },

    // Watch files: lint js and compile templates
    watch: {
      scripts: {
        files: '<%= jshint.all.src %>',
        tasks: ['jshint']
      },
      templates: {
        files: 'public/hbs/**/*.hbs',
        tasks: ['handlebars']
      }
    },

    // Clean build directory
    clean: {
      build: ['public/build/'],
      // After build, get rid of intermediate files
      tmp: [
        'public/build/require.js',
        'public/build/app.js',
        'public/build/style.css'
      ]
    },

    // Combine all AMD js modules into one file
    requirejs: {
      compile: {
        options: {
          baseUrl: 'public/js',
          mainConfigFile: 'public/js/config.js',
          // Output file
          out: 'public/build/require.js',
          // Root application module
          name: 'config',
          // Do not wrap everything in an IIFE
          wrap: false
        }
      }
    },

    // Concatenate js and css files
    concat: {
      app: {
        src: [
          'public/components/almond/almond.js',
          'public/build/require.js'
        ],
        dest: 'public/build/app.js',
        separator: ';'
      },
      style: {
        src: ['public/css/style.css'],
        dest: 'public/build/style.css'
      }
    },

    // Minify js files
    uglify: {
      app: {
        files: {
          'public/build/app.min.js': ['<%= concat.app.dest %>']
        }
      }
    },

    // Minify css files
    cssmin: {
      style: {
        files: {
          'public/build/style.min.css': ['<%= concat.style.dest %>']
        }
      }
    }

  });

  // Load tasks from plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task
  grunt.registerTask('default', ['jshint']);

  // Build for deployment
  grunt.registerTask('build', ['clean', 'jshint', 'handlebars', 'requirejs', 'concat', 'uglify', 'cssmin', 'clean:tmp']);

};