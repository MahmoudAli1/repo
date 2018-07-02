(function(){
    angular.module('ngLoadingSpinner', ['angularSpinner'])
    .directive('usSpinner',   ['$http', '$rootScope' ,function ($http, $rootScope){
        
        var showDelay = 500, timer;
        
        return {
            link: function (scope, elm, attrs) {
                $rootScope.spinnerActive = false;
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (loading) {
                    $rootScope.spinnerActive = loading;
                    if (loading) {
                        if (!timer) {
                            timer = setTimeout(function() {
                                elm.removeClass('ng-hide');
                                timer = false;
                            }, showDelay);
                        }
                    } else {
                        if (timer) {
                            clearTimeout(timer);
                            timer = false;
                        }
                        elm.addClass('ng-hide');
                    }
                });
            }
        };

    }]);
}).call(this);
