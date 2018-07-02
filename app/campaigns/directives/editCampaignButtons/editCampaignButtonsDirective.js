"use strict";

angular.module('app.campaigns').directive('editCampaignButton', function ($templateRequest, $compile) {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            var campaign = scope.campaignToEdit;
            if(campaign.IsActive && moment().isBetween(moment(campaign.StartDate).startOf('day'), moment(campaign.EndDate).endOf('day'))) {
                $templateRequest('app/campaigns/directives/editCampaignButtons/editStartedCampaignButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            } else {
                $templateRequest('app/campaigns/directives/editCampaignButtons/editNotStartedCampaignButton.html').then(function(html){
                    var template = angular.element(html);
                    element.replaceWith($compile(template)(scope));
                });
            }
        }
    };
});
