'use strict';

angular.module('app.cars').controller('CarsController', function (
	$scope,	$state, $cookies, $compile, AuthService, deleteCar, cars) {

	$scope.tableOptions =  {
        "data": cars,
        "iDisplayLength": 25,
        columns: [
            {
            	data: "Image",
            	render: function (data, type, car) {
                    return data ? '<img class="carImage" src="'+ car.Image +'">' : 'No Image';
                }
            },
            {
                data: "Manufacturer"
            },
            {
                data: "ModelName"
            },
            {
                data: "ModelYear"
            },
            {
            	data: "PlateNumber",
            	render: function (data, type, car) {
                    return data ? data : 'No plate number';
                }
            },
            {
                data: "Driver.Name",
                render: function (data, type, row) {
                    return data ? data : 'No driver';
                }
            },
            {
                data: "Username"
            },
            {
                data: "Password"
            },
            {
                data: "IsSelling",
                render: function (data, type, car) {
                    return data ? "Active" : "Inactive";
                }
            },
            {
            	data: null,
            	render: function (data, type, car) {
                    return '<button car-id="'+ car.ID +'" id="'+ car.ID +'-edit" class="btn btn-warning edit">Edit</button>';
                }
            },
            {
            	data: null,
            	render: function (data, type, car) {
                    return '<button car-id="'+ car.ID +'" id="'+ car.ID +'-delete" class="btn btn-danger delete">Delete</button>';
                }
            }
        ],
        "order": [[1, 'asc']]
    };

    $scope.openWindowForDeleteCar = function(carId) {
        var car = cars.find(car => car.ID == carId);
    	$scope.message = "Are you sure you want to delete" + car.Manufacturer +" "+ car.ModelName +" "+ car.ModelYear +" "+ " car with plate number " + car.PlateNumber;
    	var element = angular.element('#confirmationModal-delete-button')
            .attr('ng-click','deleteCar('+carId+')');
        angular.element('#confirmationModal-delete-button').append($compile(element)($scope));
    	$('#confirmationModal').modal('show');
    };

    $scope.deleteCar = function(carId) {
    	deleteCar.delete(
    	{
    		id: carId
    	}
    	).$promise.then(
        	function (response) {
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

    $scope.editCar = function(carId) {
    	var carToEdit = cars.find(car => car.ID == carId);
    	$state.go('app.cars.edit', {car: carToEdit});
    };

    $(function(){
        //get a hold of controller's scope
        var scope = angular.element($("#content")).scope();

        $("#content").on("click", ".edit", function(event){
            event.stopPropagation();
            var carId = $(this).attr('car-id');
            scope.editCar(carId);
        });

        $("#content").on("click", ".delete", function(event){
            event.stopPropagation();
            var carId = $(this).attr('car-id');
            scope.openWindowForDeleteCar(carId);
        });
    });
});