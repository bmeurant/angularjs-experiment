module.exports = function (grunt) {

    grunt.initConfig({

        less: {
            compile: {
                options: {
                    paths: ['app/stylesheets'],
                    yuicompress: true
                },
                files: {
                    'dist/application.css': 'app/stylesheets/app.less'
                }
            }
        },
        copy: {
            bower: {
                files: [
                    {expand: true, cwd: 'bower_components/angular/', src: ['angular.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/jquery/', src: ['jquery.js*'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/bootstrap/dist/css/', src: ['bootstrap.css'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/moment/', src: ['moment.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/moment/lang', src: ['fr.js'], dest: 'dist/libs/lang'},
                    {expand: true, cwd: 'bower_components/angular-resource/', src: ['angular-resource.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/angular-mocks/', src: ['angular-mocks.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/angular-ui-router/release/', src: ['angular-ui-router.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/angular-translate/', src: ['angular-translate.js'], dest: 'dist/libs/'}
                ]
            },
            static: {
                files: [
                    {expand: true, cwd: 'static/', src: ['**/*.*'], dest: 'dist/static/'}
                ]
            },
            libs: {
                files: [
                    {expand: true, cwd: 'libs/', src: ['**/*.*'], dest: 'dist/libs/'}
                ]
            }
        },
        karma: {
            unit: {
                configFile: 'test/config/karma.conf.js',
                background: false
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001
                }
            }
        },
        watch: {
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['build']
            },
            templates: {
                files: ['app/**/*.html'],
                tasks: ['build']
            },
            styles: {
                files: ['app/stylesheets/*.less'],
                tasks: ['build']
            },
            static: {
                files: ['static/**/*.*'],
                tasks: ['build']
            },
            indexHTML: {
                files: ['index.html'],
                tasks: ['build']
            },
            karma: {
                files: ['app/**/*.js', 'test/unit/*.js'],
                tasks: ['karma:unit:run']
            }
        },
        concat: {
            javascript: {
                src: ['app/**/*.js', 'dist/templates/**/*.js'],
                dest: 'dist/application.js'
            }
        },
        html2js: {
            app: {
                options: {
                    base: 'app'
                },
                src: ['app/**/*.html'],
                dest: 'dist/templates/app.js',
                module: 'templates.app'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html2js')
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('build', ['less:compile', 'html2js', 'copy', 'concat']);
    grunt.registerTask('serve', ['connect', 'build', 'watch']);
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('tests', ['build', 'karma:unit', 'watch']);
};