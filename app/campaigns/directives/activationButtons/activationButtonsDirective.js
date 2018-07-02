"use strict";

angular.module('app.campaigns').directive('campaignActivationButton', function ($templateRequest, $compile) {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            var campaign = scope.campaign;
            if(campaign.IsActive && moment().isBefore(moment(campaign.EndDate).endOf('day'))) {
                $templateRequest('app/campaigns/directives/activationButtons/deactivateButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            } else if(!campaign.IsActive && moment().isBefore(moment(campaign.EndDate).endOf('day'))) {
                $templateRequest('app/campaigns/directives/activationButtons/activateButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            }

        }
    };
});
