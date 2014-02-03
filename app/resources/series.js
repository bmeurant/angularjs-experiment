var seriesResource = angular.module('resources.series', ['ngResource', 'resources.albums']);

seriesResource.factory('Series', ['$resource', 'Albums', function ($resource, Albums) {
    var res = $resource('series/:id', {id: '@id'}, {
        query: {method: 'GET', isArray: true},
        get: {method: 'GET',
            transformResponse: function (seriesItem) {
                if (Array.isArray(seriesItem.albums)) {
                    var fullAlbums = [];
                    seriesItem.albums.forEach(function (item) {
                        fullAlbums.push(Albums.get({id: item}));
                    });
                    seriesItem.albums = fullAlbums;
                }
                return seriesItem;
            }.bind(this)
        }});

    return res;
}]);