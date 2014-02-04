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
    })

    .factory('SeriesModel', function($q, Series){
        var Model = function(Series){
            this.resource = Series;
            this.data = $q.defer();
            this.fetch();
        };

        Model.prototype.fetch = function(){
            Series.query().$promise.then(function(result) {
                this.data.resolve(result);
            }.bind(this));
        };

        Model.prototype.all = function(){
            return this.data.promise;
        };

        Model.prototype.get = function(id){
            var itemData = $q.defer();
            this.data.promise.then(function(data) {
                itemData.resolve(data[id - 1]);
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

    .controller('seriesItemEditCtrl', ['$scope', '$state', '$stateParams', 'SeriesModel', function ($scope, $state, $stateParams, SeriesModel) {
        SeriesModel.get($stateParams.id).then( function (seriesItem) {
            $scope.seriesItem = seriesItem;
        });
        $scope.cancel = function () {
            $state.go('series.item.detail');
        }
    }]);