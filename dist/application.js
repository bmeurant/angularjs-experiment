angular.module('app', ['ui.router', 'ngResource', 'templates.app', 'series', 'rhForm', 'validator', 'rhMoment']);

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /series
    $urlRouterProvider.otherwise("/series");
});

var validator = angular.module('validator', []);

validator.service('validator', function(){
    this.messages = {};

    this.messages['required'] = "cannot be blank!";
    this.messages['min-length'] = "is too short (minimum is {%1} characters)";
    this.contextualizedMsg = function(constraint, expected) {
        if (Array.isArray(expected)) {
            var msg = this.messages[constraint];
            for (var i = 0; i < expected.length; ++i) {
                msg = msg.replace('{%' + i + '}', expected[i]);
            }
            return msg;
        }
        else {
            return this.messages[constraint].replace(/\{\%.\}/g, expected);
        }
    };

    this.constraints = {};

    this.constraints['required'] = function(expected, value) {
        if (expected && value) return true;
        return false;
    };

    this.constraints['min-length'] = function(expected, value) {
        if (expected && expected > 0 && (!value || value.length < expected))
            return false;
        return true;
    };

    this.validateAll = function(constraints, value) {
        for (var constraint in constraints) {
            if (!this.constraints[constraint](constraints[constraint], value)) return false;
        }
        return true;
    };

    this.validateOne = function(constraint, expected, value) {
        return this.constraints[constraint](expected, value);
    };
});
var appDev = angular.module('appDev', ['app', 'ngMockE2E']);
appDev.run(function($httpBackend) {
    var series = [{
        id: 1,
        title: 'BlackSad',
        scriptwriter: 'Juan Diaz Canales',
        illustrator: 'Juanjo Guarnido',
        publisher: 'Dargaud',
        coverUrl: 'static/images/series/covers/blacksad.jpg',
        summary: 'Private investigator John Blacksad is up to his feline ears in mystery, digging into the backstories behind murders, child abductions, and nuclear secrets. Guarnido\'s sumptuously painted pages and rich cinematic style bring the world of 1950s America to vibrant life, with Canales weaving in fascinating tales of conspiracy, racial tension, and the "red scare" Communist witch hunts of the time. Guarnido reinvents anthropomorphism in these pages, and industry colleagues no less than Will Eisner, Jim Steranko, and Tim Sale are fans! Whether John Blacksad is falling for dangerous women or getting beaten to within an inch of his life, his stories are, simply put, unforgettable',
        albums: [1, 2, 3, 4, 5]
    }, {
        id: 2,
        title: 'The Killer',
        scriptwriter: 'Luc Jacamon',
        illustrator: 'Matz',
        publisher: 'Casterman',
        coverUrl: 'static/images/series/covers/the-killer.jpg',
        summary: 'A man solitary and cold, methodical and unencumbered by scruples or regrets, the killer waits in the shadows, watching for his next target. And yet the longer he waits, the more he thinks he\'s losing his mind, if not his cool. A brutal, bloody and stylish noir story of a professional assassin lost in a world without a moral compass, this is a case study of a man alone, armed to the teeth and slowly losing his mind.'
    }, {
        id: 3,
        title: 'The Nikopol Trilogy',
        scriptwriter: 'Enki Bilal',
        illustrator: 'Enki Bilal',
        publisher: 'Les Humanoïdes Associés',
        coverUrl: 'static/images/series/covers/nikopol.png',
        summary: 'The incredible journey of Alcide Nikopol in the company of Horus of Hierakonopolis, the vengeful god and Jill Bioskop, the mysterious women with blue hair, from Paris to Berlin, Cairo to equator City. A unique mix of science fiction, anxiety, humor and strangeness.'
    }, {
        id: 4,
        title: 'Akira',
        scriptwriter: 'Katsuhiro Ôtomo',
        illustrator: 'Katsuhiro Ôtomo',
        publisher: 'Epic Comics',
        coverUrl: 'static/images/series/covers/akira.jpg',
        summary: 'In the year 2038. A police state, scheming politicians, religions sects, revolutionaries and a secret scientific project all combine to produce an explosive mixture in Neo-Tokyo. The rival groups all have their eyes on one prize: control of Akira, a boy of such destructive psychic ability that he has been held in cryo-stasis for over 30 years. A coup is planned, but there is a wild card in play: the psychic Tetsuo, an impetuous young biker who releases Akira and so forces all of the groups to make their move.'
    }, {
        id: 5,
        title: 'Calvin and Hobbes',
        scriptwriter: 'Bill Watterson',
        illustrator: 'Bill Watterson',
        publisher: 'Andrews McMeel Publishing',
        coverUrl: 'static/images/series/covers/calvin-hobbes.png',
        summary: 'Calvin and Hobbes is unquestionably one of the most popular comic strips of all time. The imaginative world of a boy and his real-only-to-him tiger was first syndicated in 1985 and appeared in more than 2,400 newspapers when Bill Watterson retired on January 1, 1996. The entire body of Calvin and Hobbes cartoons published in a truly noteworthy tribute to this singular cartoon in The Complete Calvin and Hobbes. Composed of three hardcover, four-color volumes in a sturdy slipcase, this New York Times best-selling edition includes all Calvin and Hobbes cartoons that ever appeared in syndication. This is the treasure that all Calvin and Hobbes fans seek.'
    }, {
        id: 6,
        title: 'From Hell',
        scriptwriter: 'Alan Moore',
        illustrator: 'Eddie Campbell',
        publisher: 'Eddie Campbell Comics',
        coverUrl: 'static/images/series/covers/from-hell.jpg',
        summary: 'FROM HELL is the story of Jack the Ripper, perhaps the most infamous man in the annals of murder. Detailing the events leading up to the Whitechapel killings and the cover-up that followed, FROM HELL is a meditation on the mind of a madman whose savagery and violence gave birth to the 20th century. The serialized story, presented in its entirety in this volume, has garnered widespread attention from critics and scholars. Often regarded as one of the most significant graphic novels ever published, FROM HELL combines meticulous research with educated speculation, resulting in a masterpiece of historical fiction both compelling and terrifying. This new edition, which has been completely re-mastered, is certainly the finest edition of the book produced to date.'
    }, {
        id: 7,
        title: 'Sin City',
        scriptwriter: 'Frank Miller',
        illustrator: 'Frank Miller',
        publisher: 'Dark Horse',
        coverUrl: 'static/images/series/covers/sin-city.jpg',
        summary: 'Sin City is the place - tough as leather and dry as tinder. Love is the fuel, and the now-infamous character Marv has the match ... not to mention a "condition." He\'s gunning after Goldie\'s killer, so it\'s time to watch this town burn!'
    }];

    albums = [{
        id: 1,
        title: 'Somewhere Within the Shadows',
        publicationDate: 'Nov 2000',
        number: 1,
        coverUrl: 'static/images/albums/covers/blacksad-1.jpg',
        summary: 'Natalia Wilford is a famous actress. To the world, she had everything anybody could want—beauty, fame, glamour, and lovers who would do anything for her. When she is found murdered in her home, it touches the man who had not seen her since their bitter breakup many years ago. private eye John Blacksad. He vows to find Natalia\'s murderer.',
        series: 1
    }, {
        id: 2,
        title: 'Arctic-Nation',
        publicationDate: 'Mar 2003',
        number: 2,
        coverUrl: 'static/images/albums/covers/blacksad-2.jpg',
        summary: 'His name is John Blacksad. He\'s a private detective who\'s seen much evil in the past, but never in his long life has he encountered a case as bizarre, as twisted, or as deadly as the one he accepts now. In a town where white supremacists have moved in and are brutally seizing control, Blacksad is asked to find a kidnapped child and bring the kidnappers to justice. As he gets deeper into his investigation, Blacksad discovers a tale of sickening horror involving murder and worse that condemns some of the town\'s most powerful citizens.',
        series: 1
    }, {
        id: 3,
        title: 'Red Soul',
        publicationDate: 'Nov 2005',
        number: 3,
        coverUrl: 'static/images/albums/covers/blacksad-3.jpg',
        summary: 'During the Red Scare, Blacksad is employed as a bodyguard for a rich old tortoise called Hewitt Mandeline, who goes on a gambling trip to Las Vegas. After returning home, Blacksad\'s last assignment is to accompany him to an art gallery, where he runs into Smirnov and his family. He finds a leaflet for a lecture given by his old school teacher, Otto Liebber, a nuclear physicist and Nobel Prize candidate. Also appearing is the wealthy, dynamic, yet idle communist Samuel Gotfield, who heads a scientific research foundation; Blacksad takes an instant dislike for Gotfield, who makes a mockery of Otto\'s lecture. He also meets Gotfield\'s fiancee, writer Alma Mayer.',
        series: 1
    }, {
        id: 4,
        title: 'A Silent Hell',
        publicationDate: 'Sep 2010',
        number: 4,
        coverUrl: 'static/images/albums/covers/blacksad-4.jpg',
        summary: 'Blacksad and Weekly travel to New Orleans to meet Faust LaChapelle, a failed musician who found success signing more talented yet less fortunate musicians to record labels. They learn that LaChapelle has terminal cancer, and is being treated by Ms. Gibraltar, a vodou priestess. LaChapelle begs Blacksad to find Sebastian "Little Hand" Fletcher, who – despite having one arm smaller than the other – was the most successful musician he ever signed. Fletcher has gone missing, and LaChapelle is concerned that his addiction to heroin has something to do with it. Blacksad and Weekly accept the case.',
        series: 1
    }, {
        id: 5,
        title: 'Amarillo',
        publicationDate: 'Nov 2013',
        number: 5,
        coverUrl: 'static/images/albums/covers/blacksad-5.jpg',
        summary: 'Chad, a writer, travels the road as a vagrant with his on-again off-again friend Abraham, a poet. Abe views his vocation more romantically than Chad, who sees writing as his career and a means to money, and Abe accuses Chad of not having a true passion like he does. Abe takes his collection of poems he was about to publish and burns them, and encourages the appalled Chad to do the same with his next novel\'s manuscript to give it a "proper ending." Blacksad is happy to be taking a well-earned vacation, staying behind in New Orleans for a while, while Weekly returns home to New York. He lands a side-job when a rich Texan asks him to drive his prized car to Tulsa, Oklahoma where he is flying. Blacksad accepts, enjoying the free roadtrip. At a pit-stop, two hitch-hikers (who we see are Chad and Abe) steal the prized car and Blacksad, with the help of a street gang, motorcycle after them, hoping to catch them on their way to Amarillo.',
        series: 1
    }];

    // returns the current list of series
    $httpBackend.whenGET('series').respond(function (method, url, data) {
        return [200, series, {}];
    });

    var oneSeriesRegex = /series\/([\d]+)/;
    $httpBackend.whenGET(oneSeriesRegex).respond(function (method, url, data) {
        return [200, series[url.match(oneSeriesRegex)[1] - 1], {}];
    });

    $httpBackend.whenPUT(oneSeriesRegex).respond(function (method, url, data) {
        angular.copy($.parseJSON(data), series[url.match(oneSeriesRegex)[1] - 1]);
        return [200, series[url.match(oneSeriesRegex)[1] - 1], {}];
    });

    $httpBackend.whenPOST('series').respond(function (method, url, data) {
        var newSeries = {};
        angular.copy($.parseJSON(data), newSeries);
        newSeries.id = series.length + 1;
        series.push(newSeries);
        return [200, newSeries, {}];
    });

    // returns the current list of albums
    $httpBackend.whenGET('albums').respond(albums);

    var oneAlbumRegex = /albums\/([\d]+)/;
    $httpBackend.whenGET(oneAlbumRegex).respond(function (method, url, data) {
        return [200, albums[url.match(oneAlbumRegex)[1] - 1], {}];
    });

    $httpBackend.whenGET(/.*/).passThrough();
});

