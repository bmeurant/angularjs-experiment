module.exports = function (grunt) {

    var env = grunt.option('env') || 'dev';

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
            },
            e2e: {
                configFile: 'test/config/karma-e2e.conf.js',
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
                files: ['app/**/*.js', 'app/**/*.html', 'app/stylesheets/*.less', 'static/**/*.*', 'index.html'],
                tasks: ['build']
            },
            tests: {
                files: ['app/**/*.js', 'app/**/*.html', 'test/unit/*.js'],
                tasks: ['karma:unit:run']
            },
            e2e: {
                files: ['app/**/*.js', 'app/**/*.html', 'test/e2e/*.js'],
                tasks: ['karma:e2e']
            }
        },
        concat: {
            javascript: {
                src: ['app/**/*.js', 'dist/templates/**/*.js', '!app/resources/**/*.js', '!app/dev.js', '!app/prod.js'],
                dest: 'dist/application.js'
            },
            dev : {
                src: ['app/dev.js', 'app/resources/dev/*.js'],
                dest: 'dist/env.js'
            },
            prod: {
                src: ['app/prod.js', 'app/resources/prod/*.js'],
                dest: 'dist/env.js'
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

    grunt.registerTask('build', ['less:compile', 'html2js', 'copy', 'concat:javascript', 'concat:' + env]);
    grunt.registerTask('serve', ['connect', 'build', 'watch:scripts']);
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('tests', ['build', 'karma:unit', 'watch:tests']);
    grunt.registerTask('e2e', ['build', 'karma:e2e', 'watch:e2e']);
};