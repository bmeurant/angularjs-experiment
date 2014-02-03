angular.module('series', ['resources.series', 'resources.albums'])

    .config(function ($stateProvider) {
        $stateProvider
            .state('series', {
                url: "/series",
                templateUrl: 'series/series-list.html',
                controller: 'seriesListCtrl',
                resolve: {
                    series: ['Series', function (Series) {
                        return Series.query();
                    }]
                }
            })
            .state('series.item', {
                abstract: true,
                url: '/{id:[0-9]{1,4}}',
                templateUrl: "series/series-item.html",
                controller: 'seriesItemCtrl',
                resolve: {
                    seriesItem: ['Series', '$stateParams', function (Series, $stateParams) {
                        return Series.get({id: $stateParams.id});
                    }]
                }
            })
            .state('series.item.detail', {
                url: "",
                templateUrl: "series/series-detail.html"
            })
            .state('series.item.edit', {
                url: "/edit",
                controller: 'seriesItemEditCtrl',
                templateUrl: "series/series-edit.html"
            })
    })

    .controller('seriesListCtrl', ['$scope', 'series', function ($scope, series) {
        $scope.series = series;
    }])

    .controller('seriesItemCtrl', ['$scope', '$state', 'seriesItem', function ($scope, $state, seriesItem) {
        $scope.seriesItem = seriesItem;
        $scope.edit = function () {
            $state.go('series.item.edit');
        }
    }])

    .controller('seriesItemEditCtrl', ['$scope', '$state', 'seriesItem', function ($scope, $state, seriesItem) {
        $scope.seriesItem = seriesItem;
        $scope.cancel = function () {
            $state.go('series.item.detail');
        }
    }]);