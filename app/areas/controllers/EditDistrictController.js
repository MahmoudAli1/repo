'use strict';

angular.module('app.maps').controller('EditDistrictController', 
function ($scope, $state, $cookies, Upload, appSettings, AuthService, editDistrict, district, cities) {
    $scope.district = district;
    //setup dropzone module for editting an image
    $scope.imageToEdit = district.Image;
    $scope.listOfCities = cities;
    $scope.listOfCities.unshift({
        ID: -1,
        Name: "--Select a city--"
    });
    $scope.citySelect = { // select in HTML
        availableOptions: $scope.listOfCities,
        selectedOption: {
            ID: district.City.ID,
            Name: district.City.Name
        }
    };

    $scope.updateDistrict = function() {
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
                $scope.updateDistrictAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.updateDistrictAPI(null);
        }
    };
    
    $scope.updateDistrictAPI = function(image) {
        editDistrict.update(
            {
                id: $scope.district.ID
            },
            {
                englishName: $scope.district.EnglishName,
                arabicName: $scope.district.ArabicName,
                cityID: $scope.citySelect.selectedOption.ID,
                image
            }).$promise.then(
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