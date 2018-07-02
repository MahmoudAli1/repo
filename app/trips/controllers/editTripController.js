'use strict';

angular.module('app.trips').controller('EditTripController', 
function (AuthService, $scope, $state, trip, cars, drivers, cityTree, categoryTree, updateTrip) {
    $scope.tripAreas = trip.Areas;
    $scope.tripItems = trip.TripItems;
    $scope.tripBranches = trip.TripItems.filter(ti => ti.PickUpBranch).map(ti => ti.PickUpBranch);

    $('#datepicker_trip span').html(moment(trip.StartAt).format('MMMM D, YYYY HH:mm A'));

    $(function() {  
        $('#datepicker_trip').daterangepicker({ 
            minDate: moment(),
            timePicker: true,
            singleDatePicker: true,
            startDate: moment(trip.StartAt)
        }, function(start) {
            $('#datepicker_trip span').html(start.format('MMMM D, YYYY HH:mm A'));
            var element = angular.element($('#datepicker_trip'));
            var scope = element.scope();
            scope.startDate = trip.StartDate ? null : trip.StartDate.format('YYYY-MM-DD HH:mm A');

            $scope.$apply(function(){
                scope.startDate = start.utc().format('YYYY-MM-DD HH:mm A');
            });
        });
    })

    $scope.listOfCars = cars;
    $scope.listOfCars.unshift({
        ID: -1,
        Name: "--Select a car--"
    });
    var selectedCar = cars.find(c => c.ID == trip.CarID);
    $scope.carSelect = {
        availableOptions: $scope.listOfCars,
        selectedOption: {
            ID: selectedCar.ID,
            Name: selectedCar.Name
        }
    }

    $scope.listOfDrivers = drivers;
    $scope.listOfDrivers.unshift({
        ID: -1,
        Name: "--Select a driver--"
    });
    var selectedDriver = drivers.find(d => d.Id == trip.DriverID);
    $scope.driverSelect = {
        availableOptions: $scope.listOfDrivers,
        selectedOption: {
            Id: selectedDriver.Id,
            Name: selectedDriver.Name
        }
    }

    $scope.listOfCities = cityTree;
    $scope.listOfCities.unshift({
        ID: -1,
        Name: "--Select a city--"
    });

    $scope.citySelect = {
        availableOptions: $scope.listOfCities,
        selectedOption: {
            ID: $scope.listOfCities[0].ID,
            Name: $scope.listOfCities[0].Name
        }
    }

    $scope.getCityDistricts = function() {
        if($scope.citySelect.selectedOption.ID !== -1) {
            $scope.listOfDistricts = $scope.listOfCities.find(c => c.ID == $scope.citySelect.selectedOption.ID).Districts;
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
        } else {
            //Reset districts select values
            $scope.districtSelect.availableOptions = null;
        }
    }

    $scope.getDistrictAreas = function() {
        if($scope.districtSelect.selectedOption.ID !== -1) {
            $scope.listOfAreas = $scope.listOfDistricts.find(d => d.ID == $scope.districtSelect.selectedOption.ID).Areas;
            $scope.listOfAreas.unshift({
                ID: -1,
                Name: "--Select an area--"
            });
            $scope.areaSelect = {
                availableOptions: $scope.listOfAreas,
                selectedOption: {
                    ID: $scope.listOfAreas[0].ID,
                    Name: $scope.listOfAreas[0].Name
                }
            };
        } else {
            //Reset districts select values
            $scope.districtSelect.availableOptions = null;
        }
    }
    
    $scope.addArea = function () {
        if($scope.areaSelect.selectedOption.ID != -1 && !$scope.tripAreas.find(a => a.ID == $scope.areaSelect.selectedOption.ID)) {
            $scope.tripAreas.push($scope.areaSelect.selectedOption);
        }
    }

    $scope.removeArea = function(areaID) {
        $scope.tripAreas = $scope.tripAreas.filter(a => a.ID !== areaID);
    }

    $scope.listOfCategories = categoryTree;
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

    $scope.getCategorySubcategories = function() {
        if($scope.categorySelect.selectedOption.ID !== -1) {
            $scope.listOfSubcategories = $scope.listOfCategories.find(c => c.ID == $scope.categorySelect.selectedOption.ID).Subcategories;
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
            };
        } else {
            //Reset districts select values
            $scope.subcategorySelect.availableOptions = null;
        }
    }

    $scope.getSubcategoryItemsAndBranches = function() {
        if($scope.subcategorySelect.selectedOption.ID !== -1) {
            var subcategory = $scope.listOfSubcategories.find(d => d.ID == $scope.subcategorySelect.selectedOption.ID);
            $scope.listOfItems = subcategory.Items;
            $scope.listOfItems.unshift({
                ID: -1,
                EnglishName: "--Select an item--"
            });
            $scope.itemSelect = {
                availableOptions: $scope.listOfItems,
                selectedOption: {
                    ID: $scope.listOfItems[0].ID,
                    EnglishName: $scope.listOfItems[0].EnglishName
                }
            };

            // Check if this subcategory has a category already
            var subCategoryBranch = $scope.tripBranches.find(b => b.CategoryID == subcategory.ID);
            
            $scope.listOfBranches = subcategory.Branches;
            $scope.listOfBranches.unshift({
                ID: -1,
                Name: "--Select a branch--"
            });
            $scope.branchSelect = {
                availableOptions: $scope.listOfBranches,
                selectedOption: {
                    ID: subCategoryBranch ? subCategoryBranch.ID : $scope.listOfBranches[0].ID,
                    Name: subCategoryBranch ? subCategoryBranch.Name : $scope.listOfBranches[0].Name
                }
            };
        } else {
            //Reset districts select values
            $scope.subcategorySelect.availableOptions = null;
        }
    }

    $scope.addBranch = function() {
        var subCategoryBranch = $scope.tripBranches.find(b => b.CategoryID == $scope.branchSelect.selectedOption.CategoryID);
        if($scope.branchSelect.selectedOption.ID != -1) {
            if(subCategoryBranch) {
                $scope.tripBranches = $scope.tripBranches.filter(b => b.ID !== subCategoryBranch.ID);
            }
            $scope.tripBranches.push($scope.branchSelect.selectedOption);            
        }
    }

    $scope.addItem = function () {
        if($scope.itemSelect.selectedOption.ID != -1 && !$scope.tripItems.find(ti => ti.ItemID == $scope.itemSelect.selectedOption.ID)) {
            $scope.itemSelect.selectedOption.SuggestedQuantity = 1;
            $scope.tripItems.push($scope.itemSelect.selectedOption);
        }
    }

    $scope.removeItem = function(itemID) {
        $scope.tripItems = $scope.tripItems.filter(ti => ti.ItemID !== itemID);
    }

    $scope.updateTrip = function () {
        var suggestedItems = [];
        for(var index = 0; index < $scope.tripItems.length; index++) {
            var tripItem = $scope.tripItems[index];
            var itemID = tripItem.Item ? tripItem.ItemID : tripItem.ID;
            var categoryID = tripItem.Item ? tripItem.Item.CategoryID : tripItem.CategoryID
            var branch = $scope.tripBranches.find(b => b.CategoryID == categoryID);
            suggestedItems.push({
                ItemID: itemID,
                Quantity: $('#suggestedQuantity' + itemID).val(),
                BranchID: branch ? branch.ID : null,
            });
        }
        
        var updatedTrip = {
            startDate: $scope.startDate ? $scope.startDate : trip.StartAt,
            carID: $scope.carSelect.selectedOption.ID,
            driverID: $scope.driverSelect.selectedOption.Id,
            areaIDs: $scope.tripAreas.map(a => a.ID),
            suggestedItems
        }

        updateTrip.update({tripID: trip.ID}, updatedTrip).$promise.then(
            function(response) {
                $state.go('app.trips.allTrips')
            },
            function (error) {
                if (error.statusText === 'Unauthorized') {
                    AuthService.logout();
                }
            }
        );
    }
});