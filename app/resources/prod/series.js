var seriesResource = angular.module('resources.series', ['ngResource']);

seriesResource.factory('Series', ['$resource', function ($resource) {

    var res = $resource('http://localhost:8080/api/series/:id', {id: '@id'}, {
            query: {
                method: 'GET',
                transformResponse: function (data) {
                    return JSON.parse(data).content;
                },
                isArray: true
            },
            get: {method: 'GET'},
            save: {method:'POST'},
            update: {
                method:'PUT',
                transformRequest: function (data) {
                    data.albums = null;
                    delete data.validations;
                    return JSON.stringify(data);
                }
            }
        }
    );

    return res;
}]);