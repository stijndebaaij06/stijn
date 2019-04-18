(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, store, data, $timeout, $mdToast, $filter, $state, ref, mainFactory)
    {
        // Create refs for easy access
        ref.db = firebase.firestore();
        // ref.db.settings({timestampsInSnapshots: true});
        
        // Variable initialization
        var $translate = $filter('translate');
        data.loadState = $state.current.name;
        if ($scope.loadState == 'app.login' || $scope.loadState == 'app.resetpassword') {
            $scope.loadState = 'app.management';
        }
        $scope.ui = new firebaseui.auth.AuthUI(firebase.auth());
        
        // Instant functions
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                console.log("user signed in");
                ref.user = ref.db.collection("users").doc(user.uid);
                var communityId = store.get('communityId');
                var organisationId = store.get('organisationId');
                // console.log(communityId, organisationId);
                if (organisationId && communityId) {
                    mainFactory.selectCommunity(communityId);
                    mainFactory.selectOrganisation(organisationId);
                }
                else if (communityId)  {
                    mainFactory.selectCommunity(communityId);
                    // $state.go('app.select-entity');
                }
                else {
                    //Select entity if none is selected
                    $state.go('app.select-entity');
                    $rootScope.$broadcast('msSplashScreen::remove');
                }
                // $state.go('app.select-entity');
                $rootScope.$broadcast('msSplashScreen::remove');
            } else {
                $rootScope.$broadcast('msSplashScreen::remove');
                store.remove('paymentFinished');
                store.remove('communityId');
                store.remove('organisationId');
                data.toolbar = {
                    title: 'Management'
                };
                console.log("user not signed in");
                $state.go('app.login');
            }
        });
        
        // Called functions
        $scope.showToast = function (msg, duration) {
            //custom function to show a toast with translations
            if (!duration) duration = 4000;
            $mdToast.show($mdToast.simple().textContent($translate(msg)).hideDelay(duration).toastClass('toast'));
        };
    }
})();