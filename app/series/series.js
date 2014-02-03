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
                    seriesItem: ['Series', 'Albums', '$stateParams', function (Series, Albums, $stateParams) {
                        return Series.get({id: $stateParams.id}, function(seriesItem) {
                            if (Array.isArray(seriesItem.albums)) {
                                var fullAlbums = [];
                                seriesItem.albums.forEach(function(item) {
                                    fullAlbums.push(Albums.get({id: item}));
                                });
                                seriesItem.albums = fullAlbums;
                            }
                        });
                    }]
                }
            })
            .state('series.item.detail', {
                url: "",
                templateUrl: "series/series-detail.html"
            })
    })

    .controller('seriesListCtrl', ['$scope', 'series', function ($scope, series) {
        $scope.series = series;
    }])

    .controller('seriesItemCtrl', ['$scope', 'seriesItem', function ($scope, seriesItem) {
        $scope.seriesItem = seriesItem;
    }]);