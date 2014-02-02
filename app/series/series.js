angular.module('series', ['resources.series'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/series', {
            templateUrl:'series/series-list.html',
            controller:'seriesListViewCtrl',
            resolve:{
                series:['Series', function (Series) {
                    return Series.query();
                }]
            }
        });
    }])

    .controller('seriesListViewCtrl', ['$scope', 'series', function ($scope, series) {
        $scope.series = series;
    }]);