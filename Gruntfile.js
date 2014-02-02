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
                    {expand: true, cwd: 'bower_components/jquery/', src: ['jquery.min.*'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/bootstrap/dist/css/', src: ['bootstrap.css'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/moment/', src: ['moment.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/angular-route/', src: ['angular-route.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/angular-resource/', src: ['angular-resource.js'], dest: 'dist/libs/'},
                    {expand: true, cwd: 'bower_components/angular-mocks/', src: ['angular-mocks.js'], dest: 'dist/libs/'}
                ]
            },
            static: {
                files: [
                    {expand: true, cwd: 'static/', src: ['**/*.*'], dest: 'dist/static/'}
                ]
            },
            fixtures: {
                files: [
                    {expand: true, cwd: 'fixtures/', src: ['**/*.*'], dest: 'dist/fixtures/'}
                ]
            },
            libs: {
                files: [
                    {expand: true, cwd: 'libs/', src: ['**/*.*'], dest: 'dist/libs/'}
                ]
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
            fixtures: {
                files: ['fixtures/**/*.json'],
                tasks: ['build']
            },
            indexHTML: {
                files: ['index.html'],
                tasks: ['build']
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
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('build', ['less:compile', 'html2js', 'copy', 'concat']);
    grunt.registerTask('serve', ['connect', 'build', 'watch']);
    grunt.registerTask('default', ['serve']);
};