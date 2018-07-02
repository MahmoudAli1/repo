'use strict';

angular.module('app.areas').controller('CreateDistrictController', 
function ($scope, $state, $cookies, AuthService, createDistrict, Upload, cities, appSettings) {
    //populate list of cities to be used in HTML select element
    $scope.listOfCities = cities;
    $scope.listOfCities.unshift({
        ID: -1,
        Name: "--Select a city--"
    });
    $scope.citySelect = { // select in HTML
        availableOptions: $scope.listOfCities,
        selectedOption: {
            ID: $scope.listOfCities[0].ID,
            Name: $scope.listOfCities[0].Name
        }
    };

    $scope.district = {};
    $scope.isDistrictCreated = false;
    $scope.createDistrict = function () {
        if ($scope.picFile) {
            // upload photo of the car
            Upload.upload({
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                $scope.createDistrictAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.createDistrictAPI(null);
        }
    };
    
    $scope.createDistrictAPI = function(image) {
        var dataOfDistrict = {
            englishName: $scope.district.englishName,
            cityID: $scope.citySelect.selectedOption.ID,
            arabicName: $scope.district.arabicName
        };
        createDistrict.create({}, dataOfDistrict).$promise.then(
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