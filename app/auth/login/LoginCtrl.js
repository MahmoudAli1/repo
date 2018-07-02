"use strict";

angular.module('app.auth').controller('LoginCtrl', function ($scope, $state, User) {}).controller('LoginMainController',
function ($scope, $state, getToken, $cookies) {
    if ($cookies.get('accessToken')) {
        $state.go('app.statistics.dashboard');
        return;
    }

    $scope.username = '';
    $scope.password = '';
    $scope.errorReport = '' ; 

    //receiving token
    $scope.receiveToken = function () {
        $scope.authError = false;
        var accessToken;
        var errorAlert = "";
        var gettingToken = function () {
            getToken.login({
                username: $scope.username,
                password: $scope.password
            }).$promise.then(
                function (response) {
                    accessToken = 'Bearer ' + response.Data.AccessToken;
                    var expireDate = {};
                    
                    if (angular.element('#staySignedIn')[0].checked) {
                        //setting the expiration date to be 69 days from login event
                        expireDate.expires = moment().add(69, 'days').format('ddd MMM DD YYYY HH:mm:ss Z').toString();
                    }
                    $cookies.put('accessToken', accessToken, expireDate);
                    localStorage.setItem('username', $scope.username);

                    $scope.authError = false;
                    $state.go('app.statistics.dashboard');
                },
                function (error) {
                    var errorMessage = error.data.error_description;
                        if (error.statusText === 'Unauthorized') {
                            $scope.authError = true;
                            
                            
                            
                        }
                        if (error.statusText === 'Bad Request') {
                            $scope.authError = true;
                           
                        }
                    
                }
            );
        };

        //data validation in email input elements
        var hasError = false; // flag for validation
        //create object for use construction: "for (in) {}"
        var emailInputsToCheck = {
            "#errorLoginEmail" : $scope.username
        };

        var errorMessageSelectorOfEmail;

        for (errorMessageSelectorOfEmail in emailInputsToCheck) {
            var $errorMessageEmail = $(errorMessageSelectorOfEmail); //select tag from DOM
            var inputValueEmail = emailInputsToCheck[errorMessageSelectorOfEmail];// take value of input

            utils.hideError($errorMessageEmail);// hide error
            if (utils.checkEmail(inputValueEmail) === false) { // if data in input not correct
                utils.displayError($errorMessageEmail); // display error
                hasError = true;// change flag for validation
            }
        }
        //data validation in pasword input elements
        //create object for use construction: "for (in) {}"
        var passwordInputsToCheck = {
            "#errorLoginPassword" : $scope.password
        };

        var errorMassageSelectorOfPassword;

        for (errorMassageSelectorOfPassword in passwordInputsToCheck) {
            var $errorMassagePassword = $(errorMassageSelectorOfPassword); //select tag from DOM
            var inputValuePassword = passwordInputsToCheck[errorMassageSelectorOfPassword];// take value of input

            utils.hideError($errorMassagePassword);// hide error
            if (utils.checkPassword(inputValuePassword) === false) { // if data in input not correct
                utils.displayError($errorMassagePassword); // display error
                hasError = true;// change flag for validation
            }
        }
        if (!hasError) { //if flag for validation == false
            $scope.errorReport= "invalid username or password";
            gettingToken();
        }
    };
});