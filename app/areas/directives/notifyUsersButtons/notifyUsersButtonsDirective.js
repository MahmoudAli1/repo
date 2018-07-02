"use strict";

angular.module('app.areas').directive('notifyUsersButtons', function ($templateRequest, $compile) {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {

            if(scope.area.sendToAll) {
                $templateRequest('app/areas/directives/notifyUsersButtons/notifyEligableButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            } else {
                $templateRequest('app/areas/directives/notifyUsersButtons/notifyAllButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            }

        }
    };
});
