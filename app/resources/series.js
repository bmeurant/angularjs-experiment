var seriesResource = angular.module('resources.series', ['ngResource']);

seriesResource.factory('Series', ['$resource',
    function($resource){
        return $resource('series', {}, {
            query: {method:'GET', isArray:true}
        });
    }]);