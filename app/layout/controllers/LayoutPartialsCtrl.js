'use strict';

angular.module('app.layout').controller('LayoutPartialsController', function ($scope, AuthService) {


	$scope.logout = function(){
		AuthService.logout();
	};

});