"use strict";

angular.module('app.campaigns', ['ui.router'])
.config(function ($stateProvider) {
    $stateProvider
    .state('app.campaigns', {
        abstract: true,
        url: "/campaigns"
    })
    .state('app.campaigns.createCampaign', {
        url: '/createCampaign',
        data: {
            title: 'Create Campaign'
        },
        views: {
            "content@app": {
                templateUrl: 'app/campaigns/views/createCampaign.html',
                controller: 'CreateCampaignController',
                resolve: {
                    cities: function($cookies, appSettings, AuthService, getCities) {                        
                        return getCities.query().$promise.then(
                                function (response) {
                                    return response.Data;
                                },
                                function (error) {
                                    console.error(error);
                                    if (error.statusText === 'Unauthorized') {
                                        AuthService.logout();
                                    }
                                }
                            );
                    }
                }
            }
        }
    })
    .state('app.campaigns.manageCampaigns', {
        url: '/manageCampaigns',
        data: {
            title: 'Manage Campaigns'
        },
        views: {
            "content@app": {
                templateUrl: 'app/campaigns/views/manageCampaigns.html',
                controller: 'ManageCampaignsController',
                resolve: {
                    campaigns: function($cookies, appSettings, AuthService, getCampaigns) {
                        return getCampaigns.query().$promise.then(
                            function (response) {
                                return response.Data;
                            },
                            function (error) {
                                console.error(error);
                                if (error.statusText === 'Unauthorized') {
                                    AuthService.logout();
                                }
                            }
                        );
                    }
                }
            }
        }
    })
    .state('app.campaigns.editCampaign', {
        url: '/editCampaign/:campaignId',
        data: {
            title: 'Edit Campaign'
        },
        views: {
            "content@app": {
                templateUrl: 'app/campaigns/views/editCampaign.html',
                controller: 'EditCampaignController',
                resolve: {
                    campaign: function($state, $stateParams, $cookies, AuthService, getCampaign){
                        return getCampaign.query(
                            {
                                campaignId: $stateParams.campaignId
                            }
                        ).$promise.then(
                                function (response) {
                                    return response.Data;
                                },
                                function (error) {
                                    console.error(error);
                                    if (error.statusText === 'Unauthorized') {
                                        AuthService.logout();
                                    }
                                }
                            );
                    },
                    cities: function($cookies, appSettings, AuthService, getCities) {
                        return getCities.query().$promise.then(
                                function (response) {
                                    return response.Data;
                                },
                                function (error) {
                                    console.error(error);
                                    if (error.statusText === 'Unauthorized') {
                                        AuthService.logout();
                                    }
                                }
                            );
                    },
                    districts: function($http, $cookies, appSettings, AuthService, campaign, getCityDistricts) {
                        return getCityDistricts.query(
                            {
                                cityId: campaign.District.CityID
                            }
                        ).$promise.then(
                            function (response) {
                                return response.Data;
                            }, function (error) {
                                console.error(error);
                                if (error.statusText === 'Unauthorized') {
                                    AuthService.logout();
                                }
                            }
                        );
                    }
                }
            }
        }
    })
});
