'use strict';

angular.module('app.inventory').controller('EditCategoryController', 
function ($scope, $state, $cookies, Upload, appSettings, AuthService, updateCategory, category) {
	$scope.category = category;
    //setup dropzone module for editting an image
    $scope.imageToEdit = category.Image;

	$scope.updateCategory = function () {
        if ($scope.picFile && $scope.picFile.size && $scope.picFile.size > 0) {
            Upload.upload({
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                $scope.updateCategoryAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.updateCategoryAPI(null);
        }
    };

    $scope.updateCategoryAPI = function(image) {
        updateCategory.update(
            {
                id: $scope.category.ID
            },
            {
                "EnglishName": $scope.category.EnglishName,
                "ArabicName": $scope.category.ArabicName,
                "EnglishDescription": $scope.category.EnglishDescription,
                "ViewOrder": $scope.category.ViewOrder,
                "Image": image ? image : $scope.category.Image.substr($scope.category.Image.lastIndexOf('/') + 1)
            }
        ).$promise.then(
            function (response) {
                $state.go('app.inventory.categories');
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    }
});