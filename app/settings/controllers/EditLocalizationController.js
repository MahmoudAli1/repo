'use strict';

angular.module('app.settings').controller('EditLocalizationController', function ($scope, $state, $cookies, Upload, appSettings, AuthService, putChangesForLocalization, localization) {
    $scope.pageName = "Edit a localization";

    $scope.localization = localization;
    //setup dropzone module for editting an image
    $scope.updateLocalization = function () {
        putChangesForLocalization.update(
            {
                access_token: $cookies.get('accessToken'),
                id: $scope.localization.id
            },
            {
                "key": $scope.localization.key,
                "arabicTitle": $scope.localization.arabicTitle,
                "arabicBody": $scope.localization.arabicBody,
                "englishTitle":$scope.localization.englishTitle,
                "englishBody" :$scope.localization.englishBody
            }
        ).$promise.then(
            function (response) {
                $scope.isLocalizationEdited = true;
                $state.go('app.settings.localizations');
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    };

});