(function () {
    'use strict';
    angular.module('app.management').controller('ScanResultDialogController', ScanResultDialogController);
    /** @ngInject */
    function ScanResultDialogController($mdDialog, checkIn, newEntry, $timeout, $mdToast, $filter, ref, $q) {
        var vm = this;
        var $translate = $filter('translate');
        // Data
        vm.newItem = newEntry;
        vm.loading = true;

        function init(manualChange) {
            vm.loading = true;
            checkIn.ref.get().then(function (doc) {
                var checkIn = doc.data();
                checkIn.userRef.get().then(function (doc) {
                    var userData = doc.data();
                    userData.id = doc.id;
                    if (manualChange) {
                        vm.getStatus(userData).then(status => {
                            // console.log('status', status);
                            console.log('checkIn.status', checkIn.status);
                            checkIn.ref.set({status: status}, {merge:true}).then(function () {
                                vm.showToast('status_updated');
                                init();
                            });
                        });
                    } else {
                        $timeout(function () {
                            checkIn.status.message = $translate(checkIn.status.desc); 
                            vm.checkIn = checkIn;
                            vm.loading = false;
                            console.log('vm.checkIn', vm.checkIn);
                        });
                    }
                })
            })
        }
       
        // Called Methods
        vm.closeDialog = function () {
            $mdDialog.hide();
        }

        vm.showToast = function (msg, duration) {
            //custom function to show a toast with translations
            if (!duration) duration = 4000;
            $mdToast.show($mdToast.simple().textContent($translate(msg)).hideDelay(duration).toastClass('toast'));
        };

        vm.toggleAccess = function () {
            var toggleValue = true;
            var toggleDate;
            // var status;
            if (vm.checkIn.status.desc == 'user_blocked') toggleValue = false;
            if (toggleValue) toggleDate = new Date();
            if (!toggleValue) toggleDate = firebase.firestore.FieldValue.delete();
            // if (toggleValue) {
            //     status = {
            //         status: {
            //             code: 2
            //             , desc: 'user blocked'
            //         }
            //     }
            // } else {
            //     status = {
            //         status: {
            //             code: 0
            //             , desc: 'success'
            //         }
            //     }
            // }
            
            ref.organisation.collection('users').doc(vm.checkIn.userRef.id).set({accessDenied: toggleValue, denyDate: toggleDate}, {merge: true}).then(function () {
                init(true);
            });
        }

        vm.checkedAddress = function () {
            ref.organisation.collection('users').doc(vm.checkIn.userRef.id).set({lastAddressCheck: firebase.firestore.FieldValue.serverTimestamp()}, {merge: true}).then(function () {
                init(true);
            });
        }

        vm.getStatus = function (userData) {
            
            return $q(function (resolve, reject) {
                var status = {};
                //status.code, 0=OK, 1=CHECK, 2=BLOCK
                //status.desc = 'additional info to tell the user'
                //TODO: RED, check for blocked status!
                console.log('processScannedUser userData', userData);
                if (!userData.address) {
                    //userData incomplete, ORANGE status!
                    status.code = 1;
                    status.desc = 'no_user_address';
                    console.log('processScannedUser no address');
                    return resolve(status);
                    // vm.setCheckIn(status, userData).then(checkInObj => {
                    //     console.log('checkInObj', checkInObj);
                    //     return resolve(checkInObj);
                    // })
                }else{
                    var orgUserRef = ref.organisation.collection('users').doc(userData.id);
                    orgUserRef.get().then(doc => {
                        if (!doc.exists) {
                            //user doesnt exist, ORANGE status
                            console.log('processScannedUser no org userdata');
                            //TODO: check address
                            status.code = 1;
                            status.desc = 'check_user_address';
                            return resolve(status);
                        } else {
                            var orgUserDoc = doc.data();
                            console.log('processScannedUser orgUserDoc', orgUserDoc);
                            if (orgUserDoc.accessDenied) {
                                status.code = 2;
                                status.desc = 'user_blocked';
                                return resolve(status);
                                //status BLOCK
                            }
                            var shouldCheck = false;
                            if (orgUserDoc.lastAddressCheck && userData.lastAddressChange) {
                               //both exist
                                if(orgUserDoc.lastAddressCheck.toDate() < userData.lastAddressChange.toDate()){
                                    shouldCheck = true; //changed after last check, manual check.
                                }
                            } else {
                                shouldCheck = true; //couldn't verify, manual check.
                            }
                            if(shouldCheck){
                                status.code = 1;
                                status.desc = 'check_user_address';
                                return resolve(status);
                            }else{
                                status.code = 0;
                                status.desc = 'success';
                                return resolve(status);
                            }
                        }
                    })
                }
                
            });
        }

        init();
    }
})();