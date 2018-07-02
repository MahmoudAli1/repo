'use strict';

angular.module('app.staff').controller('EditStaffController', 
function ($scope, $state, $cookies, $window, Upload, appSettings, AuthService, updateStaff, staff) {

	$scope.staff = staff;
    //setup dropzone module for editting an image
    $scope.imageToEdit = staff.Image;
	$window.scrollTo(0, 0);

	$scope.updateStaff = function () {
        if ($scope.picFile) {
            // upload photo of the car
            Upload.upload({
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                $scope.updateStaffAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.updateStaffAPI(null);
        }
    };

    $scope.updateStaffAPI = function(image) {
        $scope.staff.Image = image;
        updateStaff.update(
            {
                id: $scope.staff.Id
            },
            {
                "name": $scope.staff.Name,
                "email": $scope.staff.UserName
            }).$promise.then(
            function (response) {                
                $state.go('app.staff.allStaff');
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