angular.module('app', ['ui.router', 'ngResource', 'templates.app', 'series', 'rhForm', 'validator']);

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /series
    $urlRouterProvider.otherwise("/series");
});
