'use strict';

angular.module('app').directive('dropZone', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/_common/dropZone/dropZone.html',
        controller: function($scope){
            $scope.dropzoneConfig = {
                'options': { // passed into the Dropzone constructor
                    'url': '/api/dropzone',
                    'maxFilesize': 2, // MB
                    'maxFiles': 1,
                    'uploadMultiple': false,
                    'addRemoveLinks': true,
                    'drop': function (file) {
                    },
                    'addedFile': function (file) {

                    },
                    'accept': function (file) {
                        $scope.photoErrorMessage = null;
                        // Setting the uploaded image to category picture module
                        $scope.picFile = file;
                        // Call the default success event handler
                        if(!$scope.imageToEdit) this.emit("success", file);
                        // And optionally show the thumbnail of the file:
                        this.emit("complete", file);

                        // If you use the maxFiles option, make sure you adjust it to the
                        // correct amount:
                        var existingFileCount = 1; // The number of files already uploaded
                        this.options.maxFiles = this.options.maxFiles - existingFileCount;
                    },
                    'processing': function (file) {
                    },
                    'sending': function (file) { 
                    },
                    'init': function () {
                        //adding image when editting an object like category or car
                        if($scope.imageToEdit) {
                            var mockFile = { name: "currentImage", type: 'image/jpeg' };
                            this.addFile.call(this, mockFile);
                            this.options.thumbnail.call(this, mockFile, $scope.imageToEdit);
                        }
                    }
                },
                'eventHandlers': {
                    'maxfilesexceeded' : function (file) {
                        
                    },
                    'error': function (file, errorMessage) {
                        console.error('Error: ', errorMessage);

                        $scope.errorOccured = true;
                        $scope.photoErrorMessage = errorMessage;
                        this.removeFile(file);
                        //reset flag
                        $scope.errorOccured = false;
                    },
                    'success': function (file, response) {
                    },
                    'removedfile': function (file) {
                        // Reset category picture module
                        $scope.picFile = null;
                        $scope.imageToEdit = null;

                        if(this.options.maxFiles == 0 &&  !$scope.errorOccured){
                            this.options.maxFiles = this.options.maxFiles + 1;
                            $scope.photoErrorMessage = null;
                        }
                    },
                }
            };
        }
    }
});
