angular.module('series', ['resources.series', 'resources.albums'])

    .config(function ($stateProvider) {
        $stateProvider
            .state('series', {
                url: "/series",
                templateUrl: 'series/series-list.html',
                controller: 'seriesListCtrl'
            })
            .state('series.item', {
                abstract: true,
                url: '/{id:[0-9]{1,4}}',
                templateUrl: "series/series-item.html",
                controller: 'seriesItemCtrl'
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
            .state('series.create', {
                url: "/create",
                controller: 'seriesItemEditCtrl',
                templateUrl: "series/series-edit.html"
            })
    })

    .factory('SeriesModel', ['$q', 'Series', 'Albums', function ($q, Series, Albums) {
        var Model = function (Series) {
            this.resource = Series;
            this.validations = {
                title: {
                    "required": true,
                    "min-length": 5
                },
                scriptwriter: {
                    "required": true,
                    "min-length": 5
                },
                illustrator: {
                    "required": true,
                    "min-length": 5
                },
                publisher: {
                    "required": true,
                    "min-length": 5
                }
            };
            this.fetch();
        };

        var fillAlbums = function (seriesItem) {
            if (Array.isArray(seriesItem.albums)) {
                var fullAlbums = [];
                seriesItem.albums.forEach(function (item) {
                    fullAlbums.push(Albums.get({id: item}));
                });
                seriesItem.albums = fullAlbums;
            }
        }

        var getById = function (series, id) {
            return series.filter(function (item) {
                return item.id == id;
            })[0];
        }

        Model.prototype.fetch = function () {
            this.series = this.resource.query(function (series) {
                for (var index = 0; index < series.length; ++index) {
                    series[index].validations = this.validations;
                    fillAlbums(series[index]);
                }
            }.bind(this));
        };

        Model.prototype.all = function () {
            if (!this.series) {
                this.fetch();
            }
            return this.series;
        };

        Model.prototype.get = function (id) {
            if (!this.series) {
                this.fetch();
            }
            var itemData = $q.defer();
            this.series.$promise.then(function (series) {
                itemData.resolve(getById(series, id));
            });
            return itemData.promise;
        };

        Model.prototype.save = function (seriesItem) {
            var itemData = $q.defer();
            if (seriesItem.id) {
                Series.update({id: seriesItem.id}, seriesItem).$promise.then(function (updated) {
                    this.series.$promise.then(function (series) {
                        var obj = getById(series, seriesItem.id);
                        angular.copy(updated, obj);
                        itemData.resolve(obj);
                    }.bind(this));
                }.bind(this));
            } else {
                Series.save({}, seriesItem).$promise.then(function (updated) {
                    this.series.$promise.then(function (series) {
                        var obj = getById(series, seriesItem.id);
                        angular.copy(updated, obj);
                        itemData.resolve(obj);
                    }.bind(this));
                }.bind(this));
            }

            return itemData.promise;
        };

        Model.prototype.new = function () {
            var newSeries = {
                validations: this.validations,
                coverUrl: '/static/images/series/covers/default.jpg'
            };
            this.series.$promise.then(function (data) {
                data.push(newSeries);
            }.bind(this));
            return newSeries;
        };

        Model.prototype.flush = function () {
            this.series.$promise.then(function (series) {
                for (var index = 0; index < series.length; ++index) {
                    if (series[index].id == undefined)
                        series.splice(index, 1);
                }
            }.bind(this));
        };

        return new Model(Series);
    }])

    .controller('seriesListCtrl', function ($scope, SeriesModel) {
        $scope.series = SeriesModel.all();
    })

    .controller('seriesItemCtrl', ['$scope', '$state', '$stateParams', 'SeriesModel', function ($scope, $state, $stateParams, SeriesModel) {
        SeriesModel.get($stateParams.id).then(function (item) {
            $scope.seriesItem = item;
        });

        $scope.edit = function () {
            $state.go('series.item.edit');
        }
    }])

    .controller('seriesItemEditCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'SeriesModel', function ($rootScope, $scope, $state, $stateParams, SeriesModel) {

        if ($stateParams.id != undefined) {
            SeriesModel.get($stateParams.id).then(function (item) {
                $scope.seriesItem = item;
                $scope.original = angular.copy(item);
            });
        } else {
            $scope.seriesItem = SeriesModel.new();
            $scope.original = angular.copy($scope.seriesItem);
        }

        $scope.cancel = function () {
            if ($scope.seriesItemForm.$dirty)
                angular.copy($scope.original, $scope.seriesItem);
            if (!$scope.seriesItem.id)
                SeriesModel.flush();
            $state.go('series.item.detail');
        };

        $scope.save = function () {
            if ($scope.seriesItemForm.$dirty)
                angular.copy($scope.seriesItem, $scope.original);
            $scope.seriesItemForm.$setPristine(true);
            SeriesModel.save($scope.seriesItem).then(function (item) {
                $state.go('series.item.detail', {id: item.id});
            });
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if ((fromState.name == 'series.item.edit') && ($scope.seriesItemForm.$dirty)) {
                angular.copy($scope.original, $scope.seriesItem);
            }
        });
    }]);