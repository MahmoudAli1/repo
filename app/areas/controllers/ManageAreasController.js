'use strict';

angular.module('app.areas').controller('ManageAreasController', 
function ($scope, $compile, $state, areasAndUsers, deleteArea, activateArea, deactivateArea, sendToAllArea, sendToEligableArea, AuthService) {

    $scope.idCounter = 0;
    $scope.clickedButtonId = null;
    $scope.areasList = areasAndUsers.areas;

    $scope.tableOptions =  {
        "data": areasAndUsers.areas,
        "iDisplayLength": 25,
        columns: [
            {
                data: "Name"
            },
            {
                data: "CustomerCount"
            },
            {
                data: null,
                render: function (data, type, area) {
                    $scope.idCounter++;
                    return '<button area-id="'+ area.ID +'" id="'+ $scope.idCounter +'" class="btn btn-success notifyAll">Notify All</button>';
                }
            },
            {
                data: null,
                render: function (data, type, area) {
                    $scope.idCounter++;
                    return '<button area-id="'+ area.ID +'" id="'+ $scope.idCounter +'" class="btn btn-success notifyEligable">Notify Eligable</button>';
                }
            },
            {
                data: null,
                render: function (data, type, area) {
                    $scope.idCounter++;
                    if(area.IsDisplayed){
                        return '<button area-id="'+ area.ID +'" name="'+ area.Name +'" id="'+ $scope.idCounter +'" class="btn bg-color-blueDark txt-color-white deactivate">Deactivate</button>';
                    }else{
                        return '<button area-id="'+ area.ID +'" name="'+ area.Name +'" id="'+ $scope.idCounter +'" class="btn btn-info activate">Activate</button>';
                    }
                }
            },
            {
                data: null,
                render: function (data, type, area) {
                    $scope.idCounter++;
                    return '<button area-id="'+ area.ID +'" id="'+ $scope.idCounter +'" class="btn btn-warning edit">Edit</button>';
                }
            },
            {
                data: null,
                render: function (data, type, area) {
                    $scope.idCounter++;
                    return '<button area-id="'+ area.ID +'" name="'+ area.Name +'" id="'+ $scope.idCounter +'" class="btn btn-danger delete">Delete</button>';
                }
            }
        ],
        "order": [[1, 'asc']]
    };

    $scope.openWindowForDeactivateArea = function (id, name, $event) {
        $event.stopPropagation();
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
            }
        );

        $('#confirmationModal').modal('hide');
    };

    $scope.openWindowForActivateArea = function (id, name, $event) {
        $event.stopPropagation();
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

    $scope.openWindowForSendToAllArea = function (id, $event) {
        $event.stopPropagation();
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
        sendToAllArea.update({ id: id }).$promise.then(
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

    $scope.openWindowForSendToEligableArea = function (id, $event) {
        $event.stopPropagation();
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
        sendToEligableArea.update({ id: id }).$promise.then(
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

    $scope.openWindowForDeleteArea = function (id, name, $event) {
        $event.stopPropagation();
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
        deleteArea.delete({ id: id }).$promise.then(
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

    $(function(){
        //get a hold of controller's scope
        var scope = angular.element($("#content")).scope();

        $("#content").on("click", ".deactivate", function(event){
            event.stopPropagation();
            var id = $(this).attr('area-id');
            var areaName = $(this).attr('name');
            var buttonId = $(this).attr('id');
            $scope.clickedButtonId = buttonId;
            scope.openWindowForDeactivateArea(id, areaName, event);
        });

        $("#content").on("click", ".activate", function(event){
            event.stopPropagation();
            var id = $(this).attr('area-id');
            var areaName = $(this).attr('name');
            var buttonId = $(this).attr('id');
            scope.clickedButtonId = buttonId;
            scope.openWindowForActivateArea(id, areaName, event);
        });

        $("#content").on("click", ".delete", function(event){
            event.stopPropagation();
            var id = $(this).attr('area-id');
            var areaName = $(this).attr('name');
            var buttonId = $(this).attr('id');
            scope.clickedButtonId = buttonId;
            scope.openWindowForDeleteArea(id, areaName, event);
        });

        $("#content").on("click", ".edit", function(event){
            event.stopPropagation();
            var id = $(this).attr('area-id');
            var buttonId = $(this).attr('id');
            scope.clickedButtonId = buttonId;
            scope.areaEdit(id, event);
        });

        $("#content").on("click", ".notifyAll", function(event){
            event.stopPropagation();
            var id = $(this).attr('area-id');
            var buttonId = $(this).attr('id');
            scope.clickedButtonId = buttonId;
            scope.openWindowForSendToAllArea(id, event);
        });

        $("#content").on("click", ".notifyEligable", function(event){
            event.stopPropagation();
            var id = $(this).attr('area-id');
            var buttonId = $(this).attr('id');
            scope.clickedButtonId = buttonId;
            scope.openWindowForSendToEligableArea(id, event);
        });
    });
});