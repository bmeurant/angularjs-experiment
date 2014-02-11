var seriesResource = angular.module('resources.albums', ['ngResource']);

seriesResource.factory('Albums', ['$resource', function ($resource) {
    return $resource('http://localhost:8080/api/albums/:id', {id: '@id'});
}]);