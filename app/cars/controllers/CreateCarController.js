'use strict';

angular.module('app.cars').controller('CreateCarController', function ($scope, $state, $cookies, AuthService, createCar, Upload, appSettings) {

	$scope.createCar = function() {
		$scope.isBadRequest = false;
        //reset error message
        $scope.errorMessage = null;

        if ($scope.picFile) {
            // upload photo of the car
            Upload.upload({
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                $scope.createCarAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.createCarAPI(null);
        }
    };
    
    $scope.createCarAPI = function(image) {
        $scope.car.image = image;
        createCar.create({},$scope.car).$promise.then(
            function (response) {                
                $state.go('app.cars.allCars');
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