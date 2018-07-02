/*
 * This directive allow you to create a callback when an element finish rendering such as ngRepeat.
 * 
 * Example
 *
 * HTML:
 * <li ng-repeat="object in objectsList"on-finish-callback="ngRepeatFinished">
 *
 * JS:
 * $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
 *	//you also get the actual event object
 *	//do stuff, execute functions -- whatever...
 * });
 */

angular.module('app').directive('onFinishCallback', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishCallback);
                });
            }
        }
    }
});