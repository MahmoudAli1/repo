"use strict";

angular.module('app.staff', ['ui.router'])
.config(function ($stateProvider) {
    $stateProvider
        .state('app.staff', {
            abstract: true,
            url: '/staff',
            data: {
                title: 'Staff'
            }
        })
        .state('app.staff.allStaff', {
            url: '/allStaff',
            data: {
                title: 'Staff'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/staff/views/allStaff.html',
                    controller: 'StaffController',
                    resolve: {
                        admins: function(AuthService, getListOfAdmins){
                            return  getListOfAdmins.query().$promise.then(
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
                        drivers: function($state, $cookies, $stateParams, AuthService, getListOfDrivers){
                            return  getListOfDrivers.query().$promise.then(
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
        .state('app.staff.edit', {
            url: '/edit',
            params: {
                staff: null
            },
            data: {
                title: 'Edit Staff Member'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/staff/views/editStaff.html',
                    controller: 'EditStaffController',
                    resolve: {
                        staff: function($state, $stateParams){
                            if(!$stateParams.staff) {
                                $state.go('app.staff.allStaff');
                            }
                            return $stateParams.staff;
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
        .state('app.staff.create', {
            url: '/create',
            params: {
                staff: null
            },
            data: {
                title: 'Create Staff Member'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/staff/views/createStaff.html',
                    controller: 'CreateStaffController'
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
});