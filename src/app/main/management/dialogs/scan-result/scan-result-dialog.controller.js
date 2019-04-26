(function () {
    'use strict';
    angular.module('app.management').controller('ScanResultDialogController', ScanResultDialogController);
    /** @ngInject */
    function ScanResultDialogController($mdDialog, checkIn, newEntry, $timeout, $filter, ref) {
        var vm = this;
        var $translate = $filter('translate');
        // Data
        vm.newItem = newEntry;
        vm.loading = true;

        function init() {
            vm.loading = true;
            checkIn.ref.get().then(function (doc) {
                $timeout(function () {
                    var checkIn = doc.data();
                    checkIn.status.message = $translate(checkIn.status.desc); 
                    vm.checkIn = checkIn;
                    vm.loading = false;
                    console.log('vm.checkIn', vm.checkIn);
                });
            })
        }
       
        // Called Methods
        vm.closeDialog = function () {
            $mdDialog.hide();
        }

        vm.toggleAccess = function () {
            var toggleValue = true;
            var toggleDate;
            var status;
            if (vm.checkIn.status.desc == 'user blocked') toggleValue = false;
            if (toggleValue) toggleDate = new Date();
            if (!toggleValue) toggleDate = firebase.firestore.FieldValue.delete();
            if (toggleValue) {
                status = {
                    status: {
                        code: 2
                        , desc: 'user blocked'
                    }
                }
            } else {
                status = {
                    status: {
                        code: 0
                        , desc: 'success'
                    }
                }
            }
            

            var batch = ref.db.batch();
            batch.set(ref.organisation.collection('users').doc(vm.checkIn.userRef.id), {accessDenied: toggleValue, denyDate: toggleDate}, {merge: true});
            batch.set(vm.checkIn.ref, status, {merge: true});
            batch.commit().then(function () {
                init();
            });
            // ref.organisation.collection('users').doc(vm.checkIn.userRef.id).set({accessDenied: toggleValue, denyDate: toggleDate}, {merge: toggleValue});
            // $mdDialog.hide();
        }

        vm.checkAddress = function () {
            $mdDialog.hide();
        }

        init();
    }
})();