'use strict';

angular.module('app.staff').controller('StaffController', 
function ($scope, $state, $compile, AuthService, admins, drivers, deleteStaff) {
	$scope.allStaff = true;
	$scope.admins = false;
	$scope.drivers = false;
	//Staff types
	$scope.staff = {
		admin: 'admin',
		driver: 'driver'
	};

	$scope.adminsTableOptions =  {
        "data": admins,
        "iDisplayLength": 10,
        "columns": [
            { 
                "data": "Name"
            },
            { 
                "data": null,
                render: function (data, type, admin) {
                    return '<button staff-id="'+ admin.Id +'" staff-type="'+ $scope.staff.admin +'" class="btn btn-warning edit btn-lg">Edit</button>';
                } 
            },
            { 
            	"data": null,
            	render: function (data, type, admin) {
            		return '<button staff-id="'+ admin.Id +'" staff-type="'+ $scope.staff.admin +'" class="btn btn-danger delete btn-lg">Delete</button>';
            	} 
            },
        ],
        "order": [[2, 'desc']]
    };

    $scope.driversTableOptions =  {
        "data": drivers,
        "iDisplayLength": 10,
        "columns": [
            { 
                "data": "Name"
            },
            { 
                "data": null,
                render: function (data, type, driver) {
                    return '<button staff-id="'+ driver.Id +'" staff-type="'+ $scope.staff.driver +'" class="btn btn-warning edit btn-lg">Edit</button>';
                } 
            },
            { 
            	"data": null,
            	render: function (data, type, driver) {
            		return '<button staff-id="'+ driver.Id +'" staff-type="'+ $scope.staff.driver +'" class="btn btn-danger delete btn-lg">Delete</button>';
            	} 
            },
        ],
        "order": [[2, 'desc']]
    };

    $scope.displayAllStaff = function() {
    	$scope.allStaff = true;
		$scope.admins = false;
		$scope.drivers = false;
    };

    $scope.displayAdmins = function() {
    	$scope.allStaff = false;
		$scope.admins = true;
		$scope.drivers = false;
    };

    $scope.displayDrivers = function() {
    	$scope.allStaff = false;
		$scope.admins = false;
		$scope.drivers = true;
    };

    $scope.getStaffWithId = function(id, type){
    	if(type === 'admin'){
            return admins.find(a => a.Id == id);
    	}else{
            return drivers.find(d => d.Id == id);
    	}
    };

    $scope.editStaff = function(staffId, staffType) {
        var staffToEdit = $scope.getStaffWithId(staffId, staffType);
    	$state.go('app.staff.edit', {staff: staffToEdit});
    };

    $scope.openWindowForDeleteStaff = function(staffId, type) {
        var staff = $scope.getStaffWithId(staffId, type);
    	$scope.message = "Are you sure you want to delete the " + type +" "+ staff.Name +" with username " + staff.UserName;
        var element = angular.element('#confirmationModal-delete-button').attr('ng-click','deleteStaff(\''+staffId+'\')');
        angular.element('#confirmationModal-delete-button').append($compile(element)($scope));
    	$('#confirmationModal').modal('show');
    };

    $scope.deleteStaff = function(staffId) {
    	deleteStaff.delete({id: staffId}).$promise.then(
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

    $(function(){
        //get a hold of controller's scope
        var scope = angular.element($("#content")).scope();

        $("#content").on("click", ".edit", function(event){
            event.stopPropagation();
            var staffId = $(this).attr('staff-id');
            var staffType = $(this).attr('staff-type');
            scope.editStaff(staffId, staffType);
        });

        $("#content").on("click", ".delete", function(event){
            event.stopPropagation();
            var staffId = $(this).attr('staff-id');
            var staffType = $(this).attr('staff-type');
            scope.openWindowForDeleteStaff(staffId, staffType);
        });
    });
});