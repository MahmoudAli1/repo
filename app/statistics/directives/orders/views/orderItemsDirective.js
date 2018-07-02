'use strict';

angular.module('app.statistics').directive('orderItems', function (getOrderItems) {
    return {
        restrict: 'E',
        scope: {
            orderId: "="
        },
        templateUrl: "app/statistics/directives/orders/views/orderItems.html",
        link: function (scope) {
            if(scope.orderId)
            {
                getOrderItems.query(
                    {
                        id: scope.orderId
                    }
                ).$promise.then(
                    function (response) {
                        scope.items = response.Data.OrderItems;
                    },
                    function (error) {
                        console.error(error);
                        if (error.statusText === 'Unauthorized') {
                            AuthService.logout();
                        }
                    }
                );
            }
        }        
    }
});