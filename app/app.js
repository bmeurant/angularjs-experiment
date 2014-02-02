angular.module('app', ['ngRoute', 'ngResource', 'templates.app', 'series']);

angular.module('app').controller('appCtrl', ['$scope', '$location', function($scope, $location) {
    $location.path('/series');
}]);
