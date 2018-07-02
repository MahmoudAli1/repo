'use strict';

angular.module('app.settings').controller('LocalizationsController', function ($scope, $state, $cookies, $compile, AuthService, deleteLocalization, localizations) {

    $scope.localizations = localizations.localizations;

    $scope.createLocalization = function() {
        $state.go('app.settings.createLocalization');
    };

    $scope.editLocalization = function(item) {
        $state.go('app.settings.editLocalization', {localization: item});
    };

    $scope.deleteLocalization = function (item) {
        $.SmartMessageBox({
            title : "Delete confirmation!",
            content : "Are you sure you want to delete this translation??",
            buttons : '[No][Yes]'
        }, function(ButtonPressed) {
            if (ButtonPressed === "Yes") {
                deleteLocalization.delete(
                    {
                        access_token: $cookies.get('accessToken'),
                        id: item.id
                    }
                ).$promise.then(
                    function (response) {
                        $.smallBox({
                            title : "Item Delete",
                            content : "Translation was delete successfully",
                            color : "#c42233",
                            iconSmall : "fa fa-times fadeInRight animated",
                            timeout : 4000
                        });
                        $state.reload();
                    },
                    function (error) {
                        console.error(error);
                        if (error.statusText === 'Unauthorized') {
                            AuthService.logout();
                        }
                    }
                );
            }

        });
    }

});