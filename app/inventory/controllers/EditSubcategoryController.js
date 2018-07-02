'use strict';

angular.module('app.inventory').controller('EditSubcategoryController', 
function ($scope, $state, $cookies, Upload, appSettings, AuthService, updateCategory, subcategory) {
    $scope.subcategory = subcategory;
    
    //setup dropzone module for editting an image
    $scope.imageToEdit = subcategory.Image;
    $scope.primaryColor = {'background-color': $scope.subcategory.PrimaryColor};
    $scope.secondaryColor = {'background-color': $scope.subcategory.SecondaryColor};

    $scope.$watch('subcategory.primaryColor', function(newVal, oldVal){
        $scope.primaryColor = {'background-color':$scope.subcategory.PrimaryColor};
    });

    $scope.$watch('subcategory.secondaryColor', function(newVal, oldVal){
        $scope.secondaryColor = {'background-color':$scope.subcategory.SecondaryColor};
    });

	$scope.updateSubcategory = function () {
        if ($scope.picFile && $scope.picFile.size && $scope.picFile.size > 0) {
            Upload.upload({
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                $scope.updateSubcategoryAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.updateSubcategoryAPI(null);
        }
    }

    $scope.updateSubcategoryAPI = function(image) {
		updateCategory.update(
            {
                id: $scope.subcategory.ID
            },
            {
              'EnglishName': $scope.subcategory.EnglishName,
              'ArabicName':$scope.subcategory.ArabicName,
              'ParentID': $scope.subcategory.ParentID,
              'EnglishDescription': $scope.subcategory.EnglishDescription,
              'ArabicDescription': $scope.subcategory.ArabicDescription,
              'ViewOrder': $scope.subcategory.ViewOrder,
              'DarkBackground': $scope.subcategory.DarkBackground,
              'PrimaryColor': $scope.subcategory.PrimaryColor,
              'SecondaryColor': $scope.subcategory.SecondaryColor,
              'Image': image ? image : $scope.subcategory.Image.substr($scope.subcategory.Image.lastIndexOf('/') + 1)
            }
        ).$promise.then(
            function (response) {
                $state.go('app.inventory.subcategories', { categoryId: $scope.subcategory.ParentID });
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    };
});