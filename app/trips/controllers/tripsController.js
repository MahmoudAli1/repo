'use strict';

angular.module('app.trips').controller('TripsController', 
    function ($scope, $state, trips) {
    $scope.tableOptions =  {
        "data": trips,
        "iDisplayLength": 25,
        columns: [
            {
                data: "DriverName"
            },
            {
                data: "CarName"
            },
            {
                data: null,
                render: function (data, type, trip) {
                    return moment(trip.CreatedAt).add(3, 'hours').format("DD/MMM/YYYY HH:mm A");
                }
            },
            {
                data: null,
                render: function (data, type, trip) {
                    return moment(trip.StartedAt).add(3, 'hours').format("DD/MMM/YYYY HH:mm A");;
                }
            },
            {
                data: null,
                render: function (data, type, trip) {
                    if(trip.EndedAt) {
                    return moment(trip.EndedAt).add(3, 'hours').format("DD/MMM/YYYY HH:mm A");
                    }
                    return " ";
                }
            },
            {
            	data: null,
            	render: function (data, type, trip) {
                    return '<button trip-id="'+ trip.ID +'" id="'+ trip.ID +'-view" class="btn btn-success view">View</button>';
                }
            },
            {
            	data: null,
            	render: function (data, type, trip) {
                    return '<button trip-id="'+ trip.ID +'" id="'+ trip.ID +'-edit" class="btn btn-warning edit">Edit</button>';
                }
            }            
        ],
        "order": [[1, 'asc']]
    };

    $scope.editTrip = function(tripID) {
        $state.go('app.trips.edit', { tripID });
    };

    $scope.viewTrip = function(tripID) {
        $state.go('app.trips.view', { tripID });
    }

    $(function(){
        //get a hold of controller's scope
        var scope = angular.element($("#content")).scope();

        $("#content").on("click", ".edit", function(event){
            event.stopPropagation();
            var tripID = $(this).attr('trip-id');
            scope.editTrip(tripID);
        });

        $("#content").on("click", ".view", function(event){
            event.stopPropagation();
            var tripID = $(this).attr('trip-id');
            scope.viewTrip(tripID);
        });
    });
});