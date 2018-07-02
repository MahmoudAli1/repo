"use strict";

angular.module('app.areas').directive('activationButton', function ($templateRequest, $compile) {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            
            if(scope.area.isActive) {
                $templateRequest('app/areas/directives/activationButtons/deactivateButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            } else {
                $templateRequest('app/areas/directives/activationButtons/activateButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            }

        }
    };
});
