'use strict';

angular.module('app.inventory').controller('EditBranchController', 
function ($scope, $state, $stateParams, AuthService, updateBranch, branch, loadGoogleMapsApi) {
    $scope.branch = branch;
    
    //Setting up the map
    window.initMap = function() {
        //setup google map
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: new google.maps.LatLng($scope.branch.Latitude, $scope.branch.Longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var myMarker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.branch.Latitude, $scope.branch.Longitude),
            draggable: true
        });

        google.maps.event.addListener(myMarker, 'dragend', function(evt){
            $scope.branch.Latitude = evt.latLng.lat();
            $scope.branch.Longitude = evt.latLng.lng();
        });

        map.setCenter(myMarker.position);
        myMarker.setMap(map);
    };

    // After calling this method, window.init will be called as a callback function.
    loadGoogleMapsApi();

	$scope.updateBranch = function () {
		updateBranch.update(
            {
                branch: $scope.branch.ID
            },
            {
                "name": $scope.branch.Name,
                "longitude": $scope.branch.Longitude,
                "latitude": $scope.branch.Latitude,
                "phoneNumber": $scope.branch.PhoneNumber
            }
        ).$promise.then(
            function (response) {
                $state.go("app.inventory.branches", {'subCategory': $stateParams.subCategoryId});
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    };
});