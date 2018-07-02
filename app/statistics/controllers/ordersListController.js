'use strict';

angular.module('app.statistics').controller('ordersListController', function ($scope, orders, $filter, getOrders, $cookies, AuthService) {
    $scope.orders = orders.Data.Orders;
    $scope.filters = orders.Data.Filters; // It contains the list of areas and the list of statuses

    $scope.dtInstance = {};

    $scope.dtInstanceCallback = function (instance) {
        $scope.dtInstance = instance;
        console.log($scope.dtInstance);
    };

    $scope.tableOptions =  {
        "data": orders.Data.Orders,
        "iDisplayLength": 25,
        columns: [
        {
            "class":          'details-control',
            "orderable":      false,
            "data":           null,
            "defaultContent": ''
        },
        {
            data: null,
            render: function (data, type, order) {
                return moment(order.CreatedAt).add(3, 'hours').format("DD/MMM/YYYY hh:mm A");;
            }
        },
        {
            data: "CustomerName"
        },
        {
            data: "CustomerPhoneOperatingSystem"
        },
        {
            data: "CustomerAreaName"
        },
        {
            data: null,
            render: function (data, type, order) {
                var paidPrice = order.TotalPrice - order.PaidInBalance - order.PaidInCoupon;
                return $filter('currency')(paidPrice, 'SAR ', 2);
            }
        },
        { 
            data: "OrderStatus" 
        },
        {
            data: "DriverEvaluationRating",
            render: function(data, type, order) {
                if (order.DriverEvaluationRating == null || order.DriverEvaluationRating == 0) {
                    return "-";
                }

                var stars = '';
                for (var counter = 1; counter <= order.DriverEvaluationRating; counter++) {
                    stars = stars + '<i class="fa fa-lg fa-fw fa-star" style="color:#3276B1"></i>';
                }
                return stars;
            }
        },
        {
            data: "DeliverySpeedRating",
            render: function(data, type, order) {
                if (order.DeliverySpeedRating == null || order.DeliverySpeedRating == 0) {
                    return "-";
                }

                var stars = '';
                for (var counter = 1; counter <= order.DeliverySpeedRating; counter++) {
                    stars = stars + '<i class="fa fa-lg fa-fw fa-star" style="color:#3276B1"></i>';
                }
                return stars;
            }
        },
        {
            data: null,
            render: function (data, type, order) {
                return $scope.getFormattedDuration(order.SecondsToArrival);
            }
        },
        {
            data: null,
            render: function (data, type, order) {
                return $scope.getFormattedDuration(order.SecondsToDelivery);
            }
        }
        ],
        "order": [[1, 'desc']]
    };
    

    $scope.getFormattedDuration = function(durationInSeconds){
        return moment.duration(durationInSeconds, "seconds").format('mm[ min] ss[ sec]', { trim: false });;
    };

    //initializing datepickers
    $(function() {        
        //Assigning datepicker to specefied element and handleing date change funciton
        $('#datepicker').daterangepicker({
            ranges: {
               'Today': [moment().startOf('day'), moment().endOf('day')],
               'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
               'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
               'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, function(start, end) {
            $('#datepicker span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            
            //get a hold of controller and scope
             var element = angular.element($('#datepicker'));
             var controller = element.controller();
             var scope = element.scope();

            scope.$apply(function(){

                scope.startDate = start.format('DD/MMM/YYYY');
                scope.endDate = end.format('DD/MMM/YYYY');
            });
        });

    });

    $scope.getListOfAreas = function(){
        var listOfAreas = [ {id: -1, name: "All"} ];
        var idCounter = 0;

        angular.forEach($scope.filters.Areas, function(area){
            if(area){
                listOfAreas.push({id: idCounter, name: area});
                idCounter++;
            }
        });

        return listOfAreas;
    };

    //Getting areas list
    $scope.listOfAreas = $scope.getListOfAreas();
    $scope.areaSelect = { // select in HTML
        availableOptions: $scope.listOfAreas,
        selectedOption: {
            id: $scope.listOfAreas[0].id,
            name: $scope.listOfAreas[0].name
        }
    };

    $scope.getListOfStatuses = function(){
        var listOfStatuses = [ {id: -1, name: "All"} ];
        var idCounter = 0;

        angular.forEach($scope.filters.Statuses, function(status){
            if(status){
                listOfStatuses.push({id: idCounter, name: status});
                idCounter++;
            }
        });

        return listOfStatuses;
    };

    //Getting status list
    $scope.listOfStatus = $scope.getListOfStatuses();
    $scope.statusSelect = { // select in HTML
        availableOptions: $scope.listOfStatus,
        selectedOption: {
            id: $scope.listOfStatus[0].id,
            name: $scope.listOfStatus[0].name
        }
    };

    $scope.filterOrders = function() {

        $scope.isFiltered = false;
        var filteringList = $scope.orders;

        if($scope.startDate && $scope.endDate)
            filteringList = $scope.filterByDate(filteringList);

        if($scope.customerName)
            filteringList = $scope.filterByCustomerName(filteringList);

        if($scope.areaSelect.selectedOption.id != -1)
            filteringList = $scope.filterByArea(filteringList);
        else //set correct filter calue after going back to 'All' choice
            $scope.filterValueArea ? $scope.filterValueArea = $scope.areaSelect.selectedOption.name : $scope.filterValueArea = '';


        if($scope.statusSelect.selectedOption.id != -1)
            filteringList = $scope.filterByStatus(filteringList);
        else //set correct filter calue after going back to 'All' choice
            $scope.filterValueStatus ? $scope.filterValueStatus = $scope.statusSelect.selectedOption.name : $scope.filterValueStatus = '';

        if($scope.minimumMinutesToArrive || $scope.minimumSecondsToArrive || $scope.maximumMinutesToArrive || $scope.maximumSecondsToArrive)
            filteringList = $scope.filterByTimeToArrive(filteringList);

        if($scope.minimumMinutesDeliveryTime || $scope.minimumSecondsDeliveryTime || $scope.maximumMinutesDeliveryTime || $scope.maximumSecondsDeliveryTime)
            filteringList = $scope.filterByTotalDeliveryTime(filteringList);

        $scope.updateDataTabl(filteringList);
    };

    // To check if the toggle for including test users or not.
    var includingTestOrders = true;
    $scope.AddOrRemoveTestingOrders = function() {
        // Changing the color of the button.
        $(function() {
            if(includingTestOrders){
                $('#toggleTestingOrders').addClass('btn-success').removeClass('btn-danger');
            }
            else {
                 $('#toggleTestingOrders').addClass('btn-danger').removeClass('btn-success');
            }     
        });

        (function(){
            var newOrders = getOrders.query().$promise.then(
                function (response) {
                    return response;
                },
                function (error) {
                    console.error(error);
                    if (error.statusText === 'Unauthorized') {
                        AuthService.logout();
                    }
                }
            );
            return newOrders;
        })().then(function(orders){
            $scope.orders = orders.data;
            $scope.filterOrders();
        }, function(error){
            console.log(error);
        });
        
        includingTestOrders = !includingTestOrders;
    }

    $scope.filterByDate = function(filteringList){
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(order){
            if(moment(order.order_time).isBetween(moment($scope.startDate).startOf('day'), moment($scope.endDate).endOf('day'), null, '[]')){
                filteredData.push(order);
            }
        });

        //Models to display on filter bar
        $scope.filterValueStartDate = $scope.startDate;
        $scope.filterValueStartTime = $scope.startTime;
        $scope.filterValueEndDate = $scope.endDate;
        $scope.filterValueEndTime = $scope.endTime;

        return filteredData;
    };

    $scope.filterByCustomerName = function(filteringList) {
        $scope.isFiltered = true;
        var filteredData = [];
        angular.forEach(filteringList, function(order){
            if(order.customer_name && order.customer_name.indexOf($scope.customerName) !== -1){
                filteredData.push(order);
            }
        });

        //Models to display on filter bar
        $scope.filterValueCustomerName = $scope.customerName;
        return filteredData;
    };

    $scope.filterByArea = function(filteringList){
        $scope.isFiltered = true;
        var filteredData = [];
        angular.forEach(filteringList, function(order){
            if(order.area_name && angular.equals(order.area_name, $scope.areaSelect.selectedOption.name)){
                filteredData.push(order);
            }
        });

        //Models to display on filter bar
        $scope.filterValueArea = $scope.areaSelect.selectedOption.name;
        return filteredData;
    };

    $scope.filterByStatus = function(filteringList){
        $scope.isFiltered = true;
        var filteredData = [];

        angular.forEach(filteringList, function(order){
            if(order.orderStatus && angular.equals($scope.statusSelect.selectedOption.name, order.orderStatus)){
                filteredData.push(order);
            }
        });

        //Models to display on filter bar
        $scope.filterValueStatus = $scope.statusSelect.selectedOption.name;

        return filteredData;
    };

    $scope.TIME_TYPE = {
        TIME_TO_ARRIVAL: "TIME_TO_ARRIVAL",
        TOTAL_DELIVETY_TIME: "TOTAL_DELIVETY_TIME"
    };

    $scope.filterByTimeToArrive = function(filteringList){
        return $scope.filterByDuration(
            $scope.minimumMinutesToArrive,
            $scope.minimumSecondsToArrive,
            $scope.maximumMinutesToArrive,
            $scope.maximumSecondsToArrive,
            filteringList,
            $scope.TIME_TYPE.TIME_TO_ARRIVAL);
    };

    $scope.filterByTotalDeliveryTime = function(filteringList){
        return $scope.filterByDuration(
            $scope.minimumMinutesDeliveryTime,
            $scope.minimumSecondsDeliveryTime,
            $scope.maximumMinutesDeliveryTime,
            $scope.maximumSecondsDeliveryTime,
            filteringList,
            $scope.TIME_TYPE.TOTAL_DELIVETY_TIME);
    };

    $scope.filterByDuration = function(minimumMinutes, minimumSeconds, maximumMinutes, maximumSeconds, filteringList, timeType){
        $scope.isFiltered = true;
        var filteredData = [];

        var minMinutes = minimumMinutes ? minimumMinutes : 0;
        var minSeconds = minimumSeconds ? minimumSeconds : 0;

        var maxMinutes = maximumMinutes ? maximumMinutes : 0;
        var maxSeconds = maximumSeconds ? maximumSeconds : 0;

        var minDuration = moment.duration( (minMinutes*60) + minSeconds, 'seconds');
        var maxDuration = moment.duration( (maxMinutes*60) + maxSeconds, 'seconds');

        if(minimumMinutes && maximumMinutes)
            filteredData = $scope.filterTimeByMinMaxMinutes(minDuration, maxDuration, filteringList, timeType);//filter for both min max minutes
        else if(minimumMinutes && !maximumMinutes)
            filteredData = $scope.filterTimeByMinimumMinutes(minDuration, filteringList, timeType);//filter for min minutes
        else if(!minimumMinutes && maximumMinutes)
            filteredData = $scope.filterTimeByMaximumMinutes(maxDuration, filteringList, timeType);//filter for max minutes
        else
            filteredData = $scope.filterTimeBySeconds(minDuration, maxDuration, filteringList, timeType);//filter for seconds

        $scope.setFilterValues(minMinutes, minSeconds, maxMinutes, maxSeconds, timeType);

        return filteredData;
    };

    $scope.setFilterValues = function(minMinutes, minSeconds, maxMinutes, maxSeconds, timeType){
        //Models to display on filter bar
        if(angular.equals(timeType, $scope.TIME_TYPE.TIME_TO_ARRIVAL)){

            $scope.filterValueMinimumTimeToArrive = minMinutes + 'm ' + minSeconds + 's';
            $scope.filterValueMaximumTimeToArrive = (maxMinutes != 0 || maxSeconds != 0) ? (maxMinutes + 'm ' + maxSeconds + 's') : 'MAX';

        }else if(angular.equals(timeType, $scope.TIME_TYPE.TOTAL_DELIVETY_TIME)){

            $scope.filterValueMinimumTotalDeliveryTime = minMinutes + 'm ' + minSeconds + 's';
            $scope.filterValueMaximumTotalDeliveryTime = (maxMinutes != 0 || maxSeconds != 0) ? (maxMinutes + 'm ' + maxSeconds + 's') : 'MAX';
        }
    };

    $scope.getOrderTimeDuration = function(order, timeType){
        if(angular.equals(timeType, $scope.TIME_TYPE.TIME_TO_ARRIVAL))
            return moment.duration(parseInt(order.to_arrived_time) + parseInt(order.to_navigate_time), 'seconds');
        else if(angular.equals(timeType, $scope.TIME_TYPE.TOTAL_DELIVETY_TIME))
            return moment.duration(parseInt(order.to_arrived_time) + parseInt(order.to_navigate_time) + parseInt(order.to_delivered_time), 'seconds');

        return null;
    };

    $scope.filterTimeByMinMaxMinutes = function(minDuration, maxDuration, filteringList, timeType){
        var filteredData = [];
        angular.forEach(filteringList, function(order){
            var duration = $scope.getOrderTimeDuration(order, timeType);

            //check if greater or less than minimum
            if(Math.floor(duration.asMinutes()) > Math.floor(minDuration.asMinutes()) 
            && Math.floor(duration.asMinutes()) < Math.floor(maxDuration.asMinutes())){
                filteredData.push(order);
            }
            else if((Math.floor(duration.asMinutes()) == Math.floor(minDuration.asMinutes()) && duration.seconds() >= minDuration.seconds()) &&
                    (Math.floor(duration.asMinutes()) == Math.floor(maxDuration.asMinutes()) && duration.seconds() <= maxDuration.seconds())) {
                filteredData.push(order);
            }
        });
        return filteredData;
    };

    $scope.filterTimeByMinimumMinutes = function(minDuration, filteringList, timeType){
        var filteredData = [];
        angular.forEach(filteringList, function(order){
            var duration = $scope.getOrderTimeDuration(order, timeType);
            
            //check if greater than minimum
            if(Math.floor(duration.asMinutes()) > Math.floor(minDuration.asMinutes())){
                filteredData.push(order);
            }
            else if((Math.floor(duration.asMinutes()) == Math.floor(minDuration.asMinutes()) && duration.seconds() >= minDuration.seconds())){
                filteredData.push(order);
            }
        });
        return filteredData;
    };

    $scope.filterTimeByMaximumMinutes = function(maxDuration, filteringList, timeType){
        var filteredData = [];
        angular.forEach(filteringList, function(order){
            var duration = $scope.getOrderTimeDuration(order, timeType);
            
            //check if greater than minimum
            if(Math.floor(duration.asMinutes()) < Math.floor(maxDuration.asMinutes())){
                filteredData.push(order);
            }
            else if(Math.floor(duration.asMinutes()) == Math.floor(maxDuration.asMinutes()) && duration.seconds() <= maxDuration.seconds()){
                filteredData.push(order);
            }
        });
        return filteredData;
    };

    $scope.filterTimeBySeconds = function(minDuration, maxDuration, filteringList, timeType){
        var filteredData = [];
        angular.forEach(filteringList, function(order){
            var duration = $scope.getOrderTimeDuration(order, timeType);

            if(minDuration.seconds() && maxDuration.seconds()){
                if(duration.seconds() >= minDuration.seconds() && duration.seconds() <= maxDuration.seconds()){
                    filteredData.push(order);
                }
            }else if(minDuration.seconds() && !maxDuration.seconds()){
                if(duration.seconds() >= minDuration.seconds() ){
                    filteredData.push(order);
                }
            }else if(!minDuration.seconds() && maxDuration.seconds() && Math.floor(duration.asMinutes()) == 0){
                if(duration.seconds() <= maxDuration.seconds()){
                    filteredData.push(order);
                }
            }
        });
        return filteredData;
    };

    $scope.updateDataTabl = function(newData){
        var dataTable = angular.element("#table").dataTable().api();
        dataTable.clear();
        dataTable.rows.add(newData).draw();
    };

    $scope.clearFilters = function(){
        $scope.isFiltered = false;
        $scope.startDate = "";
        $scope.startTime = "";
        $scope.endDate = "";
        $scope.endTime = "";
        $scope.filterValueStartDate = "";
        $scope.filterValueStartTime = "";
        $scope.filterValueEndDate = "";
        $scope.filterValueEndTime = "";
        $scope.customerName = "";
        $scope.filterValueCustomerName = "";
        $scope.areaSelect.selectedOption = $scope.listOfAreas[0];
        $scope.filterValueArea =  $scope.areaSelect.selectedOption.name;
        $scope.statusSelect.selectedOption = $scope.listOfStatus[0];
        $scope.filterValueStatus = $scope.statusSelect.selectedOption.name;
        $scope.minimumMinutesToArrive = "";
        $scope.minimumSecondsToArrive = "";
        $scope.maximumMinutesToArrive = "";
        $scope.maximumSecondsToArrive = "";
        $scope.filterValueMinimumTimeToArrive = "";
        $scope.filterValueMaximumTimeToArrive = "";
        $scope.minimumMinutesDeliveryTime = "";
        $scope.minimumSecondsDeliveryTime = "";
        $scope.maximumMinutesDeliveryTime = "";
        $scope.maximumSecondsDeliveryTime = "";
        $scope.filterValueMinimumTotalDeliveryTime = "";
        $scope.filterValueMaximumTotalDeliveryTime = "";
        $scope.filterOrders();
    };
});