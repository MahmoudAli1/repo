'use strict';

angular.module('app.statistics').controller('ItemsListController', function ($scope, $state, $compile, items, getItems, $cookies, AuthService) {
    $scope.items = items.data;

    //The columns of the table sorted with order.
    $scope.tableOptions =  {
        "data": items,
        "order": [0, 'desc'],
        "iDisplayLength": 25,
        "columns": [
            
            { 
                "data": "Name" 
            },
            { 
                "data": "CategoryName"
            },
            { 
                "data": "Cost" 
            },
            { 
                "data": "Price"
            },
            { 
                "data": "ViewCount",
            },
            { 
                "data": "RepeatedPurchaseCount",
            },
            { 
                "data": "PurchaseCount",
            },
            { 
                "data": "Profit",
            }

        ]
    };
    $scope.tableOptions.fnCreatedRow = function( nRow, aData, iDataIndex ) {
        $compile(nRow)($scope);
    }

    // To check if the toggle for including test Items or not.
    var includingTestItems = true;
    $scope.AddOrRemoveTestingItems = function() {

        // Changing the color of the button.
        $(function() {
            if(includingTestItems){
                $('#toggleTestingItems').addClass('btn-success').removeClass('btn-danger');
            }
            else {
                 $('#toggleTestingItems').addClass('btn-danger').removeClass('btn-success');
            }     
        });

        (function(){
            var newItems = getItems.query({
            access_token: $cookies.get('accessToken'),
            testing: includingTestItems
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
            return newItems;
        })().then(function(items){
            $scope.Items = items.data;
            $scope.updateDataTabl(items.data);
        }, function(error){
            console.log(error);
        });
        includingTestItems = !includingTestItems;
    }

    $scope.updateDataTabl = function(newData){
        var dataTable = angular.element("#DataTables_Table_0").dataTable().api();
        dataTable.clear();
        dataTable.rows.add(newData);
        dataTable.draw();
        console.log("the data table has been updated");
    };
});