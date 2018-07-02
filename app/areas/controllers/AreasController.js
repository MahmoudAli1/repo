'use strict';

angular.module('app.areas').controller('AreasController', 
function($scope, areasAndUsers, loadGoogleMapsApi) {
    var map;
    var known_in_markers = [];
    var known_out_markers = [];
    var known_dead_markers = [];
    var known_uninstalled = [];
    var unknown_in_markers = [];
    var unknown_out_markers = [];
    var unknown_dead_markers = [];
    var unknown_uninstalled = [];

    //Setting up the map
    window.initMap = function() {
        var known_in = 'styles/img/caravan/map/known_in.png';
        var known_out = 'styles/img/caravan/map/known_out.png';
        var known_dead = 'styles/img/caravan/map/known_dead.png';
        var unknown_in = 'styles/img/caravan/map/unknown_in.png';
        var unknown_out = 'styles/img/caravan/map/unknown_out.png';
        var unknown_dead = 'styles/img/caravan/map/unknown_dead.png';
        var unknown_uninstall_icon = 'styles/img/caravan/map/uninstall_unknown.png';
        var known_uninstall_icon = 'styles/img/caravan/map/uninstall_known.png';

        //setup google map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: { lat: 26.272882, lng: 50.101248 }
        });

        //drawing areas
        angular.forEach(areasAndUsers.areas, function(area, index) {
            var areaCoords = [];
            area.Polygon.forEach(function(point) {
                areaCoords.push({ lat: point.latitude, lng: point.longitude });
            });
            var colors = ['#2d335b', '#535b2d', '#494949', '#9ad4ce', '#FF0000', '#00FF00', '#0000FF'];
            // Construct the polygon.
            var polygon = new google.maps.Polygon({
                paths: areaCoords,
                strokeColor: colors[index % colors.length],
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: colors[index % colors.length],
                fillOpacity: 0.35,
                editable: false,
                draggable: false
            });

            polygon.setMap(map);

            var latlngbounds = new google.maps.LatLngBounds();
            var polygonCoordinates = polygon.getPath().getArray();

            for (var i = 0; i < polygonCoordinates.length; i++) {
                latlngbounds.extend(polygonCoordinates[i]);
            }
        });

        //add markers to map
        angular.forEach(areasAndUsers.customers, function(customer, index) {
            var loc = { lat: parseFloat(customer.Coordinates.latitude), lng: parseFloat(customer.Coordinates.longitude) };
            var marker;

            //check if user did not connect for more than 3 days
            var isDead;
            var uninstalled = customer.UninstalledAt;
            var userTime = customer.LastInArea;
            var openTime = customer.UpdatedAt;
            var threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            var regDate = Date(Date.parse(customer.CreatedAt));
            var freshInstall = (regDate > threeDaysAgo);

            isDead = false;
            if (!userTime && !freshInstall) {
                isDead = true;
            } else {
                var lastInArea = new Date(Date.parse(userTime));
                var lastOpen = new Date(Date.parse(openTime));

                if (lastInArea < threeDaysAgo) isDead = true;
                if (lastOpen > threeDaysAgo) isDead = false;
            }

            if (customer.Name) { //known
                if (typeof uninstalled != 'undefined' && uninstalled) {
                    marker = $scope.createMarker(loc, known_uninstall_icon);
                    known_uninstalled.push(marker);
                } else if (customer.IsLocationAllowed == 1 && !isDead) {
                    if (customer.IsInArea == 1) {
                        marker = $scope.createMarker(loc, known_in);
                        known_in_markers.push(marker);
                    } else {
                        marker = $scope.createMarker(loc, known_out);
                        known_out_markers.push(marker);
                    }
                } else {
                    marker = $scope.createMarker(loc, known_dead);
                    known_dead_markers.push(marker);
                }
            } else { //unknown
                if (typeof uninstalled != 'undefined' && uninstalled) {
                    marker = $scope.createMarker(loc, unknown_uninstall_icon);
                    unknown_uninstalled.push(marker);
                } else if (customer.IsLocationAllowed == 1 && !isDead) {
                    if (customer.IsInArea == 1) {
                        marker = $scope.createMarker(loc, unknown_in);
                        unknown_in_markers.push(marker);
                    } else {
                        marker = $scope.createMarker(loc, unknown_out);
                        unknown_out_markers.push(marker);
                    }
                } else {
                    marker = $scope.createMarker(loc, unknown_dead);
                    unknown_dead_markers.push(marker);
                }
            }

            var infoWindow = new google.maps.InfoWindow({
                content: customer.PhoneNumber
            });

            marker.addListener('click', () => infoWindow.open(map, marker));
            marker.setMap(map);
        });
    };

    loadGoogleMapsApi();

    $scope.createMarker = function(location, pinIcon) {
        return new google.maps.Marker({
            position: location,
            icon: pinIcon
        });
    };

    $scope.toggle_known_in = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(known_in_markers);
        } else {
            $scope.hideMarkers(known_in_markers);
        }
    };

    $scope.toggle_known_out = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(known_out_markers);
        } else {
            $scope.hideMarkers(known_out_markers);
        }
    };

    $scope.toggle_known_dead = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(known_dead_markers);
        } else {
            $scope.hideMarkers(known_dead_markers);
        }
    };
    //toggle the unistall filter
    $scope.toggle_known_uninstalled = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(known_dead_markers);
        } else {
            $scope.hideMarkers(known_dead_markers);
        }
    };

    $scope.toggle_unknown_in = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(unknown_in_markers);
        } else {
            $scope.hideMarkers(unknown_in_markers);
        }
    };

    $scope.toggle_unknown_out = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(unknown_out_markers);
        } else {
            $scope.hideMarkers(unknown_out_markers);
        }
    };

    $scope.toggle_unknown_dead = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(unknown_dead_markers);
        } else {
            $scope.hideMarkers(unknown_dead_markers);
        }
    };
    //toggle the unistall known filter
    $scope.toggle_known_uninstalled = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(known_uninstalled);
        } else {
            $scope.hideMarkers(known_uninstalled);
        }
    };

    //toggle the unistall unknown filter
    $scope.toggle_unknown_uninstalled = function($event) {
        if ($event.currentTarget.checked) {
            $scope.showMarkers(unknown_uninstalled);
        } else {
            $scope.hideMarkers(unknown_uninstalled);
        }
    };

    $scope.hideMarkers = function(markers) {
        angular.forEach(markers, function(marker) {
            marker.setMap(null);
        });
    };

    $scope.showMarkers = function(markers) {
        angular.forEach(markers, function(marker) {
            marker.setMap(map);
        });
    };
});