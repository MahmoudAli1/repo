'use strict';

angular.module('app.areas').controller('CreateCityController', 
function ($scope, $state, AuthService, createCity) {
    $scope.name = "";
    $scope.createCity = function() {
        createCity.create({}, { name: $scope.name }).$promise.then(
            function (response) {                
                $state.go("app.areas.manageLocations");
            },
            function (error) {
                console.error(error);
                //when coming error from the server with text 'Unauthorized' - will doing logout
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
                //when coming error from the server with text 'Bad Request' - will displaying message
                else if (error.statusText === 'Bad Request') {
                    $scope.isBadRequest = true;
                    //get first error
                    $scope.errorMessage = error.data.errorMessage[0].message;
                }
            }
        );
    };
});