'use strict';

angular.module('app.inventory').controller('CreateSubcategoryBranchController', 
function ($scope, $state, AuthService, createBranch, categories, loadGoogleMapsApi) {
    //Setting up the map
    window.initMap = function() {
        //setup google map
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: new google.maps.LatLng(26.407255, 50.064252),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var myMarker = new google.maps.Marker({
            position: new google.maps.LatLng(26.407255, 50.064252),
            draggable: true
        });

        google.maps.event.addListener(myMarker, 'dragend', function(evt){
            console.log('Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3));
            $scope.Latitude = evt.latLng.lat();
            $scope.Longitude = evt.latLng.lng();
        });

        map.setCenter(myMarker.position);
        myMarker.setMap(map);
    };
    // After calling this method, window.init will be called as a callback function.
    loadGoogleMapsApi();

    //Preparing html select for categories
    $scope.listOfCategories = categories;
    $scope.listOfCategories.unshift({
        ID: -1,
        EnglishName: "--Select a category--"
    });
    $scope.categorySelect = {
        availableOptions: $scope.listOfCategories,
        selectedOption: {
            ID: $scope.listOfCategories[0].ID,
            EnglishName: $scope.listOfCategories[0].EnglishName
        }
    }

    $scope.getSubcategories = function() {
        if($scope.categorySelect.selectedOption.ID !== -1) {
            for (var i = $scope.listOfCategories.length - 1; i >= 0; i--) {
                if($scope.listOfCategories[i].ID == $scope.categorySelect.selectedOption.ID) {
                    if($scope.listOfCategories[i].Subcategories.length > 0) {
                        $scope.listOfSubcategories = angular.copy($scope.listOfCategories[i].Subcategories);
                        $scope.listOfSubcategories.unshift({
                            ID: -1,
                            EnglishName: "--Select a subcategory--"
                        });
                        $scope.subcategorySelect = {
                            availableOptions: $scope.listOfSubcategories,
                            selectedOption: {
                                ID: $scope.listOfSubcategories[0].ID,
                                EnglishName: $scope.listOfSubcategories[0].EnglishName
                            }
                        }
                    } else {
                        $scope.subcategorySelect.availableOptions = null;
                    }
                    break;
                }
            }
        } else {
            $scope.subcategorySelect.availableOptions = null;
        }
    }

	$scope.createBranch = function() {
        var branch = {
            name: $scope.branch.Name,
            longitude: $scope.Longitude,
            latitude: $scope.Latitude ,
            phoneNumber: $scope.branch.PhoneNumber,
            categoryID: $scope.subcategorySelect.selectedOption.ID
        };

        createBranch.create({}, branch).$promise.then(
            function (response) {
                $state.go('app.inventory.branches', {'subCategory': $scope.subcategorySelect.selectedOption.ID});
            },
            function (error) {
                console.error(error);
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
	};
});