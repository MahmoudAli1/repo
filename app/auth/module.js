"use strict";

angular.module('app.auth', ['ui.router']).config(function ($stateProvider) {
    $stateProvider.state('realLogin', {
        url: '/real-login',
        views: {
            root: {
                templateUrl: "app/auth/login/login.html",
                controller: 'LoginMainController'
            }
        },
        data: {
            title: 'Login',
            rootId: 'extra-page'
        }
    })
    .state('login', {
        url: '/login',
        views: {
            root: {
                templateUrl: 'app/auth/views/login.html',
                controller: 'LoginMainController'
            }
        },
        data: {
            title: 'Login',
            htmlId: 'extr-page'
        },
        resolve: {
            scripts: function(lazyScript){
                return lazyScript.register(['build/vendor.ui.js'])
            }
        }
    })

    .state('register', {
        url: '/register',
        views: {
            root: {
                templateUrl: 'app/auth/views/register.html'
            }
        },
        data: {
            title: 'Register',
            htmlId: 'extr-page'
        }
    })
    .state('lock', {
        url: '/lock',
        views: {
            root: {
                templateUrl: 'app/auth/views/lock.html'
            }
        },
        data: {
            title: 'Locked Screen',
            htmlId: 'lock-page'
        }
    })
}).constant('authKeys', {
    googleClientId: '',
    facebookAppId: ''
});
