(function () {
    'use strict';
    angular.module('app.firebase').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($scope, $state, store, $window, ref, data, $stateParams, $location) {
        var vm = this;
        
        // Instant functions
        firebase.auth().onAuthStateChanged(function (user) {
            if ($stateParams.instaLogout) {
                if (user) {
                    firebase.auth().signOut().then(function () {
                        console.log("logout succes");
                        ref.user = undefined;
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
            }
            $location.url($location.path());
            console.log('url params cleared');
        });
        
        var uiConfig = {
            signInFlow: 'redirect'
            , signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID, 
//          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID, 
//          firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ]
            , // Terms of service url.
            tosUrl: 'https://wemaron.nl/privacy-terms-ge/'
            ,callbacks: {
               signInSuccess: function(currentUser, credential, redirectUrl) {
                console.log('sign in callback', currentUser, redirectUrl);
                console.log("user", currentUser)
                ref.user = ref.db.collection("users").doc(currentUser.uid);
                ref.user.get().then(function (snapshot) {
                    if (snapshot.exists) {
//                        ref.db.collection("payments").where("userRef", "==", ref.user).limit(1).get().then(function (snapshot) {
//                            var exists = false;
//                            snapshot.forEach(function (doc) {
//                                exists = true;
//                            });
//                            if (!exists) {
//                                $state.go('app.payment');
//                            } else {
//                                $state.go('app.profile');
//                            }
//                        });
                        $state.go('app.select-entity');
                    }
                    else {
                        //create user data, then should trigger onSnapshot so it loads anyway.
                        ref.user.set({
                            email: firebase.auth().currentUser.email
                            , name: firebase.auth().currentUser.displayName
                            , createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            , img: 'https://firebasestorage.googleapis.com/v0/b/wemaron-payment.appspot.com/o/placeholders%2Fuser_placeholder.png?alt=media&token=e80155ca-d44b-47cc-bbf9-ac0e200fd4b5'
                        }).then(function () {
                            console.log("Document successfully set!");
                            $state.go('app.select-entity');
                        })
                    }
                });
            // Do something.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
          } 
            }
            
        };
        
        $scope.ui.start('#firebaseui-auth-container', uiConfig);
        // The start method will wait until the DOM is loaded.
    }
})();