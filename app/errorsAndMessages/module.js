"use strict";


angular.module('app.errorsAndMessages', ['ui.router'])
.config(function ($stateProvider) {

    $stateProvider
        .state('app.errorsAndMessages', {
            url: '/errorsAndMessages',
            data: {
                title: 'Blank'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/errorsAndMessages/views/errorsAndMessages.html',
                    controller: 'ModalInstanceErrorCtrl'
                }
            }
        })
});