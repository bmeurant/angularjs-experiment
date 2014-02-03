var seriesResource = angular.module('resources.series', ['ngResource']);

seriesResource.factory('Series', ['$resource',
    function($resource){
        return $resource('series/:id', {}, {
            query: {method:'GET', params:{id:''}, isArray:true}
        });
    }]);