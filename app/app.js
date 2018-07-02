'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular.module('app', [
        'ngSanitize',
        'ngAnimate',
        'restangular',
        'ui.router',
        'ui.bootstrap',
        'caravanServices',
        'ngResource',
        'ngCookies',
        'ngFileUpload',
        'ngImgCrop',

        // Smartadmin Angular Common Module
        'SmartAdmin',

        // App
        'app.auth',
        'app.layout',
        'app.errorsAndMessages',
        'app.chat',
        'app.dashboard',
        'app.calendar',
        'app.inbox',
        'app.graphs',
        'app.tables',
        'app.forms',
        'app.ui',
        'app.widgets',
        'app.maps',
        'app.appViews',
        'app.misc',
        'app.smartAdmin',
        'app.eCommerce',
        'app.home',
        'app.statistics',
        'app.areas',
        'app.customers',
        'app.cars',
        'app.staff',
        'app.inventory',
        'app.campaigns',
        'app.settings',
        'app.trips'
    ])
    .value("appSettings", {
        //link: 'http://api.staging.caravanapp.io/app_dev.php', //this is for staging
        link: 'http://52.210.60.172/api/',
        clientId: '1_2w8e9tn65xwkogww0g8kc0skwssgo0s0ck8g8gsckwkcs84go0',
        clientSecret: '5rb2ofez1p8gkscgkcccs0oo80c80k0g0ck0c48gs40s0gs08o',
        googleMapsKey: 'AIzaSyAV5oaxqWphsZaPwcOV5nqmbLk9fhivWl0'
    })
    .config(function($provide, $httpProvider, RestangularProvider) {

        RestangularProvider.setBaseUrl(location.pathname.replace(/[^\/]+?$/, ''));

    })
    .constant('APP_CONFIG', window.appConfig)

.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    // editableOptions.theme = 'bs3';

});