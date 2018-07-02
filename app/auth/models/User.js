'use strict';

angular.module('app.auth').factory('User', 
function ($q) {
    var dfd = $q.defer();

    var UserModel = {
        initialized: dfd.promise,
        username: localStorage.getItem('username'),
        picture: 'styles/img/caravan/user/male.png'
    };
    
    dfd.resolve(UserModel);
    return UserModel;
});
