// Karma configuration
// Generated on Sat Feb 08 2014 18:02:26 GMT+0100 (Paris, Madrid)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../../',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'dist/libs/jquery.js',
            'dist/libs/angular.js',
            'dist/libs/angular-ui-router.js',
            'dist/libs/angular-resource.js',
            'dist/libs/angular-mocks.js',
            'dist/libs/moment.js',
            'dist/libs/lang/fr.js',
            'dist/libs/angular-translate.js',
            'dist/application.js',
            'test/unit/**/*.js',
            'test/integration/**/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine'
        ],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
