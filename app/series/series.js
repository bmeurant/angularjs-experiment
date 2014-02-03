angular.module('series', ['resources.series'])

    .config(function ($stateProvider) {
        $stateProvider
            .state('series', {
                url: "/series",
                templateUrl: 'series/series-list.html',
                controller: 'seriesListViewCtrl',
                resolve: {
                    series: ['Series', function (Series) {
                        return Series.query();
                    }]
                }
            })
            .state('series.detail', {
                url: "/{id:[0-9]{1,4}}",
                templateUrl: "series/series-detail.html",
                controller: 'seriesDetailViewCtrl',
                resolve: {
                    seriesItem: ['Series', '$stateParams', function (Series, $stateParams) {
                        return Series.get({id: $stateParams.id});
                    }]
                }
            })
    })

    .controller('seriesListViewCtrl', ['$scope', 'series', function ($scope, series) {
        $scope.series = series;
    }])

    .controller('seriesDetailViewCtrl', ['$scope', 'seriesItem', function ($scope, seriesItem) {
        $scope.seriesItem = seriesItem;
    }]);