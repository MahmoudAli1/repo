"use strict";

angular.module('app.areas', ['ui.router'])
.config(function ($stateProvider) {
    $stateProvider
    .state('app.areas', {
        abstract: true,
        url: "/areas"
    })
    .state('app.areas.allAreas', {
        url: '/allAreas',
        data: {
            title: 'All Areas'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/allAreas.html',
                controller: 'AreasController',
                resolve: {
                    areasAndUsers: function(AuthService, getAreasAndCustomers) {                    
                        return getAreasAndCustomers.query().$promise.then(
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
        }
    })
    .state('app.areas.createArea', {
        url: '/createArea',
        data: {
            title: 'Create Area'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/createArea.html',
                controller: 'CreateAreaController',
                resolve: {
                    areas: function(AuthService, getAreas) {                  
                        return getAreas.query().$promise.then(
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
                    cities: function(AuthService, getCities) {
                        return getCities.query().$promise.then(
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
        }
    })
    .state('app.areas.createDistrict', {
        url: '/createDistrict',
        data: {
            title: 'Create District'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/createDistrict.html',
                controller: 'CreateDistrictController',
                resolve: {
                    cities: function(AuthService, getCities) {
                        return getCities.query().$promise.then(
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
        }
    })
    .state('app.areas.createCity', {
        url: '/createCity',
        data: {
            title: 'Create City'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/createCity.html',
                controller: 'CreateCityController'
            }
        }
    })
    .state('app.areas.manageAreas', {
        url: '/manageAreas',
        data: {
            title: 'Manage Areas'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/manageAreas.html',
                controller: 'ManageAreasController',
                resolve: {
                    areasAndUsers: function(getAreasAndCustomers) {
                        return getAreasAndCustomers.query().$promise.then(
                            function (response) {
                                return response.Data;
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
    .state('app.areas.editArea', {
        url: '/editArea/:areaId',
        data: {
            title: 'Edit Area'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/editArea.html',
                controller: 'EditAreaController',
                resolve: {
                    area: function($http, $cookies, $stateParams, appSettings, AuthService, getArea) {
                        return getArea.query(
                            {
                                id: $stateParams.areaId
                            }
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
                    },
                    cities: function($http, $cookies, appSettings, AuthService, getCities) {
                        return getCities.query().$promise.then(
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
                    districts: function($http, $cookies, appSettings, AuthService, area, getCityDistricts) {
                        return getCityDistricts.query(
                            {
                                cityId: area.CityID
                            }
                        ).$promise.then(
                            function (response) {
                                return response.Data;
                            }, function (error) {
                                console.error(error);
                                if (error.statusText === 'Unauthorized') {
                                    AuthService.logout();
                                }
                            }
                        );
                    }
                }
            }
        }
    })
    .state('app.areas.manageLocations', {
        url: '/manageLocations',
        data: {
            title: 'Manage Locations'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/manageLocations.html',
                controller: 'ManageLocationsController',
                resolve: {
                    locationsTree: function(getCitiesTree) {
                        return getCitiesTree.query().$promise.then(
                            function (response) {
                                return response.Data;
                            }
                        );
                    }
                }
            }
        },
        resolve: {
            srcipts: function(lazyScript){
                return lazyScript.register([
                    'build/vendor.ui.js'
                ])
            }
        }
    })
    .state('app.areas.editDistrict', {
        url: '/editDistrict/:districtId',
        data: {
            title: 'Edit District'
        },
        views: {
            "content@app": {
                templateUrl: 'app/areas/views/editDistrict.html',
                controller: 'EditDistrictController',
                resolve: {
                    district: function($stateParams, AuthService, getDistrict) {
                        return getDistrict.query(
                            {
                                id: $stateParams.districtId
                            }
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
                    },
                    cities: function(AuthService, getCities) {
                        return getCities.query().$promise.then(
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
        }
    })
});