angular.module('rhForm', [])
    .directive('rhForm', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            require: ['rhForm', 'form'],
            scope: { model: '=rhModel', rhSubmit: '&' },
            replace: true,
            controller: ['$scope', 'validator', function ($scope, validator) {
                $scope.attempted = false;

                this.propagate = function (fn, event) {
                    $scope.$apply(function () {
                        fn($scope, {$event: event});
                    });
                }

                this.validate = function (property, value) {
                    if ($scope.model) {
                        var constraints = $scope.model.validations[property];
                        for (var constraint in constraints) {
                            var valid = validator.validateOne(constraint, constraints[constraint], value);
                            this.formController[property].$setValidity(constraint, valid);
                            if (!valid) break;
                        }
                    }
                }

                this.getMessage = function (property) {
                    for (var error in this.formController[property].$error) {
                        if (this.formController[property].$error[error] == true)
                            return validator.contextualizedMsg(error, $scope.model.validations[property][error]);
                    }
                    return '';
                }

                this.setFormController = function (formController) {
                    this.formController = formController;
                }
            }],
            link: function (scope, formElement, attributes, controllers) {
                var rhFormController = controllers[0];
                var formController = controllers[1];
                rhFormController.setFormController(formController);

                formElement.find('input').each(function (index, element) {
                    scope.$watch('seriesItem', function () {
                        rhFormController.validate(element.name, element.value);
                    })
                    $(element).bind('keyup', function (event) {
                        rhFormController.validate(event.target.name, event.target.value);
                    });
                });

                formElement.bind('submit', function (event) {
                    scope.attempted = true;

                    if (!formController.$valid) {
                        formElement.find('input').each(function (index, elem) {
                            var formField = formController[elem.name];
                            var $formGroup = $(elem).closest('.form-group');
                            if (formField && formField.$invalid) {
                                $formGroup.addClass('has-error');
                                $formGroup.find('.help-block').text(rhFormController.getMessage(elem.name));
                            }
                            if (formField && formField.$valid) {
                                $formGroup.removeClass('has-error');
                                $formGroup.find('.help-block').text("");
                            }
                        });

                        return false;
                    }

                    scope.rhSubmit();
                });
            }
        };
    }]);
