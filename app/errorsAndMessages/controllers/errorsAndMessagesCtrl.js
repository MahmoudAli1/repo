

angular.module('app').controller('ModalInstanceErrorCtrl',
    function ($scope,
              $uibModalInstance,
              $location,
              message) {
        $scope.error = message;

        var flagForWindow = true;

        $scope.close = function () {
            $uibModalInstance.dismiss('close');

            if ($scope.error === "A new area was created!") {
                    //$location.path("/areas");
                flagForWindow = false;
            }
        };

        var changeLocation = function () {
            if ($scope.error === "A new area was created!" && flagForWindow === true) {
                $uibModalInstance.dismiss('close');
                //$location.path("/areas");
            }
        };
        setTimeout(changeLocation, 3000);

    })

    .controller('confirmDialogCtrl',
    function ($scope,
              $uibModalInstance,
              message) {

        $scope.message = message;

        $scope.confirm = function () {
            $uibModalInstance.close(
                {
                    result : true
                }
            );
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('close');
        };

        $scope.delete = function () {
            $uibModalInstance.close(
                {
                    result : true
                }
            );
        };

    })

    .run(function ($uibModal) { // launch the function "run", in order to get access to the object "$uibModal"
        // "onPositive" - function that will be called, if we have a positive response to the message (question)
        // "onNegative" - // - a negative response
        window.openConfirmDialog = function (message, onPositive, onNegative) {
            if (!message) { return; } // if there is no input parameter "message" - exit
            if (!onPositive && !onNegative) { return; }// if not available, and these two options - exit

            // open modal window
            var modalInstance = $uibModal.open({
                templateUrl: 'app/errorsAndMessages/views/confirmDialog.html',
                //windowClass: 'modalLogin',
                animation: true,
                controller: 'confirmDialogCtrl',
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            });

            var onClosed = function(dataFromModal) {
                if (dataFromModal.result === true) {
                    onPositive();
                } else {
                    onNegative();
                }
            };

            var onDismissed = function() {
                onNegative();
            };

            modalInstance.result.then(onClosed, onDismissed);
        };
    });

// =========================================================================

var utils = {
    checkNumbersInInput: function (numb) {
        //the first way of writing checks
        if (numb === undefined || numb <= 0 || numb === null) {
            return false;
        }
        return true;
    },

    checkTextInInput: function (text) {

        //first variant

        //if (text === undefined || text === '') {
        //
        //    return false;
        //}
        //return true;

        //the second way of writing checks
        return !(text === undefined || text === '');
    },

    checkEmail: function (mail) {

        var regForEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return !(mail === undefined || regForEmail.test(mail) === false || mail === '');
    },


    checkPassword: function (password) {

        var regForEmail = /^\S{6,16}$/;

        return !(password === undefined || regForEmail.test(password) === false || password === '');
    },

    confirmPassword: function (password, secondPassword) {

        return !(password !== secondPassword || secondPassword === '' || secondPassword === undefined);
    },


    displayError: function (errorTextElement, textOfError) {
        errorTextElement.removeClass("error-text-hidden").addClass("error-text-input");

        if (textOfError) { //
            errorTextElement.text(textOfError)
        }
    },

    hideError: function (errorTextElement) {
        errorTextElement.removeClass("error-text-input").addClass("error-text-hidden");
    }
};
