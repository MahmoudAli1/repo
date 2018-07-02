'use strict';

angular.module('app.areas').factory('loadGoogleMapsApi', function() {
	
	return function() {
		//var maps_key = 'AIzaSyAV5oaxqWphsZaPwcOV5nqmbLk9fhivWl0';
		var maps_key =  'AIzaSyCX53eYMwgc_77gGm_b_DyXmqxCvZpYiu4'; //Key For local environement

		// var maps_key = 'AIzaSyCJH7AQ9dOKuY_TK_SF5t8kZDNTdUCS1-Q'; key for rami's account

	    if ($('#googleApiScriptContainer').length === 0) {
	    	var s = document.createElement('script');
	    	var container = document.createElement('div');

	        // add googleAPI scripts to DOM
	        container.id = 'googleApiScriptContainer';
	        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + maps_key + '&callback=initMap&libraries=drawing';
	        container.appendChild(s);
	        $('body').append(container);
	    } else {
	        setTimeout(window.initMap, 1);
	    }
	}

});