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
                itemData.resolve(data[id - 1]);
            }.bind(this));
            return itemData.promise;
        };

        Model.prototype.rollback = function(item){
            this.deferred.promise.then(function(data) {
                Series.get({id:item.id}).$promise.then(function(itemData) {
                    var newItemData = data[item.id - 1];
                    //data[item.id - 1].title = itemData.title;
                    for (key in itemData) {
                        if (key[0] != '$')  {
                            newItemData[key] = itemData[key];
                        }
                    }
                    this.deferred.resolve(data);
                }.bind(this));
            }.bind(this));
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
            SeriesModel.rollback($scope.seriesItem);
            $state.go('series.item.detail');
        }
    }]);