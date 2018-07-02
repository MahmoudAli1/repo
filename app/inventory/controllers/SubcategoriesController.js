'use strict';

angular.module('app.inventory').controller('SubcategoriesController', 
function ($scope, $state, $compile, AuthService, deleteCategory, subcategories) {
	$scope.subcategories = subcategories;

	$scope.getSubcategoryWithId = function(id){
		return subcategories.find(sc => sc.ID == id);
    };

    $scope.openSubcategory = function(subcategoryId) {
        $state.go('app.inventory.items', { subcategory: $scope.getSubcategoryWithId(subcategoryId), subcategoryId });
    };

	$scope.editSubcategory = function(subcategoryId) {
		var subcategoryToEdit = $scope.getSubcategoryWithId(subcategoryId);
		$state.go('app.inventory.editSubcategory', {subcategory: subcategoryToEdit});
	};

	$scope.openWindowForDeleteSubcategory = function(subcategoryId) {
		var subcategory = $scope.getSubcategoryWithId(subcategoryId);
		$scope.message = "Are you sure you want to delete " + subcategory.EnglishName + " subcategory?";
		var element = angular.element('#confirmationModal-delete-button')
            .attr('ng-click','deleteSubcategory('+subcategoryId+')');
        angular.element('#confirmationModal-delete-button').append($compile(element)($scope));
    	$('#confirmationModal').modal('show');
	};

	$scope.openBranches = function(subcategoryId) {
		$state.go('app.inventory.branches', {'subCategory': subcategoryId});
	}

	$scope.deleteSubcategory = function(subcategoryId) {
		deleteCategory.delete({}, { id: subcategoryId }).$promise.then(
            function (response) {
                $state.reload();
            },
            function (error) {
            	console.error(error);
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
		$('#confirmationModal').modal('hide');
	};
});