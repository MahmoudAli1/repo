'use strict';

angular.module('app.inventory').controller('CategoriesController', 
function ($scope, $state, $compile, AuthService, categories, deleteCategory) {
	$scope.categories = categories;

	$scope.getCategoryWithId = function(id){
		return categories.find(c => c.ID == id);
    };

    $scope.openCategory = function(categoryId) {
        $state.go('app.inventory.subcategories', { categoryId });
    };

	$scope.editCategory = function(categoryId) {
		$state.go('app.inventory.editCategory', {category: $scope.getCategoryWithId(categoryId)});
	};

	$scope.openWindowForDeleteCategory = function(categoryId) {
		var category = $scope.getCategoryWithId(categoryId);
		$scope.message = "Are you sure you want to delete " + category.EnglishName + " category?";
		var element = angular.element('#confirmationModal-delete-button')
            .attr('ng-click','deleteCategory('+categoryId+')');
        angular.element('#confirmationModal-delete-button').append($compile(element)($scope));
    	$('#confirmationModal').modal('show');
	};

	$scope.deleteCategory = function(categoryId) {
		deleteCategory.delete({}, { id: categoryId }).$promise.then(
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