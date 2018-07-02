'use strict';

angular.module('app').factory('AuthService', 
function($state, $cookies) {
	return {
		//Will be used for access control based on user role
		isAuthenticated: function isAuthenticated() {
			return !!$cookies.get('accessToken');
		},

		//Will be used for access control based on user role
		isAuthorized: function isAuthorized(authorizedRoles) {
			if(!angular.isArray(authorizedRoles)){
				authorizedRoles = [authorizedRoles];
			}

			return (this.isAuthenticated && authorizedRoles.indexOf(localStorage.getItem('userRoles')[0] !== -1));
		},

		logout: function logout() {
			$cookies.remove('accessToken');
			localStorage.removeItem('username');
			localStorage.removeItem('userRoles');
			$state.go('login');
		}
	};
});