angular.module('rhMoment', [])
    .filter('rhMoment', function () {
        return function (date, format) {

            if (moment == undefined || date == undefined)
                return "";

            if (format == 'undefined')
                format = 'MMMM DD YYYY'

            return moment(date).format(format);
        };
    });

var seriesResource = angular.module('resources.albums', ['ngResource']);

seriesResource.factory('Albums', ['$resource', function ($resource) {
    return $resource('albums/:id', {id: '@id'});
}]);
var seriesResource = angular.module('resources.series', ['ngResource']);

seriesResource.factory('Series', ['$resource', function ($resource) {

    var res = $resource('series/:id', {id: '@id'}, {
            query: {method: 'GET', isArray: true},
            get: {method: 'GET'},
            save: {method:'POST'},
            update: {method:'PUT'}
        }
    );

    return res;
}]);
angular.module('series', ['resources.series', 'resources.albums'])

    .config(function ($stateProvider) {
        $stateProvider
            .state('series', {
                url: "/series",
                templateUrl: 'series/series-list.html',
                controller: 'seriesListCtrl'
            })
            .state('series.item', {
                abstract: true,
                url: '/{id:[0-9]{1,4}}',
                templateUrl: "series/series-item.html",
                controller: 'seriesItemCtrl'
            })
            .state('series.item.detail', {
                url: "",
                templateUrl: "series/series-detail.html"
            })
            .state('series.item.edit', {
                url: "/edit",
                controller: 'seriesItemEditCtrl',
                templateUrl: "series/series-edit.html"
            })
            .state('series.create', {
                url: "/create",
                controller: 'seriesItemEditCtrl',
                templateUrl: "series/series-edit.html"
            })
    })

    /*.factory('SeriesModel', ['$q', 'Series', 'Albums', function ($q, Series, Albums) {
     var Model = function (Series) {
     this.resource = Series;
     this.deferred = $q.defer();
     this.validations = {
     title: {
     "required": true,
     "min-length": 5
     },
     scriptwriter: {
     "required": true,
     "min-length": 5
     },
     illustrator: {
     "required": true,
     "min-length": 5
     },
     publisher: {
     "required": true,
     "min-length": 5
     }
     };
     this.fetch();
     };

     var fillAlbums = function (seriesItem) {
     if (Array.isArray(seriesItem.albums)) {
     var fullAlbums = [];
     seriesItem.albums.forEach(function (item) {
     fullAlbums.push(Albums.get({id: item}));
     });
     seriesItem.albums = fullAlbums;
     }
     }

     Model.prototype.fetch = function () {
     Series.query().$promise.then(function (result) {
     this.deferred.resolve(result);
     }.bind(this));
     };

     Model.prototype.all = function () {
     this.deferred.promise.then(function (data) {
     for (var index = 0; index < data.length; ++index) {
     data[index].validations = this.validations;
     fillAlbums(data[index]);
     }
     }.bind(this));
     return this.deferred.promise;
     };

     Model.prototype.get = function (id) {
     var itemData = $q.defer();
     this.deferred.promise.then(function (data) {
     itemData.resolve(data.filter(function (item) {
     return item.id == id;
     })[0]);
     }.bind(this));
     return itemData.promise;
     };

     Model.prototype.save = function (seriesItem) {
     var itemData = $q.defer();
     Series.update({id: seriesItem.id}, seriesItem).$promise.then(function (updated) {
     this.deferred.promise.then(function (data) {
     var obj = data.filter(function (item) {
     return item.id == updated.id;
     })[0]
     angular.copy(updated, obj);
     obj.validations = this.validations;
     fillAlbums(obj);
     itemData.resolve(updated);
     }.bind(this));
     }.bind(this));
     return itemData.promise;
     };

     Model.prototype.new = function () {
     var newSeries = {
     validations: this.validations,
     coverUrl: '/static/images/series/covers/default.jpg'
     };
     this.deferred.promise.then(function (data) {
     data.push(newSeries);
     }.bind(this));
     return newSeries;
     };

     return new Model(Series);
     }])*/

    .factory('SeriesModel', ['$q', 'Series', 'Albums', function ($q, Series, Albums) {
        var Model = function (Series) {
            this.resource = Series;
            this.validations = {
                title: {
                    "required": true,
                    "min-length": 5
                },
                scriptwriter: {
                    "required": true,
                    "min-length": 5
                },
                illustrator: {
                    "required": true,
                    "min-length": 5
                },
                publisher: {
                    "required": true,
                    "min-length": 5
                }
            };
            this.fetch();
        };

        var fillAlbums = function (seriesItem) {
            if (Array.isArray(seriesItem.albums)) {
                var fullAlbums = [];
                seriesItem.albums.forEach(function (item) {
                    fullAlbums.push(Albums.get({id: item}));
                });
                seriesItem.albums = fullAlbums;
            }
        }

        var getById = function (series, id) {
            return series.filter(function (item) {
                return item.id == id;
            })[0];
        }

        Model.prototype.fetch = function () {
            this.series = this.resource.query(function (series) {
                for (var index = 0; index < series.length; ++index) {
                    series[index].validations = this.validations;
                    fillAlbums(series[index]);
                }
            }.bind(this));
        };

        Model.prototype.all = function () {
            if (this.series) {
                console.log('return cached data');
            }
            else {
                console.log('get data');
                this.fetch();
            }
            return this.series;
        };

        Model.prototype.get = function (id) {
            if (!this.series) {
                this.fetch();
            }
            var itemData = $q.defer();
            this.series.$promise.then(function (series) {
                itemData.resolve(getById(series, id));
            });
            return itemData.promise;
        };

        Model.prototype.save = function (seriesItem) {
            var itemData = $q.defer();
            if (seriesItem.id) {
                Series.update({id: seriesItem.id}, seriesItem).$promise.then(function (updated) {
                    this.series.$promise.then(function (series) {
                        var obj = getById(series, seriesItem.id);
                        angular.copy(updated, obj);
                        itemData.resolve(obj);
                    }.bind(this));
                }.bind(this));
            } else {
                Series.save({}, seriesItem).$promise.then(function (updated) {
                    this.series.$promise.then(function (series) {
                        var obj = getById(series, seriesItem.id);
                        angular.copy(updated, obj);
                        itemData.resolve(obj);
                    }.bind(this));
                }.bind(this));
            }

            return itemData.promise;
        };

        Model.prototype.new = function () {
            var newSeries = {
                validations: this.validations,
                coverUrl: '/static/images/series/covers/default.jpg'
            };
            this.series.$promise.then(function (data) {
                data.push(newSeries);
            }.bind(this));
            return newSeries;
        };

        return new Model(Series);
    }])

    .controller('seriesListCtrl', function ($scope, SeriesModel) {
        $scope.series = SeriesModel.all();
    })

    .controller('seriesItemCtrl', ['$scope', '$state', '$stateParams', 'SeriesModel', function ($scope, $state, $stateParams, SeriesModel) {
        SeriesModel.get($stateParams.id).then(function (item) {
            $scope.seriesItem = item;
        });

        $scope.edit = function () {
            $state.go('series.item.edit');
        }
    }])

    .controller('seriesItemEditCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'SeriesModel', function ($rootScope, $scope, $state, $stateParams, SeriesModel) {

        if ($stateParams.id != undefined) {
            SeriesModel.get($stateParams.id).then(function (item) {
                $scope.seriesItem = item;
                $scope.original = angular.copy(item);
            });
        } else {
            $scope.seriesItem = SeriesModel.new();
            $scope.original = angular.copy($scope.seriesItem);
        }

        $scope.cancel = function () {
            if ($scope.seriesItemForm.$dirty)
                angular.copy($scope.original, $scope.seriesItem);
            $state.go('series.item.detail');
        };

        $scope.save = function () {
            if ($scope.seriesItemForm.$dirty)
                angular.copy($scope.seriesItem, $scope.original);
            $scope.seriesItemForm.$setPristine(true);
            SeriesModel.save($scope.seriesItem).then(function (item) {
                $state.go('series.item.detail', {id: item.id});
            });
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if ((fromState.name == 'series.item.edit') && ($scope.seriesItemForm.$dirty)) {
                angular.copy($scope.original, $scope.seriesItem);
            }
        });
    }]);
