var seriesResource = angular.module('resources.series', ['ngResource', 'resources.albums']);

seriesResource.factory('Series', ['$resource', function ($resource) {
    return $resource('series/:id', {id: '@id'});
}]);