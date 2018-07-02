'use strict';

angular.module('app.trips').controller('TripController', 
function (AuthService, $scope, $state, trip, endTrip) {
    var orders = [].concat.apply([], trip.Offerings.filter(o => o.Orders.length > 0).map(o => o.Orders));
    $scope.tripItems = trip.TripItems;
    $scope.driver = trip.Driver;
    $scope.car = trip.Car;
    $scope.startedAt = moment(trip.StartAt).format('MMMM D, YYYY HH:mm A');
    $scope.hasEnded = typeof trip.EndedAt != 'undefined';
    $scope.endedAt = $scope.endedAt ? 'N/A' : moment(trip.EndedAt).format('MMMM D, YYYY HH:mm A');
    $scope.offerings = trip.Offerings;
    $scope.offerings.forEach(o => {
        o.StartedAt = moment(o.StartedAt).format('MMMM D, YYYY HH:mm A');
        o.EndedAt = o.EndedAt ? moment(o.EndedAt).format('MMMM D YYYY HH:mm A') : "";
        o.DeliveredCount = o.Orders.filter(order => order.OrderStatus == 3).length;
        o.CanceledCount = o.Orders.filter(order => order.OrderStatus == 4).length;
        o.AreaNames = o.Areas.map(a => a.Name).join(', ');
    });
    $scope.deliveredOrdersCount = orders.filter(o => o.OrderStatus == 3).length;
    $scope.canceledOrdersCount = orders.filter(o => o.OrderStatus == 4).length;
    
    var driverRatings = orders.filter(o => o.OrderStatus == 3 && o.DriverEvaluationRating).map(o => o.DriverEvaluationRating);
    var deliveryRatings = orders.filter(o => o.OrderStatus == 3 && o.DeliverySpeedRating).map(o => o.DeliverySpeedRating);
    $scope.averageDriverRating = driverRatings.length > 0 ? driverRatings.reduce((accumulator, currentValue) => accumulator + currentValue) / orders.filter(o => o.OrderStatus == 3 && o.DriverEvaluationRating).length : 'N/A';
    $scope.averageDeliveryRating = driverRatings.length > 0 ? deliveryRatings.reduce((accumulator, currentValue) => accumulator + currentValue) / orders.filter(o => o.OrderStatus == 3 && o.DeliverySpeedRating).length : 'N/A';

    $scope.endTrip = function() {
        endTrip.end({tripID: trip.ID}).$promise.then(
            function(response) {
                $state.go('app.trips.allTrips')
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    }
});