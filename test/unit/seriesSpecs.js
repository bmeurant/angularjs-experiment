describe('App Series', function () {
    beforeEach(module('ui.router', 'series'));

    var $httpBackend, $rootScope, createController;

    var series = [
        {
            id: 1,
            title: 'BlackSad',
            scriptwriter: 'Juan Diaz Canales',
            illustrator: 'Juanjo Guarnido',
            publisher: 'Dargaud',
            coverUrl: 'static/images/series/covers/blacksad.jpg',
            summary: 'Private investigator John Blacksad is up to his feline ears in mystery, digging into the backstories behind murders, child abductions, and nuclear secrets. Guarnido\'s sumptuously painted pages and rich cinematic style bring the world of 1950s America to vibrant life, with Canales weaving in fascinating tales of conspiracy, racial tension, and the "red scare" Communist witch hunts of the time. Guarnido reinvents anthropomorphism in these pages, and industry colleagues no less than Will Eisner, Jim Steranko, and Tim Sale are fans! Whether John Blacksad is falling for dangerous women or getting beaten to within an inch of his life, his stories are, simply put, unforgettable',
            albums: [1, 2]
        },
        {
            id: 2,
            title: 'The Killer',
            scriptwriter: 'Luc Jacamon',
            illustrator: 'Matz',
            publisher: 'Casterman',
            coverUrl: 'static/images/series/covers/the-killer.jpg',
            summary: 'A man solitary and cold, methodical and unencumbered by scruples or regrets, the killer waits in the shadows, watching for his next target. And yet the longer he waits, the more he thinks he\'s losing his mind, if not his cool. A brutal, bloody and stylish noir story of a professional assassin lost in a world without a moral compass, this is a case study of a man alone, armed to the teeth and slowly losing his mind.'
        }
    ];

    var albums = [
        {
            id: 1,
            title: 'Somewhere Within the Shadows',
            publicationDate: 'Nov 2000',
            number: 1,
            coverUrl: 'static/images/albums/covers/blacksad-1.jpg',
            summary: 'Natalia Wilford is a famous actress. To the world, she had everything anybody could want—beauty, fame, glamour, and lovers who would do anything for her. When she is found murdered in her home, it touches the man who had not seen her since their bitter breakup many years ago. private eye John Blacksad. He vows to find Natalia\'s murderer.',
            series: 1
        },
        {
            id: 2,
            title: 'Arctic-Nation',
            publicationDate: 'Mar 2003',
            number: 2,
            coverUrl: 'static/images/albums/covers/blacksad-2.jpg',
            summary: 'His name is John Blacksad. He\'s a private detective who\'s seen much evil in the past, but never in his long life has he encountered a case as bizarre, as twisted, or as deadly as the one he accepts now. In a town where white supremacists have moved in and are brutally seizing control, Blacksad is asked to find a kidnapped child and bring the kidnappers to justice. As he gets deeper into his investigation, Blacksad discovers a tale of sickening horror involving murder and worse that condemns some of the town\'s most powerful citizens.',
            series: 1
        }
    ];

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        $httpBackend.when('GET', 'series').respond(series);

        var oneAlbumRegex = /albums\/([\d]+)/;
        $httpBackend.when('GET', oneAlbumRegex).respond(function (methos, url) {
            return albums[url.match(oneAlbumRegex)[1] - 1];
        });

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
        // The $controller service is used to create instances of controllers
        var $controller = $injector.get('$controller');

    }));


    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    describe('seriesListCtrl', function () {

        it('should get series and albums', inject(function ($controller) {
            $httpBackend.expectGET('series');
            $httpBackend.expectGET('albums/1');
            $httpBackend.expectGET('albums/2');
            $controller('seriesListCtrl', { $scope: {} });
            $httpBackend.flush();
        }));

        it('should retrieve "series" model fully populated', inject(function ($controller) {
            var scope = {};
            $controller('seriesListCtrl', { $scope: scope });

            scope.series.$promise.then(function () {
                expect(scope.series.length).toBe(2);
            });

            $httpBackend.flush();
        }));

    });

    describe('seriesCtrls-unit', function () {

        var MockSeriesModel = {

            all: function () {
                return series;
            },

            get: function (id) {
                return {
                    then: function (callback) {
                        setTimeout(function() {
                            callback(series[id - 1]);
                        }, 200);
                    }
                }
            }

        };

        describe('seriesListCtrl-unit', function () {

            it('should retrieve "series" model fully populated', inject(function ($controller) {
                var scope = {};
                $controller('seriesListCtrl', { $scope: scope, SeriesModel: MockSeriesModel });

                expect(scope.series.length).toBe(2);
            }));
        });

        describe('seriesItemCtrl-unit', function () {

            it('should retrieve seriesItem model fully populated', inject(function ($controller) {
                var scope = {};
                $controller('seriesItemCtrl', { $scope: scope, SeriesModel: MockSeriesModel, $stateParams: {id: 1} });

                waitsFor(function() {
                    return scope.seriesItem;
                });

                runs(function() {
                    expect(scope.seriesItem).toBeDefined();
                    expect(scope.seriesItem.id).toBe(1);
                });
            }));
        });

    });
});