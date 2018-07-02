'use strict';

angular.module('app.inventory').controller('CreateCategoryItemController', 
function ($scope, $state, $cookies, Upload, appSettings, AuthService, createItem, categories) {
    $scope.listOfCategories = categories;
    $scope.listOfCategories.unshift({
        ID: -1,
        EnglishName: "--Select a category--"
    });
    $scope.categorySelect = {
        availableOptions: $scope.listOfCategories,
        selectedOption: {
            ID: $scope.listOfCategories[0].ID,
            EnglishName: $scope.listOfCategories[0].EnglishName
        }
    }

    $scope.getSubcategories = function() {
        if($scope.categorySelect.selectedOption.ID !== -1) {
            for (var i = $scope.listOfCategories.length - 1; i >= 0; i--) {
                if($scope.listOfCategories[i].ID == $scope.categorySelect.selectedOption.ID) {
                    if($scope.listOfCategories[i].Subcategories.length > 0) {
                        $scope.listOfSubcategories = angular.copy($scope.listOfCategories[i].Subcategories);
                        $scope.listOfSubcategories.unshift({
                            ID: -1,
                            EnglishName: "--Select a subcategory--"
                        });
                        $scope.subcategorySelect = {
                            availableOptions: $scope.listOfSubcategories,
                            selectedOption: {
                                ID: $scope.listOfSubcategories[0].ID,
                                EnglishName: $scope.listOfSubcategories[0].EnglishName
                            }
                        }
                    } else {
                        $scope.subcategorySelect.availableOptions = null;
                    }
                    break;
                }
            }
        } else {
            $scope.subcategorySelect.availableOptions = null;
        }
    }

    $scope.createItem = function() {
        if ($scope.picFile) {
            Upload.upload({
                url: appSettings.link + 'Upload',
                headers: {'Authorization': $cookies.get('accessToken')},
                data: {file: $scope.picFile}
            }).then(function (response) {
                $scope.createItemAPI(response.data.Data.FileName);
            }, function (error) {
                console.error(error);
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            });
        } else {
            $scope.createItemAPI(null);
        }
    };

	$scope.createItemAPI = function(image) {
        $scope.item.CategoryID =  $scope.subcategorySelect.selectedOption.ID;
        $scope.item.Image = image;

        createItem.create({}, $scope.item).$promise.then(
            function (response) {
                $state.go('app.inventory.items', {'subcategoryId': $scope.item.CategoryID});
            },
            function (error) {
                console.error(error);
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
	};
});