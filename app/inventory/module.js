"use strict";

angular.module('app.inventory', ['ui.router'])
.config(function ($stateProvider) {
    $stateProvider
        .state('app.inventory', {
            abstract: true,
            url: '/inventory',
            data: {
                title: 'Inventory'
            }
        })
        .state('app.inventory.categories', {
            url: '/categories',
            data: {
                title: 'Categories'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/categories.html',
                    controller: 'CategoriesController',
                    resolve: {
                        categories: function(AuthService, getListOfCategories){
                            return getListOfCategories.query({}).$promise.then(
                                function (response) {
                                    return response.Data;
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
                }
            }
        })
        .state('app.inventory.createCategory', {
            url: '/createCategory',
            data: {
                title: 'Create Category'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/createCategory.html',
                    controller: 'CreateCategoryController'
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.inventory.editCategory', {
            url: '/editCategory',
            params: {
                category: null
            },
            data: {
                title: 'Edit Category'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/editCategory.html',
                    controller: 'EditCategoryController',
                    resolve: {
                        category: function($state, $stateParams){
                            if(!$stateParams.category) $state.go('app.inventory.categories');
                            return $stateParams.category;
                        }
                    }
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.inventory.subcategories', {
            url: '/:categoryId/subcategories',
            data: {
                title: 'Subcategories'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/subcategories.html',
                    controller: 'SubcategoriesController',
                    resolve: {
                        subcategories: function($stateParams, getCategory){
                            return getCategory.query({id: $stateParams.categoryId}).$promise.then(
                                function (response) {
                                    return response.Data.Subcategories;
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
                }
            }
        })
        .state('app.inventory.createSubcategory', {
            url: '/createSubcategory',
            data: {
                title: 'Create Subcategory'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/createSubcategory.html',
                    controller: 'CreateSubcategoryController',
                    resolve: {
                        categories: function(AuthService, getListOfCategories){
                            return getListOfCategories.query({}).$promise.then(
                                function (response) {
                                    return response.Data;
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
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.inventory.editSubcategory', {
            url: '/editSubcategory',
            params: {
                subcategory: null
            },
            data: {
                title: 'Edit Subcategory'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/editSubcategory.html',
                    controller: 'EditSubcategoryController',
                    resolve: {
                        subcategory: function($state, $stateParams){
                            if(!$stateParams.subcategory) $state.go('app.inventory.categories');
                            return $stateParams.subcategory;
                        }
                    }
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.inventory.items', {
            url: '/items/:subcategoryId',
            data: {
                title: 'Subcategory Items'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/items.html',
                    controller: 'ItemsController',
                    resolve: {
                        subcategory: function($stateParams, getSubcategoryItems){
                            return getSubcategoryItems.query({categoryId: $stateParams.subcategoryId}).$promise.then(
                                function (response) {
                                    return response.Data;
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
                }
            }
        })
        .state('app.inventory.createCategoryItem', {
            url: '/createCategoryItem',
            data: {
                title: 'Create Item'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/createCategoryItem.html',
                    controller: 'CreateCategoryItemController',
                    resolve: {
                        categories: function(AuthService, getListOfCategories){
                            return getListOfCategories.query({}).$promise.then(
                                function (response) {
                                    return response.Data;
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
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.inventory.createSubcategoryBranch', {
            url: '/createSubcategoryBranch',
            data: {
                title: 'Create Branch'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/createSubcategoryBranch.html',
                    controller: 'CreateSubcategoryBranchController',
                    resolve: {
                        categories: function(AuthService, getListOfCategories){
                            return getListOfCategories.query({}).$promise.then(
                                function (response) {
                                    return response.Data;
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
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.inventory.editCategoryItem', {
            url: '/editItem',
            params: {
                item: null
            },
            data: {
                title: 'Edit Item'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/editCategoryItem.html',
                    controller: 'EditCategoryItemController',
                    resolve: {
                        item: function($state, $stateParams){
                            if(!$stateParams.item) $state.go('app.inventory.categories');
                            return $stateParams.item;
                        }
                    }
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })
        .state('app.inventory.branches', {
            url: '/subcategories/:subCategory/branches',
            data: {
                title: 'Branches'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/branches.html',
                    controller: 'BranchesController',
                    resolve: {
                        branches: function($stateParams, AuthService, getBranchesOfCategory) {
                            return getBranchesOfCategory.query(
                                {
                                    categoryID: $stateParams.subCategory,
                                }).$promise.then(
                                    function (response) {
                                        return response.Data;
                                    },
                                    function (error) {
                                        console.error(error);
                                        if (error.statusText === 'Unauthorized') {
                                            AuthService.logout();
                                        }
                                        else if(error.statusText == 'Not Found'){
                                            alert("there is no branches for this subcategory");
                                        }
                                    }
                                );
                        }
                    }
                }
            }
        })
        .state('app.inventory.editBranch', {
            url: '/editBranch',
            params: {
                branch: null,
                subCategoryId: null
            },
            data: {
                title: 'Edit Branch'
            },
            views: {
                "content@app": {
                    templateUrl: 'app/inventory/views/editBranch.html',
                    controller: 'EditBranchController',
                    resolve: {
                        branch: function($state, $stateParams){
                            if(!$stateParams.branch) $state.go('app.inventory.branches');
                            return $stateParams.branch;
                        }
                    }
                }
            },
            resolve: {
                scripts: function(lazyScript){
                    return lazyScript.register('build/vendor.ui.js')
                }
            }
        })        
});
