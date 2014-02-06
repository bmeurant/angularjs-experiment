angular.module('series', ['resources.series'])

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
    })

    .factory('SeriesModel', function($q, Series){
        var Model = function(Series){
            this.resource = Series;
            this.deferred = $q.defer();
            this.fetch();
        };

        Model.prototype.fetch = function(){
            Series.query().$promise.then(function(result) {
                this.deferred.resolve(result);
            }.bind(this));
        };

        Model.prototype.all = function(){
            return this.deferred.promise;
        };

        Model.prototype.get = function(id){
            var itemData = $q.defer();
            this.deferred.promise.then(function(data) {
                itemData.resolve(data.filter(function(item) {
                    return item.id == id;
                })[0]);
            }.bind(this));
            return itemData.promise;
        };

        return new Model(Series);
    })

    .controller('seriesListCtrl', function ($scope, SeriesModel) {
        SeriesModel.all().then( function (series) {
            $scope.series = series;
        });

        $scope.fetch = function(){
            SeriesModel.fetch();
        };
    })

    .controller('seriesItemCtrl', ['$scope', '$state', '$stateParams', 'SeriesModel', function ($scope, $state, $stateParams, SeriesModel) {
        SeriesModel.get($stateParams.id).then( function (seriesItem) {
            $scope.seriesItem = seriesItem;
        });
        $scope.edit = function () {
            $state.go('series.item.edit');
        }
    }])

    .controller('seriesItemEditCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'SeriesModel', function ($rootScope, $scope, $state, $stateParams, SeriesModel) {
        SeriesModel.get($stateParams.id).then( function (item) {
            $scope.seriesItem = item;
            $scope.original = angular.copy(item);
        });

        $scope.cancel = function () {
            if ($scope.seriesItemForm.$dirty)
                angular.copy($scope.original, $scope.seriesItem);
            $state.go('series.item.detail');
        };

        $scope.save = function () {
            if ($scope.seriesItemForm.$dirty)
                angular.copy($scope.seriesItem, $scope.original);
            $scope.seriesItemForm.$setPristine(true);
            $state.go('series.item.detail');
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ((fromState.name == 'series.item.edit') && ($scope.seriesItemForm.$dirty)) {
                angular.copy($scope.original, $scope.seriesItem);
            }
        });
    }]);