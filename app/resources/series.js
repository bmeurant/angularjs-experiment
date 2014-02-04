var seriesResource = angular.module('resources.series', ['ngResource', 'resources.albums']);

seriesResource.factory('Series', ['$resource', 'Albums', function ($resource, Albums) {

    var fillAlbums = function(seriesItem) {
        if (Array.isArray(seriesItem.albums)) {
            var fullAlbums = [];
            seriesItem.albums.forEach(function (item) {
                fullAlbums.push(Albums.get({id: item}));
            });
            seriesItem.albums = fullAlbums;
        }
    }

    var res = $resource('series/:id', {id: '@id'}, {
        query: {method: 'GET', isArray: true,
            transformResponse: function (series) {
                if (Array.isArray(series)) {
                    for (var index = 0; index < series.length; ++index) {
                        fillAlbums(series[index]);
                    }
                }
                return series;
            }.bind(this)
        },
        get: {method: 'GET',
            transformResponse: function (seriesItem) {
                fillAlbums(seriesItem);
                return seriesItem;
            }.bind(this)
        }});

    return res;
}]);