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
