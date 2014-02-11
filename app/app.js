var app = angular.module('appRoot', ['ui.router', 'ngResource', 'templates.app', 'series', 'rhForm', 'validator', 'rhMoment', 'pascalprecht.translate', 'labels']);

app.config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /series
    $urlRouterProvider.otherwise("/series");
});

app.controller('appCtrl', function ($scope, $translate) {
    $scope.changeLanguage = function (key) {
        $translate.uses(key);
        moment.lang(key);
    }
});
