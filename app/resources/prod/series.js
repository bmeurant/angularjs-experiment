var seriesResource = angular.module('resources.series', ['ngResource']);

seriesResource.factory('Series', ['$resource', function ($resource) {

    var res = $resource('http://localhost:8080/api/series/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
            save: {method:'POST'},
            update: {method:'PUT'}
        }
    );

    return res;
}]);