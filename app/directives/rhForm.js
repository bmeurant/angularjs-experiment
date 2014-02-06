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
                    var constraints = $scope.model.validations[property];
                    for (var constraint in constraints) {
                        var valid = validator.validateOne(constraint, constraints[constraint], value);
                        this.formController[property].$setValidity(constraint, valid);
                        if (!valid) break;
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
                var fn = $parse(attributes.rgSubmit);

                formElement.find('input').each(function (index, element) {
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