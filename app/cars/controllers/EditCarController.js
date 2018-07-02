'use strict';

angular.module('app.cars').controller('EditCarController', function ($scope, $state, $cookies, Upload, appSettings, AuthService, updateCar, car) {
	$scope.car = car;
	//setup dropzone module for editting an image
    $scope.imageToEdit = car.Image;
		
	$scope.updateCar = function () {
		if ($scope.picFile && $scope.picFile.size && $scope.picFile.size > 0) {
			Upload.upload({
				url: appSettings.link + 'Upload/',
				headers: {'Authorization': $cookies.get('accessToken')}, 
				data: {file: $scope.picFile}
			}).then(function (response) {
				$scope.updateCarAPI(response.data.Data.FileName);
			}, function (error) {
				if (error.statusText === 'Unauthorized') {
					AuthService.logout();
				}
			});
		} else {
			$scope.updateCarAPI(null);
		}
	};
	
	$scope.updateCarAPI = function(image) {
		updateCar.update(
			{ id: $scope.car.ID },
			{
				Image: image,
				manufacturer: $scope.car.Manufacturer,
				modelName: $scope.car.ModelName,
				modelYear: $scope.car.ModelYear,
				plateNumber: $scope.car.PlateNumber,
				username: $scope.car.Username,
				password: $scope.car.Password
			}).$promise.then(function (responseWithEditedCar) {
				$state.go("app.cars.allCars");
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