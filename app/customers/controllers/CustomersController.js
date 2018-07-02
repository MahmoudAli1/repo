'use strict';

angular.module('app.customers').controller('CustomersController', 
function($scope, $cookies, $compile, $state, customers, deleteCustomer, getCustomers, AuthService) {

    $scope.filters = customers.filters; // it has the list of areas, districts, .... etc.
    $scope.customers = customers.customers;

    $scope.tableOptions = {
        "data": customers.customers,
        "iDisplayLength": 25,
        "columns": [{
                "class": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {
                "data": "Name",
                render: function(data, type, row) {
                    return data ? data : 'Anonymous';
                }
            },
            {
                "data": "PhoneOperatingSystem",
                render: function(data, type, row) {
                    return data ? data : 'Not Selected';
                }
            },
            {
                "data": "DistrictName",
                render: function(data, type, row) {
                    return data ? data : 'Without district';
                }
            },
            {
                "data": "AreaName",
                render: function(data, type, row) {
                    return data ? data : 'Without area';
                }
            },
            { 
                "data": "OrderCount" 
            },
            { 
                "data": "OfferingsCount" 
            },
            {
                "data": "IsInArea",
                render: function(data, type, row) {
                    return data ? "Yes" : "No";
                }
            },
            {
                "data": "LastInArea",
                render: function(data, type, row) {
                    return data ? moment(data).add(3, 'hours').format("DD/MMM/YYYY hh:mm A") : '';
                }
            },
            {
                "data": "CreatedAt",
                render: function(data, type, row) {
                    return data ? moment(data).add(3, 'hours').format("DD/MMM/YYYY hh:mm A") : '';
                }
            }
        ],
        "order": [
            [8, 'desc']
        ]
    };

    //The filters code starts from here.
    $scope.getListOfAreas = function() {
        var listOfAreas = [{ id: -1, name: "All" }];
        var idCounter = 0;//Created a dummy id for the id tracking in the ngOptions. And not using the customer id because deffirent customers may have the same area.

        angular.forEach($scope.filters.areas, function(area) {
            if (area) {
                listOfAreas.push({ id: idCounter, name: area }); 
                idCounter++;
            }
        });

        return listOfAreas;
    };

    $scope.getListOfDistricts = function() {
        var listOfDistricts = [{ id: -1, name: "All" }];
        var idCounter = 0;//Created a dummy id for the id tracking in the ngOptions. And not using the customer id because deffirent customers may have the same area.

        angular.forEach($scope.filters.districts, function(district) {
            if (district) {
                listOfDistricts.push({ id: idCounter, name: district }); 
                idCounter++;
            }
        });

        return listOfDistricts;
    };

    $scope.phoneFilter;
    $scope.ageFromFilter;
    $scope.ageToFilter;
    $scope.isLocationAllowedFilter;
    $scope.versionNumberFilter;
    $scope.buildNumberFilter;

    //Getting areas list
    $scope.listOfAreas = $scope.getListOfAreas();
    $scope.areaSelect = { // select in HTML
        availableOptions: $scope.listOfAreas,
        selectedOption: {
            id: $scope.listOfAreas[0].id,
            name: $scope.listOfAreas[0].name
        }
    };

    //Getting districts list
    $scope.listOfDistricts = $scope.getListOfDistricts();
    $scope.districtSelect = { // select in HTML
        availableOptions: $scope.listOfDistricts,
        selectedOption: {
            id: $scope.listOfDistricts[0].id,
            name: $scope.listOfDistricts[0].name
        }
    };

    //Setting is location allowed filter options
    $scope.isLocationAllowedList = [{
            id: -1,
            isLocationAllowed: "All",
            value: null
        },
        {
            id: 1,
            isLocationAllowed: "Yes",
            value: true
        },
        {
            id: 2,
            isLocationAllowed: "No",
            value: false
        }
    ];
    $scope.isLocationAllowedSelect = { // select in HTML
        availableOptions: $scope.isLocationAllowedList,
        selectedOption: {
            id: $scope.isLocationAllowedList[0].id,
            isLocationAllowed: $scope.isLocationAllowedList[0].isLocationAllowed
        }
    };

    //Setting in location filter options
    $scope.inLocationList = [{
            id: -1,
            inLocation: "All",
            value: null
        },
        {
            id: 1,
            inLocation: "Yes",
            value: true
        },
        {
            id: 2,
            inLocation: "No",
            value: false
        }
    ];
    $scope.inLocationSelect = { // select in HTML
        availableOptions: $scope.inLocationList,
        selectedOption: {
            id: $scope.inLocationList[0].id,
            inLocation: $scope.inLocationList[0].inLocation
        }
    };

    //Setting phoneType options
    $scope.phoneTypeList = [{
            id: -1,
            name: "All",
            value: "All"
        },
        {
            id: 1,
            name: "ios",
            value: "ios"
        },
        {
            id: 2,
            name: "android",
            value: "android"
        },
        {
            id: 3,
            name: "Not Selected",
            value: null
        }
    ];
    
    $scope.phoneTypesSelect = { // select in HTML
        availableOptions: $scope.phoneTypeList,
        selectedOption: {
            id: $scope.phoneTypeList[0].id,
            name: $scope.phoneTypeList[0].name,
            value: $scope.phoneTypeList[0].value
        }
    };

    //Setting anonymous filter options
    $scope.anonymousList = [{
            id: -1,
            anonymous: "All",
            value: null
        },
        {
            id: 1,
            anonymous: "Yes",
            value: true
        },
        {
            id: 2,
            anonymous: "No",
            value: false
        }
    ];
    $scope.anonymousSelect = { // select in HTML
        availableOptions: $scope.anonymousList,
        selectedOption: {
            id: $scope.anonymousList[0].id,
            anonymous: $scope.anonymousList[0].anonymous
        }
    };

    //Setting notification allowed filter options
    $scope.notificationAllowedList = [{
            id: -1,
            notificationAllowed: "All",
            value: null
        },
        {
            id: 1,
            notificationAllowed: "Yes",
            value: true
        },
        {
            id: 2,
            notificationAllowed: "No",
            value: false
        }
    ];
    $scope.notificationAllowedSelect = { // select in HTML
        availableOptions: $scope.notificationAllowedList,
        selectedOption: {
            id: $scope.notificationAllowedList[0].id,
            notificationAllowed: $scope.notificationAllowedList[0].notificationAllowed
        }
    };

    //initializing datepickers
    $(function() {
        //Assigning datepicker to specefied element and handleing date change funciton
        $('#datepicker_lastInArea').daterangepicker({
            ranges: {
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, function(start, end) {
            $('#datepicker_lastInArea span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            //get a hold of controller and scope
            var element = angular.element($('#datepicker_lastInArea'));
            var controller = element.controller();
            var scope = element.scope();

            scope.$apply(function() {

                scope.lastInArea_startDate = start;
                scope.lastInArea_endDate = end;
            });
        });

        $('#datepicker_creationDate').daterangepicker({
            ranges: {
                'Today': [moment().startOf('day'), moment().endOf('day')],
                'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, function(start, end) {
            $('#datepicker_creationDate span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            //get a hold of controller and scope
            var element = angular.element($('#datepicker_creationDate'));
            var controller = element.controller();
            var scope = element.scope();

            scope.$apply(function() {

                scope.creationDate_startDate = start;
                scope.creationDate_endDate = end;
            });
        });

    });

    $scope.isFiltered = false;
    $scope.filterCustomers = function() {
        $scope.isFiltered = false;

        var filteringList = $scope.customers;

        if ($scope.phoneFilter)
            filteringList = $scope.filterByPhoneNumber(filteringList);

        if ($scope.phoneTypesSelect.selectedOption.id != -1)
            filteringList = $scope.filterByPhoneType(filteringList);

        if ($scope.ageFromFilter && $scope.ageToFilter)
            filteringList = $scope.filterByAge(filteringList);

        if ($scope.districtSelect.selectedOption.id != -1){
            console.log("I'm filtering the districts here!");
            filteringList = $scope.filterByDistrict(filteringList);
        }

        if ($scope.areaSelect.selectedOption.id != -1){
           filteringList = $scope.filterByArea(filteringList);
        }

        if ($scope.isLocationAllowedSelect.selectedOption.id != -1)
            filteringList = $scope.filterByIsLocationAllowed(filteringList);

        if ($scope.inLocationSelect.selectedOption.id != -1)
            filteringList = $scope.filterByInLocation(filteringList);

        if ($scope.anonymousSelect.selectedOption.id != -1)
            filteringList = $scope.filterByAnonymous(filteringList);

        if ($scope.notificationAllowedSelect.selectedOption.id != -1)
            filteringList = $scope.filterByIsNotificationAllowed(filteringList);

        if ($scope.versionNumberFilter)
            filteringList = $scope.filterByVersionNumber(filteringList);

        if ($scope.buildNumberFilter)
            filteringList = $scope.filterByBuildNumber(filteringList);

        if ($scope.lastInArea_startDate && $scope.lastInArea_endDate)
            filteringList = $scope.filterBylastInAreaDate(filteringList);

        if ($scope.creationDate_startDate && $scope.creationDate_endDate)
            filteringList = $scope.filterByAccountCreationDate(filteringList);


        $scope.updateDataTabl(filteringList);
    };

    // To check if the toggle for including test users or not.
    var includingTestOrders = true;
    $scope.AddOrRemoveTestingOrders = function() {
        $(function() {
            // Changing the color of the button.
            if(includingTestOrders){
                $('#toggleTestingOrders').addClass('btn-success').removeClass('btn-danger');
            }
            else {
                 $('#toggleTestingOrders').addClass('btn-danger').removeClass('btn-success');
            }     
        });

        (function(){
            var newCustomers = getCustomers.query({
            access_token: $cookies.get('accessToken'),
            testing: includingTestOrders
            }).$promise.then(
                function (data) {
                    return data;
                },
                function (error) {
                    console.error(error);
                    if (error.statusText === 'Unauthorized') {
                        AuthService.logout();
                    }
                }
            );
            return newCustomers;
        })().then(function(customers){
            $scope.customers = customers.customers;
            $scope.filterCustomers();
        }, function(error){
            console.log(error);
        });
        
        includingTestOrders = !includingTestOrders;
    }

    $scope.filterByPhoneNumber = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (angular.equals(customer.phone_number, parseInt($scope.phoneFilter))) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValuePhoneNumber = $scope.phoneFilter;

        return filteredData;
    };

    $scope.filterByPhoneType = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (angular.equals(customer.phone_type, $scope.phoneTypesSelect.selectedOption.value))
                filteredData.push(customer);
        });

        //Models to display on filter bar
        $scope.filterValuePhoneType = $scope.phone_type;

        return filteredData;
    };

    $scope.filterByAge = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (customer.age && $scope.ageFromFilter <= customer.age && customer.age <= $scope.ageToFilter) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueAgeFrom = $scope.ageFromFilter;
        $scope.filterValueAgeTo = $scope.ageToFilter;

        return filteredData;
    };

    $scope.filterByArea = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if ((customer.area_name && angular.equals(customer.area_name, $scope.areaSelect.selectedOption.name)) || (angular.equals("Without area", $scope.areaSelect.selectedOption.name) && customer.area_name === null)) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueArea = $scope.areaSelect.selectedOption.name;

        return filteredData;
    };

    $scope.filterByDistrict = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if ((customer.district_name && angular.equals(customer.district_name, $scope.districtSelect.selectedOption.name)) || (angular.equals("Without district", $scope.districtSelect.selectedOption.name) && customer.district_name === null)) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueDistrict = $scope.districtSelect.selectedOption.name;

        return filteredData;
    };

    $scope.filterByIsLocationAllowed = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (angular.equals(customer.isLocationAllowed, $scope.isLocationAllowedSelect.selectedOption.value)) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueIsLocationAllowed = $scope.isLocationAllowedSelect.selectedOption.isLocationAllowed;

        return filteredData;
    };

    $scope.filterByInLocation = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (angular.equals(customer.isInArea, $scope.inLocationSelect.selectedOption.value)) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueInLocation = $scope.inLocationSelect.selectedOption.inLocation;
        return filteredData;
    };

    $scope.filterByAnonymous = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if ($scope.anonymousSelect.selectedOption.value) {
                if (!customer.name) filteredData.push(customer);
            } else {
                if (customer.name) filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueAnonymous = $scope.anonymousSelect.selectedOption.anonymous;

        return filteredData;
    };

    $scope.filterByIsNotificationAllowed = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (angular.equals(customer.isNotificationsAllowed, $scope.notificationAllowedSelect.selectedOption.value)) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueIsNotificationAllowed = $scope.notificationAllowedSelect.selectedOption.isNotificationsAllowed;
        return filteredData;
    };

    $scope.filterByVersionNumber = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (angular.equals(customer.versionNumber, $scope.versionNumberFilter)) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueVersionNumber = $scope.versionNumberFilter;
        return filteredData;
    };

    $scope.filterByBuildNumber = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (angular.equals(customer.buildNumber, $scope.buildNumberFilter)) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueBuildNumber = $scope.buildNumberFilter;
        return filteredData;
    };

    $scope.filterBylastInAreaDate = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (moment(customer.lastInAreaUpdateTime).isBetween(moment($scope.lastInArea_startDate).startOf('day'), moment($scope.lastInArea_endDate).endOf('day'), null, '[]')) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueLastInAreaStartDate = moment($scope.lastInArea_startDate).format('DD/MMM/YYYY');
        $scope.filterValueLastInAreaEndDate = moment($scope.lastInArea_endDate).format('DD/MMM/YYYY');
        return filteredData;
    };

    $scope.filterByAccountCreationDate = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(customer) {
            if (moment(customer.created).isBetween(moment($scope.creationDate_startDate).startOf('day'), moment($scope.creationDate_endDate).endOf('day'), null, '[]')) {
                filteredData.push(customer);
            }
        });

        //Models to display on filter bar
        $scope.filterValueAccountCreationStartDate = moment($scope.creationDate_startDate).format('DD/MMM/YYYY');
        $scope.filterValueAccountCreationEndDate = moment($scope.creationDate_endDate).format('DD/MMM/YYYY');
        return filteredData;
    };

    $scope.updateDataTabl = function(newData) {
        var dataTable = angular.element("#table").dataTable().api();
        dataTable.clear();
        dataTable.rows.add(newData);
        dataTable.draw()
    };

    $scope.clearFilters = function() {
        $scope.isFiltered = false;

        $scope.phoneFilter = "";
        $scope.filterValuePhoneNumber = "";
        $scope.phoneTypesSelect.selectedOption = $scope.phoneTypeList[0];
        $scope.filterValuePhoneType = "";
        $scope.ageFromFilter = "";
        $scope.filterValueAgeFrom = "";
        $scope.ageToFilter = "";
        $scope.filterValueAgeTo = "";
        $scope.districtSelect.selectedOption = $scope.listOfDistricts[0];
        $scope.filterValueDistrict = "";
        $scope.areaSelect.selectedOption = $scope.listOfAreas[0];
        $scope.filterValueArea = "";
        $scope.isLocationAllowedSelect.selectedOption = $scope.isLocationAllowedList[0];
        $scope.filterValueIsLocationAllowed = "";
        $scope.inLocationSelect.selectedOption = $scope.inLocationList[0];
        $scope.filterValueInLocation = "";
        $scope.anonymousSelect.selectedOption = $scope.anonymousList[0];
        $scope.filterValueAnonymous = "";
        $scope.notificationAllowedSelect.selectedOption = $scope.notificationAllowedList[0];
        $scope.filterValueIsNotificationAllowed = "";
        $scope.versionNumberFilter = "";
        $scope.filterValueVersionNumber = "";
        $scope.buildNumberFilter = "";
        $scope.filterValueBuildNumber = "";
        $scope.lastInArea_startDate = "";
        $scope.filterValueLastInAreaStartDate = "";
        $scope.lastInArea_endDate = "";
        $('#datepicker_lastInArea span').html('');
        $scope.filterValueLastInAreaEndDate = "";
        $scope.creationDate_startDate = "";
        $scope.filterValueAccountCreationStartDate = "";
        $scope.creationDate_endDate = "";
        $scope.filterValueAccountCreationEndDate = "";
        $('#datepicker_creationDate span').html('');

        $scope.filterCustomers();
    };

    $scope.displayCustomerOrdersHistory = function(customerId) {
        $state.go('app.customers.ordersHistory', { 'customerId': customerId });
    };

    $scope.displayDeliveryAddress = function(deliveryAddress) {
        var lat = deliveryAddress.latitude;
        var lng = deliveryAddress.longitude;
        var googleMapLink = "https://www.google.com/maps/place/" + lat + "," + lng;

        window.open(googleMapLink, '_blank');
    };

     $scope.getCustomerWithId = function(id){
    	var customerWithId;
    	angular.forEach($scope.customers, function(customer) {
    		if(customer.ID == id) 
    			customerWithId = customer;
    	});
    	return customerWithId;
    };
    $scope.openWindowForDeleteCustomer = function(customerId) {
        var customer = $scope.getCustomerWithId(customerId);
		$scope.message = "Are you sure you want to delete " + customer.Name;
		var element = angular.element('#confirmationModal-delete-button')
            .attr('ng-click','deleteCustomer('+customerId+')');
        angular.element('#confirmationModal-delete-button').append($compile(element)($scope));
    	$('#confirmationModal').modal('show');
    };

    $scope.deleteCustomer = function(customerId){
        deleteCustomer.delete({ id: customerId },{}).$promise.then(
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
        $('#confirmationModal').modal('hide');
    }

    $(function() {
        //get a hold of controller's scope
        var scope = angular.element($("#content")).scope();

        $("#content").on("click", ".ordersHistory", function(event) {
            event.stopPropagation();
            var customerId = $(this).attr('customer-id');
            scope.displayCustomerOrdersHistory(customerId);
        });

        $("#content").on("click", ".deliveryAddress", function(event) {
            event.stopPropagation();
            var deliveryAddress = angular.fromJson($(this).attr('delivery-address'));
            scope.displayDeliveryAddress(deliveryAddress);
        });

        $("#content").on("click", ".deleteCustomer", function(event) {
           event.stopPropagation();
           var customerId = $(this).attr('customer-id');
           scope.openWindowForDeleteCustomer(customerId);
       });
    });
});