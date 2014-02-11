var app = angular.module('appRoot', ['ui.router', 'ngResource', 'templates.app', 'series', 'rhForm', 'validator', 'rhMoment', 'pascalprecht.translate', 'labels']);

app.config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /series
    $urlRouterProvider.otherwise("/series");
});

app.controller('appCtrl', function ($scope, $translate) {
    $scope.changeLanguage = function (key) {
        $translate.uses(key);
        moment.lang(key);
    }
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
            if (!this.series) {
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
                        fillAlbums(obj);
                        obj.validations = this.validations;
                        itemData.resolve(obj);
                    }.bind(this));
                }.bind(this));
            } else {
                Series.save({}, seriesItem).$promise.then(function (updated) {
                    this.series.$promise.then(function (series) {
                        var obj = getById(series, seriesItem.id);
                        angular.copy(updated, obj);
                        obj.validations = this.validations;
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

        Model.prototype.flush = function () {
            this.series.$promise.then(function (series) {
                for (var index = 0; index < series.length; ++index) {
                    if (series[index].id == undefined)
                        series.splice(index, 1);
                }
            }.bind(this));
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
            if (!$scope.seriesItem.id)
                SeriesModel.flush();
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
    "    <img ng-src=\"dist/static/images/series/covers/{{seriesItem.coverName}}\" alt=\"Series's first album cover\" class=\"cover img-responsive img-thumbnail\"/>\n" +
    "    <dl class=\"series-desc dl-horizontal\">\n" +
    "        <dt>{{'seriesItem.scriptwriter' | translate}}</dt>\n" +
    "        <dd>{{seriesItem.scriptwriter}}</dd>\n" +
    "        <dt>{{'seriesItem.illustrator' | translate}}</dt>\n" +
    "        <dd>{{seriesItem.illustrator}}</dd>\n" +
    "        <dt>{{'seriesItem.publisher' | translate}}</dt>\n" +
    "        <dd>{{seriesItem.publisher}}</dd>\n" +
    "        <dt>{{'seriesItem.volumes' | translate}}</dt>\n" +
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
    "    <img ng-src=\"dist/static/images/series/covers/{{seriesItem.coverName || 'default.jpg'}}\" alt=\"Series's first album cover\" class=\"cover img-responsive img-thumbnail\"/>\n" +
    "\n" +
    "    <div class=\"series-desc\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"scriptwriter\" class=\"col-sm-3 control-label\">{{'seriesItem.scriptwriter' | translate}}</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"scriptwriter\" name=\"scriptwriter\" type=\"text\" ng-model=\"seriesItem.scriptwriter\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"illustrator\" class=\"col-sm-3 control-label\">{{'seriesItem.illustrator' | translate}}</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"illustrator\" name=\"illustrator\" type=\"text\" ng-model=\"seriesItem.illustrator\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"publisher\" class=\"col-sm-3 control-label\">{{'seriesItem.publisher' | translate}}</label>\n" +
    "            <div class=\"col-sm-9\">\n" +
    "                <input id=\"publisher\" name=\"publisher\" type=\"text\" ng-model=\"seriesItem.publisher\" class=\"form-control\"/>\n" +
    "                <span class=\"help-block\"></span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"albums\" class=\"col-sm-3 control-label\">{{'seriesItem.volumes' | translate}}</label>\n" +
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
    "            <img ng-src=\"dist/static/images/albums/covers/{{album.coverName}}\" alt=\"Album cover\" class=\"col-xs-2 cover img-responsive img-thumbnail\"/>\n" +
    "\n" +
    "            <div class=\"col-xs-10\">\n" +
    "                <h4>{{album.title}}</h4>\n" +
    "                <dl class=\"album-desc dl-horizontal\">\n" +
    "                    <dt>{{'album.volume' | translate}}</dt>\n" +
    "                    <dd>{{album.number}}</dd>\n" +
    "                    <dt>{{'album.date' | translate}}</dt>\n" +
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
    "    <h2> {{'series.title' | translate}} </h2>\n" +
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
    "    <span>{{'series.number' | translate}} {{(series|filter:{title:query}).length}}</span>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
