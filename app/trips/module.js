"use strict";

angular.module('app.trips', ['ui.router'])
.config(function ($stateProvider) {
    $stateProvider
        .state('app.trips', {
            abstract: true,
            url: '/trips',
            data: {
                title: 'Trips'
            }
        })
        .state('app.trips.create', {
            url: '/create',
            data: {
                title: 'Create Trip'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/trips/views/createTrip.html',
                    controller: 'CreateTripController',
                    resolve: {
                        drivers: function(AuthService, getListOfDrivers){
                            return getListOfDrivers.query().$promise.then(
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
                        },
                        cars: function(AuthService, getListOfCars){
                            return  getListOfCars.query().$promise.then(
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
                        },
                        cityTree: function(AuthService, getCitiesTree){
                            return  getCitiesTree.query().$promise.then(
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
                        },
                        categoryTree: function(AuthService, getListOfCategories){
                            return  getListOfCategories.query().$promise.then(
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
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.trips.allTrips', {
            url: '/allTrips',
            data: {
                title: 'Trips'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/trips/views/trips.html',
                    controller: 'TripsController',
                    resolve: {
                        trips: function($state, $cookies, $stateParams, AuthService, getTrips){
                            return  getTrips.query().$promise.then(
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
        .state('app.trips.view', {
            url: '/:tripID/view',
            data: {
                title: 'View Trip'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/trips/views/trip.html',
                    controller: 'TripController',
                    resolve: {
                        trip: function($state, $stateParams, getTrip, AuthService){
                            return getTrip.query({ tripID: $stateParams.tripID }).$promise.then(
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
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.trips.edit', {
            url: '/:tripID/edit',
            data: {
                title: 'Edit Trip'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/trips/views/editTrip.html',
                    controller: 'EditTripController',
                    resolve: {
                        trip: function($state, $stateParams, getTrip, AuthService){
                            return getTrip.query({ tripID: $stateParams.tripID }).$promise.then(
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
                        },
                        drivers: function(AuthService, getListOfDrivers){
                            return getListOfDrivers.query().$promise.then(
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
                        },
                        cars: function(AuthService, getListOfCars){
                            return  getListOfCars.query().$promise.then(
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
                        },
                        cityTree: function(AuthService, getCitiesTree){
                            return  getCitiesTree.query().$promise.then(
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
                        },
                        categoryTree: function(AuthService, getListOfCategories){
                            return  getListOfCategories.query().$promise.then(
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
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        });
});