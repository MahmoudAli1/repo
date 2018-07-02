'use strict';

angular.module('app.statistics').controller('StatisticsController', 
    function ($scope, $state, $cookies, $uibModal, getSubcategoryItemsWithName, getStatisticsFilterData, getStatistics, getOrders, AuthService) {
		$scope.activeStatistics = true;
        $('.statistic-calculate-overflow').css('height', $(window).height() - 88);
        $scope.isFiltered = false;
        $scope.backToList  = function () {
            $scope.statisticFlag = -1;
        }
 
    
        $scope.dataForCalculate = function () {
            $scope.statisticFlag = -1;
            getStatisticsFilterData.query().$promise.then(
                function (response) {
                    $scope.categories = response.Data.categories;
                    $scope.drivers = response.Data.drivers;
                    $scope.areas = response.Data.areas;
                    $scope.populateFiltersLists();
                },
                function (error) {
                    if (error.statusText === 'Unauthorized') {
                        AuthService.logout();
                    }
                }
            );
        };
        
    $scope.populateFiltersLists = function(){
        // for ng-desabled
        $scope.categories.unshift({
            id: -1,
            name: "All",
            items: []
        });
        //This sets the default value of the select in the ui
        $scope.categorySelect = { // select in HTML
            availableOptions: $scope.categories,
            selectedOption: {
                id: $scope.categories[0].id,
                name: $scope.categories[0].name
            }
        };

        $scope.drivers.unshift({
            id: -1,
            name: "All"
        });

        //get data from server for calculate them

        //This sets the default value of the select in the ui
        $scope.driversSelect = { // select in HTML
            availableOptions: $scope.drivers,
            selectedOption: {
                id: $scope.drivers[0].id,
                name: $scope.drivers[0].name
            }
        };

        $scope.areas.unshift({
            id: -1,
            name: "All"
        });
        //This sets the default value of the select in the ui
        $scope.areasSelect = { // select in HTML
            availableOptions: $scope.areas,
            selectedOption: {
                id: $scope.areas[0].id,
                name: $scope.areas[0].name
            } //This sets the default value of the select in the ui
        };
    }

    $scope.dataForCalculate();


    $scope.getBrandsAndItems = function () {
        if ($scope.categorySelect.selectedOption.id !== -1) {
            getSubcategoryItemsWithName.query({
                categoryId: $scope.categorySelect.selectedOption.id
            }).$promise.then(function (response) {
                $scope.listOfInventory = response.Data;
                $scope.listOfInventory.unshift({
                        ID: -1,
                        Name: "All",
                        BrandName: "All"
                    }
                );
                $scope.brandItemSelect = { // select in HTML
                    availableOptions: $scope.listOfInventory,
                    selectedOption: {
                        ID: $scope.listOfInventory[0].ID,
                        BrandName: $scope.listOfInventory[0].BrandName,
                        Name: $scope.listOfInventory[0].Name
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
                    $uibModal.open({
                        templateUrl: 'app/errorsAndMessages/views/errorsAndMessages.html',
                        windowClass: 'modalLogin',
                        animation: true,
                        controller: 'ModalInstanceErrorCtrl',
                        resolve: {
                            message: function () {
                                return errorMessage;
                            }
                        }
                    });
                    $scope.brandItemSelect = null;
                }
            }
            )
        }
    };

    //initializing dates
    $(function() {
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

    //send data for calculating statistics
    $scope.calculate = function () {
        $scope.errorOccured = false;
        $scope.dataForOrderLists = [];
        if(getDataParams){
        var dataParams = getDataParams();
        }
        getStatistics.query(dataParams).$promise.then(
            function (response) {
                $scope.statistics = response.Data;
                $scope.haveData = true;                
            },
            function (error) {
                $scope.haveData = false;
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
                //when coming this error from the server - will displaying message
                else if (error.statusText === 'Not Found') {
                    var message = error.data.message;
                    if (error.status === 404) {
                        $scope.errorOccured = true;
                        
                        $scope.statistics.totalRevenue = 0;
                        $scope.statistics.averageRevenuePerDelivery = 0;
                        $scope.statistics.totalProfit = 0;
                        $scope.statistics.averageProfitPerDelivery = 0;
                        $scope.statistics.totalDeliveries = 0;
                        $scope.statistics.totalItems = 0;
                        $scope.statistics.averageDeliverySpeedEvaluation = 0;
                        $scope.statistics.averageDriverEvaluation = 0;
                        $scope.statistics.maxDeliveryTime = 0;
                        $scope.statistics.minDeliveryTime = 0;
                        $scope.statistics.averageDeliveryTime = 0;
                        $scope.statistics.averageItemsPerDelivery = 0;

                        $scope.statistics.deliverySpeedEvaluation['1'] = 0;
                        $scope.statistics.deliverySpeedEvaluation['2'] = 0;
                        $scope.statistics.deliverySpeedEvaluation['3'] = 0;
                        $scope.statistics.deliverySpeedEvaluation['4'] = 0;
                        $scope.statistics.deliverySpeedEvaluation['5'] = 0;
                        $scope.statistics.driverEvaluation['1'] = 0;
                        $scope.statistics.driverEvaluation['2'] = 0;
                        $scope.statistics.driverEvaluation['3'] = 0;
                        $scope.statistics.driverEvaluation['4'] = 0;
                        $scope.statistics.driverEvaluation['5'] = 0;
                    }
                }
            }
        )
    };
    
    $scope.calculate();
    var getDataParams = function () {

        var dataParams = { access_token :$cookies.get('accessToken') },
            valCategory = $("[name=category]").val(),
            valBrand = $("[name=brand]").val(),
            valItem = $("[name=item]").val(),
            valDriver = $("[name=driver]").val(),
            valArea = $("[name=area]").val();

        if ($scope.selectPer === 'day') {
            dataParams.date = $scope.statisticDate;
        }

        if ($scope.selectPer !== 'day') {
            dataParams.date = $scope.startDate;
            dataParams.secondDate = $scope.endDate;
        }

        if ($scope.startTime !== undefined && $scope.endTime !== undefined) {
            dataParams.date = ($scope.startDate + ' ' + $scope.startTime);
            dataParams.secondDate = ($scope.endDate + ' ' + $scope.endTime);
        }

        if (valCategory !== "-1" && valBrand !== "All") {
            dataParams.category = valCategory;
        }

        if (valBrand !== "-1" && valBrand !== "?" && valBrand !== "All") {
            dataParams.item = valBrand;
        }

        if (valBrand !== "-1" && valBrand !== "?" && valBrand !== "All") {
            dataParams.item = valItem;
        }

        if (valDriver !== "-1") {
            dataParams.driver = valDriver;
        }

        if (valArea !== "-1") {
            dataParams.area = valArea;
        }

        return dataParams;
    };

    //retrieving data for order list
    $scope.getOrderList = function () {
        $scope.statisticFlag = 1;
        if ($scope.dataForOrderLists.length == 0) {
            var dataParams = getDataParams();
            getOrders.query(dataParams).$promise.then(
                function (data) {
                    $scope.dataForOrderLists = data.data;
                    //when coming this answer from the server - will displaying message
                    if (data.data.length == 0) {
                        $scope.statisticFlag = -1;
                        $scope.haveData = false;
                    }
                },
                function (error) {
                    if (error.statusText === 'Unauthorized') {
                        AuthService.logout();
                    }
                }
            )
        }        
    };
        
    $scope.recalculateWithFilter = function(){
        $scope.isFiltered = true;
        $scope.calculate();
    };

    //Clearing all filters then recalculate
    $scope.clearFilters = function(){
        $('#datepicker span').html('');
        $("[name=startTime]").val(''),
        $("[name=endTime]").val(''),
        $("[name=category]").val(''),
        $("[name=brand]").val(''),
        $("[name=item]").val(''),
        $("[name=driver]").val(''),
        $("[name=area]").val('');
        $scope.startDate = undefined;
        $scope.startTime = undefined;
        $scope.endDate = undefined;
        $scope.endTime = undefined;
        $scope.populateFiltersLists();
        $scope.isFiltered = false;
        $scope.calculate();
    };
});