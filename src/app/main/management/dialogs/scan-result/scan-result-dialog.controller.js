(function () {
    'use strict';
    angular.module('app.management').controller('ScanResultDialogController', ScanResultDialogController);
    /** @ngInject */
    function ScanResultDialogController($mdDialog, status, scannedUser, $timeout, $filter, $mdToast) {
        var vm = this;
        var $translate = $filter('translate');
        // Data
        vm.status = status;
        vm.scannedUser = scannedUser;
        console.log('vm.status', vm.status);
        console.log('vm.scannedUser', vm.scannedUser);
       
        // Methods
        vm.closeDialog = closeDialog;
        //////////


        function closeDialog() {
            $mdDialog.hide();
        }

    }
})();