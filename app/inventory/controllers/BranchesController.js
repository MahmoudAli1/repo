'use strict';

angular.module('app.inventory').controller('BranchesController', 
function (AuthService, $scope, $state, $stateParams, deleteBranch, activateBranch, deactivateBranch, branches) {
    $scope.branches = branches;

    $scope.editBranch = function(branchId) {
		$state.go('app.inventory.editBranch', {
            branch: $scope.branches.find(b => b.ID == branchId),
            subCategoryId: $stateParams.subCategory
        });
    };

    $scope.deleteBranch = function(branchId) {
        deleteBranch.delete(
        {
            branch: branchId
        }).$promise.then(
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
    }

    $scope.activateBranch = function(branchId) {
        activateBranch.update(
        {
            branch: branchId
        }).$promise.then(
            function (response) {
                $state.reload();
            },
            function (error) {
                console.error(error);
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
                else if (error.statusText === 'Not Found') {
                }
            }
        );
    }

    $scope.deactivateBranch = function(branchId) {
        deactivateBranch.update(
        {
            branch: branchId,                
        }).$promise.then(
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
    }
});