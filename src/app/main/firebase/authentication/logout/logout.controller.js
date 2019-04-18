(function () {
    'use strict';
    angular.module('app.firebase').controller('LogoutController', LogoutController);
    /** @ngInject */
    function LogoutController($scope, $state, store, ref, $window, data) {
        var vm = this;
        $scope.signOut = function () {
            firebase.auth().signOut().then(function () {
                //console.log("logout succes");
                $scope.showToast('logout_succes');
                ref.user = undefined;
                $state.go('app.login');
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log(errorCode + " : " + errorMessage);
                console.log(credential);
                if (errorCode == "auth/network-request-failed") {
                    $scope.showToast("logout_network_request_failed");
                }
                else {
                    $scope.showToast(errorCode + " : " + errorMessage);
                }
            });
        }
        $scope.goBack = function () {
            $window.history.back();
        }
    }
})();