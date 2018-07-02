"use strict";

angular.module('app.customers', ['ui.router'])
.config(function ($stateProvider) {
    $stateProvider
    .state('app.customers', {
        abstract: true,
        url: '/customers'
    })
    .state('app.customers.allCustomers', {
        url: '/allCustomers',
        data: {
            title: 'Customers'
        },
        views: {
            "content@app": {
                templateUrl: 'app/customers/views/customers.html',
                controller: 'CustomersController',
                resolve: {
                    customers: function(AuthService, getCustomers){
                        return getCustomers.query().$promise.then(
                            function (response) {
                                return response.Data;
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
        }, 
        resolve: {
            scripts: function(lazyScript){
                return lazyScript.register(['build/vendor.datatables.js']);
            }
        }
    })
    .state('app.customers.ordersHistory', {
        url: '/customerOrders/:customerId',
        date: {
            title: 'Orders History'
        },
        views: {
            "content@app": {
                templateUrl: 'app/customers/views/ordersHistory.html',
                controller: "OrdersHistoryController",
                resolve: {
                    customerOrders: function($stateParams, AuthService, getCustomerOrders){
                        return getCustomerOrders.query({
                            customerId: $stateParams.customerId}
                        ).$promise.then(
                            function (response) {
                                return response.Data;
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
        }, 
        resolve: {
            scripts: function(lazyScript){
                return lazyScript.register([
                        'build/vendor.datatables.js'
                ]);
            }
        }
    })
});
