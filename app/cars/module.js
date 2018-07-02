"use strict";

angular.module('app.cars', ['ui.router'])
.config(function ($stateProvider) {
    $stateProvider
        .state('app.cars',{
            abstract: true,
            url: '/cars',
            data: {
                title: "Cars"
            }
        })
        .state('app.cars.allCars', {
            url: '/cars',
            data: {
                title: 'All Cars'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/cars/views/cars.html',
                    controller: 'CarsController',
                    resolve: {
                        cars: function(AuthService, getListOfCars){
                            return getListOfCars.query().$promise.then(
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
        .state('app.cars.edit', {
            url: '/edit',
            params: {
                car: null
            },
            data: {
                title: 'Edit Car'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/cars/views/editCar.html',
                    controller: 'EditCarController',
                    resolve: {
                        car: function($state, $stateParams){
                            if(!$stateParams.car) {
                                $state.go('app.cars.allCars');
                            }
                            return $stateParams.car;
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
        .state('app.cars.create', {
            url: '/create',
            data: {
                title: 'Create Car'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/cars/views/createCar.html',
                    controller: 'CreateCarController'
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
});
