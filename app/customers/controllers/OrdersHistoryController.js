'use strict';

angular.module('app.customers').controller('OrdersHistoryController', 
function($scope, $state, customerOrders) {
    $scope.tableOptions = {
        "data": customerOrders,
        "iDisplayLength": 25,
        columns: [{
                "class": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {
                data: "CreatedAt",
                render: function(data, type, row) {
                    var formatted_date_time = moment(data).add(3, 'hours').format("DD/MMM/YYYY hh:mm A");
                    return formatted_date_time;
                }
            },
            { 
                data: "CustomerName" 
            },
            {
                data: "TotalPrice",
                render: $.fn.dataTable.render.number(',', '.', 2, 'SAR ')
            },
            {
                data: "OrderStatus"
            },
            {
                data: null,
                render: function(data, type, order) {
                    if (order.DriverEvaluationRating == 0) {
                        return "-";
                    }

                    var stars = '';

                    //full stars
                    var counter;
                    for (counter = 1; counter <= order.DriverEvaluationRating; counter++) {
                        stars = stars + '<i class="fa fa-lg fa-fw fa-star" style="color:#3276B1"></i>';
                    }
                    return stars;
                }
            },
            {
                data: null,
                render: function(data, type, order) {
                    if (order.DeliverySpeedRating == 0) {
                        return "-";
                    }

                    var stars = '';

                    //full stars
                    var counter;
                    for (counter = 1; counter <= order.DeliverySpeedRating; counter++) {
                        stars = stars + '<i class="fa fa-lg fa-fw fa-star" style="color:#3276B1"></i>';
                    }

                    return stars;
                }
            },
            {
                data: "SecondsToArrival",
            },
            {
                data: "SecondsToDelivery"
            }
        ],
        "order": [
            [1, 'desc']
        ]
    }

    $scope.backToAllCustomers = function() {
        $state.go("app.customers.allCustomers");
    };
});