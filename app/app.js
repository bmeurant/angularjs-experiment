angular.module('app', ['ui.router', 'ngResource', 'templates.app', 'series', 'rhForm', 'validator', 'rhMoment']);

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /series
    $urlRouterProvider.otherwise("/series");
});
