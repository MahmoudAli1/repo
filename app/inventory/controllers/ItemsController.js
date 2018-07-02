'use strict';

angular.module('app.inventory').controller('ItemsController', 
function ($scope, $state, $compile, AuthService, subcategory, deleteItem) {
    $scope.items = subcategory.Items;

	$scope.editItem = function(itemId) {
		$state.go('app.inventory.editCategoryItem', {item: $scope.items.find(i => i.ID == itemId)});
	};

	$scope.openWindowForDeleteItem = function(itemId) {
		var item = $scope.items.find(i => i.ID == itemId);
		$scope.message = "Are you sure you want to delete " + item.EnglishName + " item?";
		var element = angular.element('#confirmationModal-delete-button').attr('ng-click','deleteItem('+itemId+')');
        angular.element('#confirmationModal-delete-button').append($compile(element)($scope));
    	$('#confirmationModal').modal('show');
	};

	$scope.deleteItem = function(itemId) {
		deleteItem.delete(
            {
                id: itemId
            }
        ).$promise.then(
            function (response) {
                // Remove the item from the items list
                $.each($scope.items, function(index){
                    if($scope.items[index].ID === itemId) {
                        $scope.items.splice(index,1);
                        return false;
                    }
                });
                $state.reload();
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
        $('#confirmationModal').modal('hide');
	};
});