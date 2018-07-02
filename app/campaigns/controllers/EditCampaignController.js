'use strict';

angular.module('app.campaigns').controller('EditCampaignController', function ($scope, $state, $cookies, AuthService, getCityDistricts, editCampaign, campaign, cities, districts) {
    $scope.campaignToEdit = campaign;
    
	//initializing dates
	if(campaign.IsActive && moment().isBetween(moment(campaign.StartDate).startOf('day'), moment(campaign.EndDate).endOf('day'))) {
		//display dates of campaign
		$('#datepicker_campaign span').html(moment(campaign.endDate).format('MMMM D, YYYY'));
		//Assigning datepicker to specefied element and handleing date change funciton
	    $('#datepicker_campaign').daterangepicker({
	    	startDate: moment(campaign.EndDate),
	    	singleDatePicker: true,
	        minDate: moment()

	    }, function(start, end) {
	        $('#datepicker_campaign span').html(start.format('MMMM D, YYYY'));
            //get a hold of controller and scope
            var element = angular.element($('#datepicker_campaign'));
            var controller = element.controller();
            var scope = element.scope();

            $scope.$apply(function(){
                scope.campaignToEdit.EndDate = start.format('YYYY-MM-DD');
            });
	    });
	} else {
		//display dates of campaign
		$('#datepicker_campaign span').html(moment(campaign.StartDate).format('MMMM D, YYYY') + ' - ' + moment(campaign.EndDate).format('MMMM D, YYYY'));
		//Assigning datepicker to specefied element and handleing date change funciton
	    $('#datepicker_campaign').daterangepicker({
	    	startDate: moment(campaign.StartDate),
	    	endDate: moment(campaign.EndDate),
	    	minDate: moment()

	    }, function(start, end) {
	        $('#datepicker_campaign span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            
            //get a hold of controller and scope
             var element = angular.element($('#datepicker_campaign'));
             var controller = element.controller();
             var scope = element.scope();

            $scope.$apply(function(){
                scope.campaignToEdit.StartDate = start.format('YYYY-MM-DD');
                scope.campaignToEdit.EndDate = end.format('YYYY-MM-DD');
            });
	    });
	}  

	//populate list of cities to be used in HTML select element
    $scope.listOfCities = cities;
    $scope.listOfCities.unshift({
        ID: -1,
        Name: "--Select a city--"
    });
    $scope.citySelect = { // select in HTML
        availableOptions: $scope.listOfCities,
        selectedOption: {
            ID: $scope.campaignToEdit.District.CityID
        }
    };

    $scope.listOfDistricts = districts;
    $scope.listOfDistricts.unshift({
        ID: -1,
        EnglishName: "--Select a district--"
    });
    $scope.districtSelect = {
        availableOptions: $scope.listOfDistricts,
        selectedOption: {
            ID: $scope.campaignToEdit.DistrictID
        }
    };

    $scope.getCityDistricts = function() {//getCityDistricts
        if($scope.citySelect.selectedOption.id !== -1) {
            getCityDistricts.query(
                {
                    cityId: $scope.citySelect.selectedOption.ID
                }
            ).$promise.then(
                function (data) {
                    $scope.listOfDistricts = data;
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

    $scope.isCampaignEdited = false;
    $scope.editCampaign = function() {
    	var dataOfCampaign = {
    		startDate: $scope.campaignToEdit.StartDate,
    		endDate: $scope.campaignToEdit.EndDate,
    		districtID: $scope.districtSelect.selectedOption.ID,
    		addedBalance: $scope.campaignToEdit.AddedBalance
    	};

        editCampaign.update(
            {
                campaignId: $scope.campaignToEdit.ID
            },
            dataOfCampaign
        ).$promise.then(
            function (response) {
                $scope.isCampaignEdited = true;
                $state.go('app.campaigns.manageCampaigns');
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    }
});