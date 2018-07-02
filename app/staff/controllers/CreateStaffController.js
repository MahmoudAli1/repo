'use strict';

angular.module('app.staff').controller('CreateStaffController', 
function ($scope, $state, $cookies, Upload, appSettings, AuthService, createStaff) {
	$scope.createStaff = function () {
        var staffMember = {
            name: $scope.staff.name,
            username: $scope.staff.email,
            email: $scope.staff.email,
            password: $scope.staff.password === $scope.staff.confirmedPassword ? $scope.staff.password : null,
            userType: $scope.staff.type
        };
		
		if ($scope.picFile) {
            // upload photo of the car
            Upload.upload({
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                staffMember.image = response.data.Data.FileName;
                $scope.createStaffAPI(staffMember);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.createStaffAPI(staffMember);
        }
    };

    $scope.createStaffAPI = function(staffMember) {
        createStaff.create({},staffMember).$promise.then(
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