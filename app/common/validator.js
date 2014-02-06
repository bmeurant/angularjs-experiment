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