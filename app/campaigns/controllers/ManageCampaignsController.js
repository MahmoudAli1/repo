'use strict';

angular.module('app.campaigns').controller('ManageCampaignsController', function (
	$scope,
	$state,
	$cookies, 
	AuthService, 
	activateCampaign, 
	deactivateCampaign, 
	getCampaign,
	getCities,
	getCityDistricts,
	campaigns) {

	if(campaigns.length === 0) {
		$scope.noCampaignsFetched = true;
	}

	$scope.campaigns = {
		active: [],
		scheduled: [],
		finished: [],
		diactivated: []
	};

	angular.forEach(campaigns, function(campaign) {
		if(campaign.IsActive) {
			//Active campaigns
			if(moment().isBetween(moment(campaign.StartDate).startOf('day'), moment(campaign.EndDate).endOf('day'), null, '[]')) {				
				//Active
				$scope.campaigns.active.push(campaign);
			} else if(moment().startOf('day').isBefore(campaign.StartDate)) {
				//scheduled
				$scope.campaigns.scheduled.push(campaign);
			} else {
				//finished
				$scope.campaigns.finished.push(campaign);
			}
		} else {
			//deactivated
			$scope.campaigns.diactivated.push(campaign);
		}
	});

	//initializing dates
    $(function() {	    
        //Assigning datepicker to specefied element and handleing date change funciton
	    $('#datepicker_campaignsFilter').daterangepicker({}, function(start, end) {
	        $('#datepicker_campaignsFilter span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            
            //get a hold of controller and scope
             var element = angular.element($('#datepicker_campaignsFilter'));
             var controller = element.controller();
             var scope = element.scope();

            $scope.$apply(function(){
                scope.startDate = start.format('YYYY-MM-DD');
                scope.endDate = end.format('YYYY-MM-DD');
            });
	    });
    });

    $scope.getCities = function() {
    	if(!$scope.listOfCities) {
	    	getCities.query().$promise.then(
	            function (data) {
	            	//populate list of cities to be used in HTML select element
	                $scope.listOfCities = data;
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
	            },
	            function (error) {
	                console.error(error);
	                if (error.statusText === 'Unauthorized') {
	                    AuthService.logout();
	                }
	            }
	        );
    	}
    }

    $scope.getCityDistricts = function() {
        if($scope.citySelect.selectedOption.ID !== -1) {
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

    //populate list of status to be used in HTML select element
    $scope.listOfStatus = [
        {
            id: -1 ,
            name: "All"
        }, 
        {
            id: 1,
            name: "Active"
        }, 
        {
            id: 2,
            name: "Scheduled"
        }, 
        {
            id: 3,
            name: "Finished"
        },  
        {
            id: 4,
            name: "Deactivated"
        }, 
    ];
    $scope.statusSelect = { // select in HTML
        availableOptions: $scope.listOfStatus,
        selectedOption: {
            id: $scope.listOfStatus[0].id,
            name: $scope.listOfStatus[0].name
        }
    };


	$scope.displayCampaignDetails = function(campaignId) {
		console.log('Display campaign Id= ', campaignId);
	}

	$scope.editCampaign = function(campaignId) {
    	$state.go('app.campaigns.editCampaign', {campaignId: campaignId});
	}

	$scope.deactivateCampaign = function(campaignId) {
		deactivateCampaign.update(
	        {
	            id: campaignId
	        }
	        ).$promise.then(
	        function (response) {
	            $state.reload();
	        },
	        function (error) {
	            console.error(error);

	            if (error.statusText === 'Unauthorized') {
	                AuthService.logout();
	            }
	            else if (error.statusText === 'Not Found') {

	            }
	        }
        );
	}

	$scope.activateCampaign = function(campaignId) {
		activateCampaign.update(
	        {
	            id: campaignId
	        }
	        ).$promise.then(
	        function (response) {
	            $state.reload();
	        },
	        function (error) {
	            console.error(error);
	            if (error.statusText === 'Unauthorized') {
	                AuthService.logout();
	            }
	        }
        );
	}

	$scope.filterCampaigns = function() {
		$scope.isFiltered = false;
        var filteringList = campaigns;
        if($scope.startDate && $scope.endDate)
            filteringList = $scope.filterByDate(filteringList);
        if($scope.citySelect && $scope.citySelect.availableOptions && $scope.citySelect.selectedOption.ID != -1)
            filteringList = $scope.filterByCity(filteringList);
        if($scope.districtSelect && $scope.districtSelect.availableOptions && $scope.districtSelect.selectedOption.ID != -1)
            filteringList = $scope.filterByDistrict(filteringList);
        else //set correct filter value after going back to 'All' choice
            $scope.filterValueArea ? $scope.filterValueArea = $scope.areaSelect.selectedOption.name : $scope.filterValueArea = '';
        if($scope.minAddedBalance || $scope.maxAddedBalance)
            filteringList = $scope.filterByAddedBalance(filteringList);
        if($scope.statusSelect.selectedOption.id != -1)
            filteringList = $scope.filterByStatus(filteringList);
        else //set correct filter value after going back to 'All' choice
            $scope.filterValueStatus ? $scope.filterValueStatus = $scope.statusSelect.selectedOption.name : $scope.filterValueStatus = '';
        $scope.displayFilteredCampaigns(filteringList);
	}

	$scope.filterByDate = function(filteringList){
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(campaign){
            if(moment(campaign.StartDate).isBetween(moment($scope.startDate).startOf('day'), moment($scope.endDate).endOf('day'), null, '[]') ||
               moment(campaign.EndDate).isBetween(moment($scope.startDate).startOf('day'), moment($scope.endDate).endOf('day'), null, '[]')){
                filteredData.push(campaign);
            }
        });

        //Models to display on filter bar
        $scope.filterValueStartDate = $scope.startDate;
        $scope.filterValueEndDate = $scope.endDate;

        return filteredData;
    }

    $scope.filterByCity = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];
        angular.forEach(filteringList, function(campaign){
            if(angular.equals(campaign.district.city.name, $scope.citySelect.selectedOption.Name)){
                filteredData.push(campaign);
            }
        });

        //Models to display on filter bar
        $scope.filterValueCity = $scope.citySelect.selectedOption.name;
        return filteredData;
    }

    $scope.filterByDistrict = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];
        angular.forEach(filteringList, function(campaign){
            if(angular.equals(campaign.District.EnglishName, $scope.districtSelect.selectedOption.EnglishName)){
                filteredData.push(campaign);
            }
        });

        //Models to display on filter bar
        $scope.filterValueDistrict = $scope.districtSelect.selectedOption.EnglishName;
        return filteredData;
    }

    $scope.filterByAddedBalance = function(filteringList) {
    	$scope.isFiltered = true;

        if($scope.minAddedBalance && !$scope.maxAddedBalance) {
        	return $scope.filterByMinimumAddedBalance(filteringList);
        } else if (!$scope.minAddedBalance && $scope.maxAddedBalance) {
        	return $scope.filterByMaximumAddedBalance(filteringList);
        } else {
        	return $scope.filterByMaxMinAddedBalance(filteringList);
        }
    }

    $scope.filterByMinimumAddedBalance = function(filteringList) {
    	var filteredData = [];

    	angular.forEach(filteringList, function(campaign){
    		if(campaign.AddedBalance >= $scope.minAddedBalance) {
    			filteredData.push(campaign);
    		}
    	});

    	$scope.filterValueMinAddedBalance = $scope.minAddedBalance;
    	return filteredData;
    }

    $scope.filterByMaximumAddedBalance = function(filteringList) {
    	var filteredData = [];

    	angular.forEach(filteringList, function(campaign){
    		if(campaign.AddedBalance <= $scope.maxAddedBalance) {
    			filteredData.push(campaign);
    		}
    	});

    	$scope.filterValueMaxAddedBalance = $scope.maxAddedBalance;
    	return filteredData;
    }

    $scope.filterByMaxMinAddedBalance = function(filteringList) {
    	var filteredData = [];

    	angular.forEach(filteringList, function(campaign){
    		if(campaign.AddedBalance >= $scope.minAddedBalance && campaign.AddedBalance <= $scope.maxAddedBalance) {
    			filteredData.push(campaign);
    		}
    	});

    	$scope.filterValueMinAddedBalance = $scope.minAddedBalance;
    	$scope.filterValueMaxAddedBalance = $scope.maxAddedBalance;

    	return filteredData;
    }

    $scope.filterByStatus = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(campaign){
        	if(campaign.IsActive) {
	            if(angular.equals($scope.statusSelect.selectedOption.name, 'Active') && moment().isBetween(moment(campaign.StartDate).startOf('day'), moment(campaign.EndDate).endOf('day'), null, '[]')){
	            	filteredData.push(campaign);
	            } else if(angular.equals($scope.statusSelect.selectedOption.name, 'Scheduled') && moment().isBefore(campaign.StartDate)) {
	            	filteredData.push(campaign);
	            } else if(angular.equals($scope.statusSelect.selectedOption.name, 'Finished') && moment().isAfter(campaign.EndDate)){
	            	//Finished
	            	filteredData.push(campaign);
	            }
        	} else if(angular.equals($scope.statusSelect.selectedOption.name, 'Deactivated')){
        		//Deactivated
        		filteredData.push(campaign);
        	}
        });

        //Models to display on filter bar
        $scope.filterValueStatus = $scope.statusSelect.selectedOption.name;
        return filteredData;
    }

    $scope.displayFilteredCampaigns = function(filteredList) {
    	if(filteredList.length > 0) {
    		$scope.noCampaignsFetched = false;
    	} else {
	    	$scope.noCampaignsFetched = true;
	    }

    	$scope.campaigns = {
			active: [],
			scheduled: [],
			finished: [],
			diactivated: []
		};

    	angular.forEach(filteredList, function(campaign) {
			if(campaign.IsActive) {
				//Active campaigns				
				if(moment().isBetween(moment(campaign.StartDate).startOf('day'), moment(campaign.EndDate).endOf('day'), null, '[]')) {					
					$scope.campaigns.active.push(campaign);
				} else if(moment().startOf('day').isBefore(campaign.StartDate)) {
					//scheduled
					$scope.campaigns.scheduled.push(campaign);
				} else {
					//finished
					$scope.campaigns.finished.push(campaign);
				}
			} else {
				//deactivated
				$scope.campaigns.diactivated.push(campaign);
			}
		});	    
    }

    $scope.clearFilters = function(){
        $scope.isFiltered = false;
        $('#datepicker_campaignsFilter span').html('');
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.filterValueStartDate = "";
        $scope.filterValueEndDate = "";
        $scope.citySelect.selectedOption = $scope.listOfCities[0];
        $scope.filterValueCity =  $scope.citySelect.selectedOption.name;
        $scope.minAddedBalance = "";
        $scope.filterValueMinAddedBalance = "";
        $scope.maxAddedBalance = "";
        $scope.filterValueMaxAddedBalance = ""
        $scope.statusSelect.selectedOption = $scope.listOfStatus[0];
        $scope.filterValueStatus = $scope.statusSelect.selectedOption.name;
        $scope.filterCampaigns();
    }
});