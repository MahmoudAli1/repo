'use strict';

angular.module('app.campaigns').controller('CreateCampaignController', function ($scope, $state, $window, $cookies, AuthService, getCityDistricts, createCampaign, cities) {
	//initializing dates
    $(function() {
        //Assigning datepicker to specefied element and handleing date change funciton
	    $('#datepicker_campaign').daterangepicker({
	        minDate: moment()
	    }, function(start, end) {
	        $('#datepicker_campaign span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            
            //get a hold of controller and scope
             var element = angular.element($('#datepicker_campaign'));
             var controller = element.controller();
             var scope = element.scope();

            $scope.$apply(function(){
                scope.startDate = start.format('YYYY-MM-DD');
                scope.startTime = start.format('HH:mm');
                scope.endDate = end.format('YYYY-MM-DD');
                scope.endTime = end.format('HH:mm');

                $("[name=startTime]").val(scope.startTime);
                $("[name=endTime]").val(scope.endTime);
            });
	    });
    });

	//populate list of cities to be used in HTML select element
    $scope.listOfCities = cities;
    $scope.listOfCities.unshift({
        ID: 0,
        Name: "--Select a city--"
    });
    $scope.citySelect = { // select in HTML
        availableOptions: $scope.listOfCities,
        selectedOption: {
            ID: $scope.listOfCities[0].ID,
            Name: $scope.listOfCities[0].Name
        }
    };

    $scope.getCityDistricts = function() {//getCityDistricts
        if($scope.citySelect.selectedOption.id !== -1) {
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

    $scope.isCampaignCreated = false;
    $scope.createCampaign = function() {
    	var dataOfCampaign = {
    		startDate: $scope.startDate,
    		endDate: $scope.endDate,
    		districtID: $scope.districtSelect.selectedOption.ID,
    		addedBalance: $scope.addedBalance
    	};

        createCampaign.create({},
            dataOfCampaign
        ).$promise.then(
            function (response) {
                $scope.isCampaignCreated = true;
                $state.reload();
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    }
});