(function () {
    'use strict';
    angular.module('app.firebase').controller('SignInSuccessController', SignInSuccessController);
    /** @ngInject */
    function SignInSuccessController($scope, $state, store, $window, ref, homeService) {
        var vm = this;
        console.log("enter signinsuccess");
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                console.log("user sign in success");
                console.log("user", user)
                ref.userRef = ref.db.collection("users").doc(user.uid);
                registerMainForm.userRef.get().then(function (snapshot) {
                    if (snapshot.exists) {
                        $state.go('app.home');
                    }
                    else {
                        //create user data, then should trigger onSnapshot so it loads anyway.
                        ref.userRef.set({
                            email: firebase.auth().currentUser.email
                        }).then(function () {
                            console.log("Document successfully set!");
                            $state.go('app.home');
                        })
                    }
                });
            }
        });
    }
})();