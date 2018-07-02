'use strict';

angular.module('app.settings').controller('CreateLocalizationController', function ($scope, $state, $cookies, AuthService, postLocalization) {
    $scope.pageName = "Create a localization";

    $scope.localization = {};

    $scope.updateLocalization = function () {
        postLocalization.update(
            {
                access_token: $cookies.get('accessToken'),
            }, {
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