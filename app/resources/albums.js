var seriesResource = angular.module('resources.albums', ['ngResource']);

seriesResource.factory('Albums', ['$resource', function ($resource) {
    return $resource('albums/:id', {id: '@id'});
}]);