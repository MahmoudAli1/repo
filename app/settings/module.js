"use strict";


angular.module('app.settings', ['ui.router'])
.config(function ($stateProvider) {

    $stateProvider
        .state('app.settings', {
            abstract: true,
            url: '/settings',
            data: {
                title: 'Settings'
            }})
        .state('app.settings.localizations', {
            url: '/localizations',
            data: {
                title: 'Localizations'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/settings/views/localizations.html',
                    controller: 'LocalizationsController',
                    resolve: {
                        localizations: function($state, $cookies, $stateParams, AuthService, getListOfLocalizations){
                            return getListOfLocalizations.query(
                                {
                                    access_token: $cookies.get('accessToken')
                                }
                            ).$promise.then(
                                function (data) {
                                    return data;
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
      .state('app.settings.editLocalization', {
            url: '/editLocalization',
            params: {
                localization: null
            },
            data: {
                title: 'Edit Localization'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/settings/views/editLocalization.html',
                    controller: 'EditLocalizationController',
                    resolve: {
                        localization: function($state, $stateParams){
                            if(!$stateParams.localization) $state.go('app.settings.localizations');
                            return $stateParams.localization;
                        }
                    }
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.settings.createLocalization', {
            url: '/createLocalization',
            params: {
                localization: null
            },
            data: {
                title: 'Create Localization'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/settings/views/editLocalization.html',
                    controller: 'CreateLocalizationController',
                }
            }
        })
});
