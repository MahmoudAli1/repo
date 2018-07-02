'use strict';

angular.module('app.areas').controller('CreateAreaController', 
function ($scope, $state, AuthService, createArea, getCityDistricts, areas, cities, loadGoogleMapsApi) {
    $scope.selectedShape = null;
    var all_overlays = [];

    //populate list of cities to be used in HTML select element
    $scope.listOfCities = cities;
    $scope.listOfCities.unshift({
        ID: -1,
        Name: "--Select a city--"
    });
    $scope.citySelect = { // select in HTML
        availableOptions: $scope.listOfCities,
        selectedOption: {
            ID: $scope.listOfCities[0].ID,
            Name: $scope.listOfCities[0].Name
        }
    };

    //Setting up the map
    window.initMap = function() {
        var greenPinColor = "75FE69";
        var greenPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + greenPinColor,
            null, null, null,new google.maps.Size(14, 24));
        var redPinColor = "FE7569";
        var redPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + redPinColor,
            null, null, null,new google.maps.Size(14, 24));
        var blackPinColor = "aaaaaa";
        var blackPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + blackPinColor,
            null, null, null,new google.maps.Size(14, 24));
        var purplePinColor = "9400D3";
        var purplePinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + purplePinColor,
            null, null, null,new google.maps.Size(14, 24));

        //setup google map
        var map = new google.maps.Map(document.getElementById('map1'), {
            zoom: 11,
            center: {lat: 26.4076942, lng: 50.1352953}
        });

        //drawing areas
        angular.forEach(areas, function (area,index) {
            var areaCoords = [];
            area.Polygon.forEach(function (point) {
                areaCoords.push({lat: point.latitude, lng: point.longitude});
            });
            var colors = ['#2d335b', '#535b2d', '#494949', '#9ad4ce' , '#FF0000' , '#00FF00' , '#0000FF'];
            // Construct the polygon.
            var polygon = new google.maps.Polygon({
                paths: areaCoords,
                strokeColor: colors[index%colors.length],
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: colors[index%colors.length],
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

        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
                ]
            },
            markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
            circleOptions: {
                fillColor: '#ffff00',
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            },
            polygonOptions: {
                editable: true,
                draggable: true
            }
        });

        // used this Listener only for hide undo_poly.png
        google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
            var coordinates = (polygon.getPath().getArray());

            $scope.coordinatesOfPolygons = [];
            coordinates.forEach(function (coord, index) {
                var coordinatesOfOnePolygon = {
                    "longitude": coordinates[index].lng(),
                    "latitude": coordinates[index].lat(),
                    "address": null
                };
                $scope.coordinatesOfPolygons.push(coordinatesOfOnePolygon);
            });

            google.maps.event.addListener(polygon.getPath(), 'set_at', function (pol) {
                $('img[src$="undo_poly.png"]').parent().hide();
            });

            google.maps.event.addListener(polygon.getPath(), 'insert_at', function (pol) {
                $('img[src$="undo_poly.png"]').parent().hide();
            });
            drawingManager.setMap(null);
        });

        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
            all_overlays.push(e);
            if (e.type != google.maps.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                drawingManager.setDrawingMode(null);
                // Add an event listener that selects the newly-drawn shape when the user
                // mouses down on it.
                var newShape = e.overlay;
                newShape.type = e.type;
                google.maps.event.addListener(newShape, 'click', function () {
                    setSelection(newShape);
                });
                setSelection(newShape);
                }
            });

        function setSelection(shape) {
            clearSelection();
            $scope.selectedShape = shape;
            shape.setEditable(true);
        }

        function clearSelection() {
            if ($scope.selectedShape) {
                $scope.selectedShape.setEditable(false);
                $scope.selectedShape = null;
            }
        }

        function deleteSelectedShape() {
            if ($scope.selectedShape) {
                $scope.selectedShape.setMap(null);
                drawingManager.setMap(map);
                $scope.selectedShape = null;
                $scope.coordinatesOfPolygons = null;
            }
        }
        drawingManager.setMap(map);
        google.maps.event.addDomListener(document.getElementById('deleteShapeButton'), 'click', deleteSelectedShape);
    };

    loadGoogleMapsApi();

    $scope.getCityDistricts = function() {//getCityDistricts
        if($scope.citySelect.selectedOption.ID !== -1) {
            getCityDistricts.query(
                {
                    cityId: $scope.citySelect.selectedOption.ID
                }
            ).$promise.then(
                function (response) {
                    $scope.listOfDistricts = response.Data;
                    $scope.listOfDistricts.unshift({
                        ID: -1,
                        EnglishName: "--Select a district--"
                    });
                    $scope.districtSelect = {
                        availableOptions: $scope.listOfDistricts,
                        selectedOption: {
                            ID: $scope.listOfDistricts[0].ID,
                            EnglishName: $scope.listOfDistricts[0].EnglishName
                        }
                    };
                },
                function (error) {
                    var errorMessage = error.data.errorMessage;
                    if (error.statusText === 'Unauthorized') {
                        AuthService.logout();
                    }
                    //when coming error from the server with text 'Unauthorized' - will displaying message
                    if (error.statusText === 'Bad Request') {
                        $scope.brandItemSelect = null;
                    }
                }
            )
        } else {
            //Reset districts select values
            $scope.districtSelect.availableOptions = null;
        }
    }

    $scope.area = {};
    $scope.isAreaCreated = false;
    $scope.createArea = function () {
        var polygonString = '';
        $scope.coordinatesOfPolygons.forEach(c => polygonString += c.longitude + ' ' + c.latitude + ', ');
        polygonString = polygonString + $scope.coordinatesOfPolygons[0].longitude + ' ' + $scope.coordinatesOfPolygons[0].latitude;

        var dataOfArea = {
                name: $scope.area.name,
                districtID: $scope.districtSelect.selectedOption.ID,
                addedBalance: $scope.area.addedBalance,
                polygon: polygonString
            };
        createArea.create({}, dataOfArea).$promise.then(function (response) {
                $scope.isAreaCreated = true;
                $state.reload();
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    };
});