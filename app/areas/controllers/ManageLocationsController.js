'use strict';

angular.module('app.areas').controller('ManageLocationsController', 
function ($scope, $state, $cookies, $compile, locationsTree, deleteArea, activateArea, deactivateArea, sendToAllArea, sendToEligableArea, AuthService) {
	$scope.locationsTree = locationsTree;

	/**************** Managing Nestable List functionality **************/

	$scope.collapseAll = function() {
		angular.element('.dd').nestable('collapseAll');
	}

	$scope.expandAll = function() {
		angular.element('.dd').nestable('expandAll');
	}

	$scope.expandItem = function(li) {
		li.removeClass('dd-collapsed');
		li.children('[data-action="expand"]').hide();
        li.children('[data-action="collapse"]').show();
        li.children('ol').show();
	}

	$scope.collapseItem = function(li) {
		var lists = li.children('ol');
        if (lists.length) {
            li.addClass('dd-collapsed');
            li.children('[data-action="collapse"]').hide();
            li.children('[data-action="expand"]').show();
            li.children('ol').hide();
        }
	}

	//callback when ngRepeat finish rendering locations
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
	    angular.element(".dd").nestable('init');
    	$scope.collapseAll();
    	$scope.resetListListeners();
	});

	/*
	 * Overriding some listeners of jquery-nestable.js to avoid drag and drop effect
	 */
	$scope.resetListListeners = function() {
		//overriding mousedown listener to remove drag effect
		$(".dd-nodrag").on("mousedown", function(event) { // mousedown prevent nestable click
			event.preventDefault();
			return false;
		});

		//overriding mousedown listener to remove drag effect
		$(".dd-nodrag").on("click", function(event) { // click event
			event.preventDefault();
			return false;
		});

		//expand and collapse buttons listener
		$(".dd-item").on('click', 'button', function(e) {                
            var target = $(e.currentTarget),
                action = target.data('action'),
                item   = target.parent('li');
            if (action === 'collapse') {
                $scope.collapseItem(item);
            }
            if (action === 'expand') {
                $scope.expandItem(item);
            }
        });
    }
    
	/**************** Managing areas functionality **************/

	$scope.getButton = function(areaId) {
		var html = '<a>Test</a>';
		var template = angular.element(html);
		var linkFn = $compile(template);
		var element = linkFn($scope);

		angular.element('#'+areaId);

		var element = angular.element('#' + areaId)
            .text('OK')
            .attr('ng-click','areaDeactivate(areaId)')
            .removeAttr("class")
            .addClass("btn btn-primary");
	};

	$scope.openWindowForDeactivateArea = function (id, name) {
        $scope.message = 'Confirm deactivating "'+ name +'" area';
        $scope.areaId = id;
        var element = angular.element('#confirmationModal-ok-button')
            .text('OK')
            .attr('ng-click','areaDeactivate(areaId)')
            .removeAttr("class")
            .addClass("btn btn-primary");
        angular.element('#confirmationModal-ok-button').append($compile(element)($scope));
        $('#confirmationModal').modal('show');
    };

    $scope.areaDeactivate = function (id) {
        deactivateArea.update(
        {
            access_token: $cookies.get('accessToken'),
            id: id
        }
        ).$promise.then(
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

        $('#confirmationModal').modal('hide');
    };

    $scope.openWindowForActivateArea = function (id, name) {
        $scope.message = 'Confirm activating "'+ name +'" area';
        $scope.areaId = id;
        var element = angular.element('#confirmationModal-ok-button')
            .text('OK')
            .attr('ng-click','areaActivate(areaId)')
            .removeAttr("class")
            .addClass("btn btn-primary");
        angular.element('#confirmationModal-ok-button').append($compile(element)($scope));
        $('#confirmationModal').modal('show');
    };

    $scope.areaActivate = function (id) {
        activateArea.update(
        {
            access_token: $cookies.get('accessToken'),
            id: id
        }
        ).$promise.then(
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

        $('#confirmationModal').modal('hide');
    };

    $scope.openWindowForSendToAllArea = function (id) {
        $scope.message = "If You Confirm , Driver Will Send Notifications To Users Outside Their Houses !";
        $scope.areaId = id;
        var element = angular.element('#confirmationModal-ok-button')
            .text('OK')
            .attr('ng-click','areaSendToAll(areaId)')
            .removeAttr("class")
            .addClass("btn btn-primary");
        angular.element('#confirmationModal-ok-button').append($compile(element)($scope));
        $('#confirmationModal').modal('show');
    };

    $scope.areaSendToAll = function (id) {
        sendToAllArea.update(
        {
            id: id
        }
        ).$promise.then(
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

        $('#confirmationModal').modal('hide');
    };

    $scope.openWindowForSendToEligableArea = function (id) {
        $scope.message = "If You Confirm , Driver Will Send Notifications To Users In Houses Only !";
        $scope.areaId = id;
        var element = angular.element('#confirmationModal-ok-button')
            .text('OK')
            .attr('ng-click','areaSendToEligable(areaId)')
            .removeAttr("class")
            .addClass("btn btn-primary");
        angular.element('#confirmationModal-ok-button').append($compile(element)($scope));
        $('#confirmationModal').modal('show');
    };

    $scope.areaSendToEligable = function (id) {
        sendToEligableArea.update(
        {
            access_token: $cookies.get('accessToken'),
            id: id
        }
        ).$promise.then(
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

        $('#confirmationModal').modal('hide');
    };

    $scope.areaEdit = function (id) {
        $state.go('app.areas.editArea', {'areaId': id});
    };
    $scope.createDistrict = function () {
        $state.go('app.areas.createDistrict');
    }

    $scope.createCity = function(){
        $state.go('app.areas.createCity');
    }
    $scope.editDistrict = function (id) {
        $state.go('app.areas.editDistrict', {'districtId':id});
    }

    $scope.openWindowForDeleteArea = function (id, name) {
        $scope.message = 'Confirm deleting "'+ name +'" area';
        $scope.areaId = id;
        var element = angular.element('#confirmationModal-ok-button')
            .text('Delete')
            .attr('ng-click','areaDelete(areaId)')
            .removeAttr("class")
            .addClass("btn btn-danger");
        angular.element('#confirmationModal-ok-button').append($compile(element)($scope));
        $('#confirmationModal').modal('show');
    };

    $scope.areaDelete = function (id) {
        deleteArea.delete(
        {
            access_token: $cookies.get('accessToken'),
            id: id
        }
        ).$promise.then(
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

        $('#confirmationModal').modal('hide');
    };
});