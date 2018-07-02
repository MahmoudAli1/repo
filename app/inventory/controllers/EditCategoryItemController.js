'use strict';

angular.module('app.inventory').controller('EditCategoryItemController', 
function ($scope, $state, $cookies, Upload, appSettings, AuthService, item, updateItem) {
    console.log(item);
	$scope.item = item;
    //setup dropzone module for editting an image
    $scope.imageToEdit = item.Image;

    $scope.updateCategoryItem = function () {
		if ($scope.picFile && $scope.picFile.size && $scope.picFile.size > 0) {
			Upload.upload({
				url: appSettings.link + 'Upload/',
				headers: {'Authorization': $cookies.get('accessToken')}, 
				data: {file: $scope.picFile}
			}).then(function (response) {
				$scope.updateCategoryItemAPI(response.data.Data.FileName);
			}, function (error) {
				if (error.statusText === 'Unauthorized') {
					AuthService.logout();
				}
			});
		} else {
			$scope.updateCategoryItemAPI(null);
		}
	};
	
	$scope.updateCategoryItemAPI = function(image) {
		updateItem.update(
            {
                id: $scope.item.ID
            },
            {
                EnglishName: $scope.item.EnglishName,
                ArabicName: $scope.item.ArabicName,
                EnglishDescription: $scope.item.EnglishDescription,
                ArabicDescription: $scope.item.ArabicDescription,
                Cost: $scope.item.Cost,
                Price: $scope.item.Price,
                InventoryCount: $scope.item.InventoryCount,
                CategoryID: $scope.item.CategoryID,
                Image: image ? image : $scope.item.Image.substr($scope.item.Image.lastIndexOf('/') + 1)
            }
        ).$promise.then(
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