angular.module('app', ['ui.router', 'ngResource', 'templates.app', 'series']);

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /series
    $urlRouterProvider.otherwise("/series");

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
});
