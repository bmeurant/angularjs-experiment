angular.module('rhForm', [])
    .directive('rhSubmit', function ($parse) {
        return {
            restrict: 'A',
            require: ['rhSubmit', '?form'],
            controller: ['$scope', function ($scope) {
                this.attempted = false;

                var formController = null;

                this.setAttempted = function() {
                    this.attempted = true;
                };

                this.setFormController = function(controller) {
                    formController = controller;
                };

                this.isInvalid = function (fieldModelController) {
                    if (!formController) return false;

                    if (fieldModelController) {
                        return fieldModelController.$invalid && this.attempted;
                    } else {
                        return formController && formController.$invalid && this.attempted;
                    }
                };
            }],
            compile: function (cElement, cAttributes, transclude) {
                return {
                    pre: function(scope, formElement, attributes, controllers) {

                        var submitController = controllers[0];
                        var formController = (controllers.length > 1) ? controllers[1] : null;

                        submitController.setFormController(formController);

                        scope.rh = scope.rh || {};
                        scope.rh[attributes.name] = submitController;
                    },
                    post: function(scope, formElement, attributes, controllers) {

                        var submitController = controllers[0];
                        var formController = (controllers.length > 1) ? controllers[1] : null;
                        var fn = $parse(attributes.rhSubmit);

                        formElement.bind('submit', function () {
                            submitController.setAttempted();
                            if (!scope.$$phase) scope.$apply();

                            if (!formController.$valid) return false;

                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        });
                    }
                };
            }
        };
    });