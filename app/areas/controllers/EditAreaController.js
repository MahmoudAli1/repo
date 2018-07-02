'use strict';

angular.module('app.areas').controller('EditAreaController', 
function ($scope, $state, $stateParams, area, cities, districts, AuthService, getCityDistricts, editArea, loadGoogleMapsApi) {

    $scope.areaForEdit = area;
    $scope.selectedShape = null; 
    var all_overlays = [];

    //populate list of cities to be used in HTML select element
    $scope.listOfCities = cities;
    $scope.citySelect = { // select in HTML
        availableOptions: $scope.listOfCities,
        selectedOption: {
            ID: $scope.areaForEdit.CityID
        }
    };

    $scope.listOfDistricts = districts;
    $scope.districtSelect = {
        availableOptions: $scope.listOfDistricts,
        selectedOption: {
            ID: $scope.areaForEdit.DistrictID
        }
    };

    //Setting up the map
    window.initMap = function() {

        //setup google map
        var map = new google.maps.Map(document.getElementById('map2'), {
            zoom: 11,
            center: {lat: 26.4076942, lng: 50.1352953}
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

        var areaCoords = [];
        $scope.areaForEdit.Polygon.forEach(function (point) {
            areaCoords.push({lat: point.latitude, lng: point.longitude});
        });

        // Construct the polygon.
        var polygon = new google.maps.Polygon({
            paths: areaCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: false,
            draggable: false
        });

        $scope.polygon = polygon;

        polygon.setMap(map);

        // code for center of poligon
        var latlngbounds = new google.maps.LatLngBounds();
        var polygonCoordinates = polygon.getPath().getArray();

        for (var i = 0; i < polygonCoordinates.length; i++) {
            latlngbounds.extend(polygonCoordinates[i]);
        }
        map.fitBounds(latlngbounds);
        map.panToBounds(latlngbounds);

        google.maps.event.addListener(polygon, 'click', function () {
            clearSelection();
            $scope.selectedShape = this;
            this.setEditable(true);
        });

        $scope.showArrays = function (event) {
            var totalCoords = [];
            var vertices = polygon.getPath();
            for (var i = 0; i < vertices.getLength(); i++) {
                var xy = vertices.getAt(i);

                totalCoords.push({
                    latitude: xy.lat(),
                    long: xy.lng()
                });
            }
            $('img[src$="undo_poly.png"]').parent().hide();
        };
        google.maps.event.addListener(polygon.getPath(), 'set_at', $scope.showArrays);
        google.maps.event.addListener(polygon.getPath(), 'insert_at', $scope.showArrays);
        google.maps.event.addListener(polygon.getPath(), 'remove_at', $scope.showArrays);

        //Setting coordinates for polygon in case there is no change in the area size
        $scope.coordinatesOfPolygons = $scope.areaForEdit.coordinates;
        // used this Listener only for hide undo_poly.png
        google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
            $scope.polygon = polygon;

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
                $scope.polygon = null;
                $scope.selectedShape = null; 
                $scope.coordinatesOfPolygons = null;
            }
        }
        drawingManager.setMap(map);
        google.maps.event.addDomListener(document.getElementById('deleteShapeButton'), 'click', deleteSelectedShape);

        $scope.polygon = polygon;
    };

    $scope.setCoordinates = function() {
        console.log('setCoordinates called');
    }

    loadGoogleMapsApi();


    $scope.getCityDistricts = function() {//getCityDistricts
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

    }

    $scope.updateCoordinates = function() {
        var coordinates = $scope.polygon.getPath().getArray();   
        $scope.polygonString = '';
        coordinates.forEach(point => $scope.polygonString += point.lng() + ' ' + point.lat() + ', ');
        $scope.polygonString += $scope.polygonString + coordinates[0].lng() + ' ' + coordinates[0].lat();
    }

    $scope.isAreaEdifted = false;
    $scope.saveChangedArea = function () {
        $scope.updateCoordinates();

        var editedArea = {
            "name": $scope.areaForEdit.Name,
            "districtID": $scope.districtSelect.selectedOption.ID,
            "addedBalance": $scope.areaForEdit.AddedBalance,
            "polygon": $scope.polygonString
        };

        editArea.update(
            {
                id: $stateParams.areaId
            },
            editedArea
        ).$promise.then(
            function (data) {
                $scope.isAreaEdited = true;
                $state.go('app.areas.manageAreas');
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    }
});