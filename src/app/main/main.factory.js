(function () {
    'use strict';
    angular.module('app.toolbar').factory('mainFactory', factory);
    /** @ngInject */
    function factory($mdDialog, $q, ref, data, store, $rootScope, $timeout, $state) {
        var storageRef = firebase.storage().ref();
        
        function openDialog(template, controller, ev, fullscreen, clickOutsideToClose, params, vm) {
            //ev = '';
            var deferred = $q.defer();
            var promise = deferred.promise;
            $mdDialog.show({
                locals: {
                    vm: vm //send viewmodel to dialogcontroller
                    , params: params //send variables to dialogcontroller
                }
                , controller: controller
                , templateUrl: template
                , targetEvent: ev
                , parent: angular.element(document.body)
                , clickOutsideToClose: clickOutsideToClose
                , escapeToClose: clickOutsideToClose
                , fullscreen: fullscreen
            }).catch(function (err) {
                console.log('err', err);
            }).then(function (action) {
                //console.log("action", action);
                deferred.resolve(action);
                //call promise.success to return successfull callback
            })
            , function (err) {
                console.log("err", err);
                deferred.reject('error'); //call promise.error to return error to callback
            };
            
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }

        function uploadImage(storageURL, imageDataUrl, imageType) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            console.log('upload');
            if (imageType == 'image/jpeg' || imageType == 'image/png' || imageType == 'image/svg+xml') {
                imageDataUrl = imageDataUrl.replace("data:image/jpeg;base64,", "");
                imageDataUrl = imageDataUrl.replace("data:image/png;base64,", "");
                imageDataUrl = imageDataUrl.replace("data:image/svg+xml;base64,", "");
                var uploadTask = storageRef.child(storageURL).putString(imageDataUrl, 'base64', {
                    contentType: imageType
                });
                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                    function (snapshot) {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                        }
                    }
                    , function (error) {
                        switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                        }
                        deferred.reject('error');
                    }
                    , function () {
                        // Upload completed successfully, now we can get the download URL
                        console.log('Upload finished');
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        deferred.resolve(downloadURL);
                    });
            }
            else {
                alert("Sorry, currently only JPG, PNG and SVG files are allowed.");
                deferred.reject('error');
            }
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
        
        function selectCommunity(communityId) {
            ref.community = ref.db.collection('/communities/').doc(communityId);
            store.set('communityId', communityId);
            ref.community.onSnapshot(function (doc) {
                if (doc.exists) {
                    var community = doc.data();
                    $timeout(function() {
                        $rootScope.$broadcast('msSplashScreen::remove');
                    }, 100);
                }
                else {
                    store.remove('communityId');
                    //$state.go('app.select-community');
                    $rootScope.$broadcast('msSplashScreen::remove');
                }
            })
        }
        
        function deselectCommunity() {
            ref.community = undefined;
            store.remove('communityId');
        }
        
        function selectOrganisation(organisationId) {
            ref.organisation = ref.community.collection('/organisations/').doc(organisationId);
            store.set('organisationId', organisationId);
            ref.organisation.onSnapshot(function (doc) {
                if (doc.exists) {
                    var organisation = doc.data();
                    $timeout(function() {
                        $rootScope.$broadcast('msSplashScreen::remove');
                    }, 100);
                }
                else {
                    store.remove('communityId');
                    //$state.go('app.select-organisation');
                    $rootScope.$broadcast('msSplashScreen::remove');
                }
            })
        }
        
        function deselectOrganisation() {
            ref.organisation = undefined;
            store.remove('organisationId');
        }
        return {
            //show advanced dialog with template & callback support on selected actions.
            openDialog: openDialog
            , uploadImage: uploadImage
//            , selectEntity: selectEntity
            , selectCommunity: selectCommunity
            , deselectCommunity: deselectCommunity
            , selectOrganisation: selectOrganisation
            , deselectOrganisation: deselectOrganisation
        }
    }
})();