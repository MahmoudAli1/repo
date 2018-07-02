"use strict";
angular.module('app.statistics', ['ui.router'])
.config(function ($stateProvider) {

    $stateProvider
    .state('app.statistics', {
        abstract: true,
        url: "/statistics"
    })
    .state('app.statistics.dashboard', {
        url: '/dashboard',
        data: {
            title: 'Statistics'
        },
        views: {
            "content@app": {
                templateUrl: 'app/statistics/views/statistics.html',
                controller: 'StatisticsController'
            }
        }
    })
    .state('app.statistics.orders', {
        url: '/orders',
        data: {
            title: 'Orders'
        },
        views: {
            "content@app": {
                templateUrl: 'app/statistics/views/orders-list.html',
                controller: 'ordersListController',
                    resolve: {
                        orders: function($http, $cookies, $stateParams, $rootScope, appSettings, AuthService, getOrders){


                            var orders = getOrders.query().$promise.then(
                                function (response) {
                                    return response;
                                },
                                function (error) {
                                    console.error(error);
                                    if (error.statusText === 'Unauthorized') {
                                        AuthService.logout();
                                    }
                                }
                            );
                            
                            $stateParams.orders = orders;
                            return orders;
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
    .state('app.statistics.items', {
        url: '/items',
        data: {
            title: 'Items'
        },
        views: {
            "content@app": {
                templateUrl: 'app/statistics/views/items.html',
                controller: 'ItemsListController',
                resolve: {
                    items: function($http, $cookies, appSettings, AuthService, getItemStatistics){
                        return getItemStatistics.query().$promise.then(
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