'use strict';

angular.module('app.inventory').controller('CreateSubcategoryController', 
function($scope, $state, $cookies, Upload, appSettings, AuthService, categories, createCategory) {
    $scope.listOfCategories = categories;
    $scope.categorySelect = {
        availableOptions: $scope.listOfCategories,
        selectedOption: {
            ID: $scope.listOfCategories[0].ID,
            EnglishName: $scope.listOfCategories[0].EnglishName
        }
    }

    $scope.subcategory = {
        EnglishName: null,
        ArabicName:'',
        EnglishDescription: null,
        ArabicDescription: null,
        PrimaryColor: '#fff',
        SecondaryColor: '#fff',
        DarkBackground: true,
        ParentID: $scope.categorySelect.selectedOption.ID
    };
    $scope.PrimaryColor = {'background-color':$scope.subcategory.PrimaryColor};
    $scope.SecondaryColor = {'background-color':$scope.subcategory.SecondaryColor};

    $scope.$watch('categorySelect.selectedOption', function(newVal, oldVal){
        $scope.subcategory.ParentID = $scope.categorySelect.selectedOption.ID;
    });

    $scope.$watch('subcategory.PrimaryColor', function(newVal, oldVal){
        $scope.PrimaryColor = {'background-color':$scope.subcategory.PrimaryColor};
    });

    $scope.$watch('subcategory.SecondaryColor', function(newVal, oldVal){
        $scope.SecondaryColor = {'background-color':$scope.subcategory.SecondaryColor};
    });

	$scope.createSubcategory = function() {
        if ($scope.picFile) {
            Upload.upload({
                url: appSettings.link + 'Upload',
                data: {file: $scope.picFile},
                headers: {'Authorization': $cookies.get('accessToken')}
            }).then(function (response) {
                $scope.createSubcategoryAPI(response.data.Data.FileName);
            }, function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $state.go('app.inventory.categories');
        }
    }
    
    $scope.createSubcategoryAPI = function(image) {
        $scope.subcategory.Image = image;
        createCategory.create({}, $scope.subcategory).$promise.then(
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