(function () {
    'use strict';
    angular.module('app.firebase').controller('ResetPassController', ResetPassController);
    /** @ngInject */
    function ResetPassController($scope, $timeout, $state) {
        var vm = this;
        $scope.resetEmailPass = function () {
            var email = $scope.vm.form.email;
            var auth = firebase.auth();
            auth.sendPasswordResetEmail(email).then(function () {
                $analytics.eventTrack('passResetSuccess');
                $scope.showToast("password_reset_send", 10000);
                console.log("reset email sent!");
                $state.go('app.login');
                // Email sent.
            }, function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log(errorCode + " : " + errorMessage);
                console.log(credential);
                if (errorCode == "auth/network-request-failed") {
                    $scope.showToast("password_reset_network_request_failed");
                }
                else if (errorCode == "auth/invalid-email" || errorCode == "auth/user-not-found") {
                    $scope.showToast("password_reset_invalid_email");
                }
                else {
                    $scope.showToast("password_reset_failed");
                    $analytics.eventTrack('passResetFailure');
                }
                console.log("something went wrong while resetting password!");
                // An error happened.
            });
        }
    }
})();