angular.module('templates.app', ['series/series-detail.html', 'series/series-edit.html', 'series/series-item.html', 'series/series-list.html']);

angular.module("series/series-detail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-detail.html",
    "<div class=\"col-xs-12 col-md-5 series-details\">\n" +
    "    <button class=\"btn btn-default btn-icon edit\" ng-click=\"edit()\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "    <h3>{{seriesItem.title}}</h3>\n" +
    "    <img ng-src=\"{{seriesItem.coverUrl}}\" alt=\"Series's first album cover\" class=\"cover img-responsive img-thumbnail\"/>\n" +
    "    <dl class=\"series-desc dl-horizontal\">\n" +
    "        <dt>Scriptwriter</dt>\n" +
    "        <dd>{{seriesItem.scriptwriter}} </dd>\n" +
    "        <dt>Illustrator</dt>\n" +
    "        <dd>{{seriesItem.illustrator}}</dd>\n" +
    "        <dt>Publisher</dt>\n" +
    "        <dd>{{seriesItem.publisher}}</dd>\n" +
    "        <dt>Volumes</dt>\n" +
    "        <dd>{{seriesItem.albums.length || 0}}</dd>\n" +
    "    </dl>\n" +
    "    <p class=\"series-desc\">\n" +
    "        {{seriesItem.summary}}\n" +
    "    </p>\n" +
    "</div>");
}]);

