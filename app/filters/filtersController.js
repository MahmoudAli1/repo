

angular.module('app')

    .filter("roundedToTheHundredths", function () {
        return function (selected) {
            return Math.round(parseFloat(selected) * 100) / 100;
        }
    })

    .filter("rounded", function () {
        return function (selected) {
            return Math.round(selected);
        }
    })

    .filter('floored', function () {

         return function (selected) {
            return Math.floor(selected);
         }
    })

    .filter("formatTime", function () {
        return function (selected) {
            var sec = moment.duration(selected, 'seconds');
            var h = sec.get('hours'),
                m = sec.get('minutes'),
                s = sec.get('seconds');

            var addNull = function (data) {
                if (data < 10) {
                    return "0" + data
                }
                return data;
            };

            h = addNull(h);
            m = addNull(m);
            s = addNull(s);

            return h + ":" + m + ":" + s;
        }
    });