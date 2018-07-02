'use strict';

angular.module('app.inventory').controller('CreateCategoryController', 
function ($scope, $state, $cookies, Upload, appSettings, AuthService, createCategory) {
	$scope.createCategory = function() {
        if ($scope.picFile) {
            Upload.upload({                        
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                $scope.createCategoryAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.createCategoryAPI(null);
        }
    };
    
    $scope.createCategoryAPI = function(image) {
        $scope.category.Image = image;
        createCategory.create({},$scope.category).$promise.then(
            function (response) {
                $state.go('app.inventory.categories');
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