angular.module("series/series-edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-edit.html",
    "<div class=\"col-xs-12 col-md-5 series-details\">\n" +
    "    <form rh-form name=\"seriesItemForm\" class=\"form-horizontal\" rh-model=\"seriesItem\" rh-submit=\"save()\" novalidate>\n" +
    "    <button type=\"submit\" class=\"btn btn-success btn-icon submit\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "    </button>\n" +
    "    <button type=\"cancel\" class=\"btn btn-danger btn-icon cancel\" ng-click=\"cancel()\">\n" +
    "    <i class=\"fa fa-times\"></i>\n" +
    "    </button>\n" +
    "    <div class=\"form-group title\">\n" +
    "        <input id=\"title\" name=\"title\" type=\"text\" ng-model=\"seriesItem.title\" class=\"form-control\"/>\n" +
    "        <span class=\"help-block\"></span>\n" +
    "    </div>\n" +
    "    <img ng-src=\"{{seriesItem.coverUrl}}\" alt=\"Series's first album cover\" class=\"cover img-responsive img-thumbnail\"/>\n" +
    "\n" +
    "    <div class=\"series-desc\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"scriptwriter\" class=\"col-sm-3 control-label\">Scriptwriter</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"scriptwriter\" name=\"scriptwriter\" type=\"text\" ng-model=\"seriesItem.scriptwriter\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"illustrator\" class=\"col-sm-3 control-label\">Illustrator</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"illustrator\" name=\"illustrator\" type=\"text\" ng-model=\"seriesItem.illustrator\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"publisher\" class=\"col-sm-3 control-label\">Publisher</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"publisher\" name=\"publisher\" type=\"text\" ng-model=\"seriesItem.publisher\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"albums\" class=\"col-sm-3 control-label\">Volumes</label>\n" +
    "                <span class=\"col-sm-9\">\n" +
    "                    <input id=\"albums\" type=\"text\" ng-model=\"seriesItem.albums.length\" class=\"form-control\" disabled=\"disabled\"/>\n" +
    "                </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"series-desc\">\n" +
    "        <textarea class=\"form-control\" rows=\"10\" ng-model=\"seriesItem.summary\"></textarea>\n" +
    "    </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("series/series-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-item.html",
    "<div ui-view>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-xs-12 col-md-4 series-albums\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"album in seriesItem.albums\" class=\"row\">\n" +
    "            <img ng-src=\"{{album.coverUrl}}\" alt=\"Album cover\" class=\"col-xs-2 cover img-responsive img-thumbnail\"/>\n" +
    "\n" +
    "            <div class=\"col-xs-10\">\n" +
    "                <h4>{{album.title}}</h4>\n" +
    "                <dl class=\"album-desc dl-horizontal\">\n" +
    "                    <dt>volume</dt>\n" +
    "                    <dd>{{album.number}}</dd>\n" +
    "                    <dt>date</dt>\n" +
    "                    <dd>{{album.publicationDate | rhMoment: 'MMMM YYYY'}}</dd>\n" +
    "                </dl>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("series/series-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("series/series-list.html",
    "<div class=\"col-xs-12 col-md-3\">\n" +
    "    <h2>Comics series</h2>\n" +
    "\n" +
    "    <input type=\"text\" ng-model=\"query\" class=\"filter form-control\"/>\n" +
    "    <button class=\"sort btn btn-icon btn-default\" ng-click=\"reverse=!reverse\">\n" +
    "        <i class=\"fa\" ng-class=\"reverse ? 'fa-caret-up' : 'fa-caret-down'\"></i>\n" +
    "    </button>\n" +
    "\n" +
    "    <ul class=\"series-listing\">\n" +
    "        <li ng-repeat=\"seriesItem in series | filter:{title:query} | orderBy:'title':reverse\" class=\"series-item\" ng-model=\"seriesItem\">\n" +
    "            <a ui-sref-active=\"active\" ui-sref=\"series.item.detail(seriesItem)\" title=\"{{seriesItem.title}}\">\n" +
    "                {{seriesItem.title}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"series-item\">\n" +
    "            <a href=\"\" title=\"add series\" class=\"add\" ui-sref=\"series.create\">\n" +
    "            <i class=\"fa fa-2x fa-plus-square\"></i>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <span>Number of series: {{(series|filter:{title:query}).length}}</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
