//Gruntfile
module.exports = function(grunt) {

    var jsFiles = [
        './bower_components/jquery/dist/jquery.js',
        './bower_components/angular/angular.js',
        './src/js/main.js'
    ];

    //Initializing the configuration object
    grunt.initConfig({

        // Task configuration
        concat: {
            options: {
                separator: ';',
            },
            frontend: {
                src: jsFiles,
                dest: 'app/js/main.js',
            },
        },
        uglify: {
            // options: {
            //     mangle: false // Use if you want the names of your functions and variables unchanged
            // },
            frontend: {
                files: {
                    'app/js/main.js': 'app/js/main.js',
                }
            }
        },
        sass: { 
            dist: { 
                options: { 
                    compass: true,
                    noCache: true,
                    style: 'expanded' // or compressed
                },
                files: { 
                    'app/css/main.css': 'src/sass/main.scss'
                }
            }
        },
        watch: {
            frontend: {
                files: ['src/js/*.js'],
                tasks: ['concat:frontend'], //, 'uglify:frontend'
            },
            sass: {
                files: ['src/sass/*.scss'], 
                tasks: ['sass:dist']
            }
        }
    });

    // Plugin loading
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Task definition
    grunt.registerTask('dev', ['watch']);

    grunt.registerTask('default', [
        'concat:frontend',
        'uglify:frontend',
        'sass'
    ]);

};