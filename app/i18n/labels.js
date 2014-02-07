angular.module('labels', [])
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', {
            'app.title': 'Comic Books Library',
            'sources.view': 'View sources on github',
            'series.title': 'Comics series',
            'series.number': 'Number of series:',
            'album.volume': 'volume',
            'album.date': 'date',
            'seriesItem.scriptwriter': 'Scriptwriter',
            'seriesItem.illustrator': 'Illustrator',
            'seriesItem.publisher': 'Publisher',
            'seriesItem.volumes': 'Volumes'
        });

        $translateProvider.translations('fr', {
            'app.title': 'Bibliothèque de bandes dessinées',
            'sources.view': 'Voir les sources sur github',
            'series.title': 'Séries',
            'series.number': 'Nombre de séries:',
            'album.volume': 'tome',
            'album.date': 'date',
            'seriesItem.scriptwriter': 'Scénariste',
            'seriesItem.illustrator': 'Dessinateur',
            'seriesItem.publisher': 'Editeur',
            'seriesItem.volumes': 'Tomes'
        });

        $translateProvider.preferredLanguage('en');
        moment.lang('en');
    }]);