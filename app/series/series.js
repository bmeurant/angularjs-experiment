angular.module('series', ['resources.series'])

    .controller('seriesListViewCtrl', ['$scope', 'series', function ($scope, series) {
        $scope.series = series;
    }])

    .controller('seriesDetailViewCtrl', ['$scope', 'seriesItem', function ($scope, seriesItem) {
        $scope.seriesItem = seriesItem;
    }]);