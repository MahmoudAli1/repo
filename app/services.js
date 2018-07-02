angular.module('caravanServices', [])
    //get token
    .factory("getToken",
    function ($resource, appSettings) {
        return $resource(appSettings.link + 'staff/login',
            {},
            {
                login: {
                    method: 'POST'
                }
            }
        );
    })

    //get list of admins
    .factory("getListOfAdmins",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Staff/admins',
            {},
            {
                query: {
                    method: 'GET', 
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //get list of drivers
    .factory("getListOfDrivers",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Staff/drivers',
            {},
            {
                query: {
                    method: 'GET',                    
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //create Admin or Driver
    .factory("createStaff",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Staff',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //put data for Admin or Driver
    .factory("updateStaff",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Staff/:id?',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //delete Admin or Driver
    .factory("deleteStaff",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Staff/:id',
            {
                id: '@id'
            },
            {
                "delete": {
                    method: 'DELETE',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //get list of cars
    .factory("getListOfCars",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Car',
            {},
            {
                query: {
                    method: 'GET', 
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
        });
    })

    //create the New Car
    .factory("createCar",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Car', {}, {
            create: {
                method: 'POST',
                headers: {'Authorization': $cookies.get('accessToken')}
            }
        });
    })

    //put edited data for category of inventory
    .factory("updateCar",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Car/:id',
            {id: '@id'},
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //delete car
    .factory("deleteCar",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Car/:id',
            {id: '@id'},
            {
                "delete": {
                    method: 'DELETE',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //get list of the categories
    .factory("getListOfCategories",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Category',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // get a single category
    .factory("getCategory",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Category/:id',
            {
                id: '@id'
            },
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //create category
    .factory("createCategory",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Category',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //put edited data for category of inventory
    .factory("updateCategory",
    function ($resource, appSettings, $cookies)  {
        return $resource(appSettings.link + 'Category/:id',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //update item
    .factory("updateItem",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Item/:id',
            {
                id: '@id'
            },
            {update: {
                method: 'PUT',
                headers: {'Authorization': $cookies.get('accessToken')}
            }}
        );
    })

    //delete the category of inventory
    .factory("deleteCategory",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Category/:id',
            {
                id: '@id'
            },
            {
                "delete": 
                {
                    method: 'DELETE',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
        });
    })

    //get data for items List
    .factory("getItems",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Item',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //create new inventory
    .factory("createItem",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Item',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //delete the inventory
    .factory("deleteItem",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Item/:id',
            {
                id: '@id'
            },
            {
                "delete": {
                    method: 'DELETE',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
        });
    })

    //Get all areas and customers
    .factory("getAreasAndCustomers",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/users',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //Get all areas
    .factory("getAreas",
        function ($resource, appSettings, $cookies) {
            return $resource(appSettings.link + 'Area',
                {},
                {
                    query: {
                        method: 'GET',
                        headers: {'Authorization': $cookies.get('accessToken')}
                    }
                });
    })
    
    //create the New Area
    .factory("createArea",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })
    
    //create the New District
    .factory("createDistrict",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'District',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //get one area for edit it
    .factory("getArea",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/:id',
            {
                id: '@id'
            },
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get one district to edit it
    .factory("getDistrict",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'District/:id',
            {
                id: '@id'
            },
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //put edited area
    .factory("editArea",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/:id',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    // update district
    .factory("editDistrict",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'District/:id',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //delete area
    .factory("deleteArea",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/:id',
            {
                id: '@id'
            },
            {
                "delete": {
                    method: 'DELETE',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //activate area
    .factory("activateArea", 
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/:id/activate',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'PATCH',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //deactivate area
    .factory("deactivateArea",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/:id/deactivate',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'PATCH',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //sent to all in area
    .factory("sendToAllArea", 
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/:id/notifyAll',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })
      
    //send to eligable area
    .factory("sendToEligableArea",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Area/:id/notifyEligible',
            {
                id: '@id'
            },
            {
                update: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //get data for calculate statistic
    .factory("getStatisticsFilterData",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Statistics/filter',
            {},
            {
                query: {
                    method: 'GET',
                    cache: true,
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get data for calculate statistic
    .factory("getSubcategoryItemsWithName",
        function ($resource, appSettings, $cookies) {
            return $resource(appSettings.link + 'Category/:categoryId/subcategoryItems',
            {
                categoryId: '@categoryId'
            },
            {
                query: {
                    method: 'GET',                    
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get data for calculate statistic
    .factory("getSubcategoryItems",
        function ($resource, appSettings, $cookies) {
            return $resource(appSettings.link + 'Category/:categoryId/items',
            {
                categoryId: '@categoryId'
            },
            {
                query: {
                    method: 'GET',                    
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //calculate statistic
    .factory("getStatistics",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'statistics',
            {},
            {
                query: {
                    method: 'GET',                    
                    cache: true,
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get data for order list
    .factory("getOrders",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Order',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get data for customers List
    .factory("getCustomers",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Customer',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get customer orders
    .factory("getCustomerOrders",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Order/customer/:customerId',
            {
                customerId: '@customerId'
            },
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            }
        );
    })

    //get locations tree
    .factory("getCitiesTree",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'City/tree',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //create city
    .factory("createCity",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'City',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get all cities
    .factory("getCities",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'City',
            {},
            {
                query: {
                    method: 'GET',
                    cache: true,
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //get city's districts
    .factory("getCityDistricts",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'District/city/:cityId',
            {
                cityId: '@cityId'
            },
            {
                query: {
                    method: 'GET',
                    cache: true,
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // Create a new campaign
    .factory("createCampaign",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Campaign',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // get all campaigns
    .factory("getCampaigns",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Statistics/campaigns',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // get a single campaign
    .factory("getCampaign",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Campaign/:campaignId',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // update campaign
    .factory("editCampaign",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Campaign/:campaignId',
            {},
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // activate campaign
    .factory("activateCampaign",
    function ($resource, $cookies, appSettings) {
        return $resource(appSettings.link + 'Campaign/:id/activate',
            {
                id:'@id'
            },
            {
                update: { 
                    method: 'PATCH',
                    headers: {'Authorization': $cookies.get('accessToken')}
                 }
            });
    })

    // deactivate campaign
    .factory("deactivateCampaign",
    function ($resource, $cookies, appSettings) {
        return $resource(appSettings.link + 'Campaign/:id/deactivate',
            {
                id:'@id'
            },
            {
                update: { 
                    method: 'PATCH',
                    headers: {'Authorization': $cookies.get('accessToken')}
                 }
            });
    })

    // delete a user with the user id
    .factory("deleteCustomer",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Customer/:id',
            {
                id: '@id'
            },
            {
                delete: {
                    method: 'DELETE',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // get order items
    .factory("getOrderItems",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'order/:id/details',
            {
                id: '@id'
            },
            {
                query: {
                    method: 'GET',
                    cache: true,
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    //create new branch
    .factory("createBranch",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Branch',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
        });
    })

    //update a branch
    .factory("updateBranch",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Branch/:branch?',
            {
                branch: '@branch'
            },
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
        });
    })

    // delete a branch
    .factory("deleteBranch",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Branch/:branch',
            {
                branch: '@branch'
            },
            {
                delete: {
                    method: 'DELETE',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
        });
    })

    // Activate a branch
    .factory("activateBranch",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Branch/:branch/activate',
            {
                branch: '@branch'
            },
            {
                update: {
                    method: 'PATCH',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // deactivate a branch
    .factory("deactivateBranch",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Branch/:branch/deactivate',
            {
                branch: '@branch'
            },
            {
                update: {
                    method: 'PATCH',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // get branches of a category
    .factory("getBranchesOfCategory",
    function($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Branch/category/:categoryID',
            {
                categoryID: '@categoryID'
            },
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // get statistics items list
    .factory("getItemStatistics",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Statistics/items',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // get list of trips
    .factory("getTrips",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Trip',
            {},
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })
    
    // get a single trip
    .factory("getTrip",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Trip/:tripID',
            {
                tripID: '@tripID'
            },
            {
                query: {
                    method: 'GET',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // update a trip
    .factory("updateTrip", 
    function($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Trip/:tripID',
            {
                tripID: '@tripID'
            },
            {
                update: {
                    method: 'PUT',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // create a trip
    .factory("createTrip",
    function ($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Trip',
            {},
            {
                create: {
                    method: 'POST',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    // end trip
    .factory("endTrip",
    function($resource, appSettings, $cookies) {
        return $resource(appSettings.link + 'Trip/:tripID/end',
            {
                tripID: '@tripID'
            },
            {
                end: {
                    method: 'PATCH',
                    headers: {'Authorization': $cookies.get('accessToken')}
                }
            });
    })

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //update delivery cost
    .factory("updateDeliveryCost",
    function ($resource, appSettings) {
        var resource = $resource(appSettings.link + '/api/v1/deliveryCost?',
            {},
            {
                create: {method: 'POST'}
            }
        );
        return resource;
    })
    
    .factory("getListOfLocalizations",
    function ($resource, appSettings) {
        var resource = $resource(appSettings.link + '/api/v1/localizations?',
            {},
            {
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: false
                }
            });
        return resource;
    })

    .factory("postLocalization",
    function ($resource, appSettings)  {
        var resource = $resource(appSettings.link + '/api/v1/localization?',
            {},
            {update: {method: 'POST'}}
        );
        return resource;
    })

    .factory("putChangesForLocalization",
    function ($resource, appSettings)  {
        var resource = $resource(appSettings.link + '/api/v1/localization/:id?',
            {id: '@id'},
            {update: {method: 'PUT'}}
        );
        return resource;
    })

    .factory("deleteLocalization",
    function ($resource, appSettings)  {
        var resource = $resource(appSettings.link + '/api/v1/localization/:id?',
            {id: '@id'},
            {'delete': {method: 'DELETE'}}
        );
        return resource;
    });