(function () {
    'use strict';
    angular.module('app.firebase', []).config(config).factory('data', data).factory('ref', ref);
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, firebaseServiceProvider) {
        //Firebase Setup
        console.log("firebaseServiceProvider", firebaseServiceProvider)
        var devMode = firebaseServiceProvider.getDevMode();
        console.log("devMode", devMode);
        var fbsettings = {};
        if (devMode) {
            fbsettings = {
                apiKey: "AIzaSyC7VEFAMv7laC_QElthXyZl6ntwZBAkST0"
                , authDomain: "hallo-bob.firebaseapp.com"
                , databaseURL: "https://hallo-bob.firebaseio.com"
                , projectId: "hallo-bob"
                , storageBucket: "hallo-bob.appspot.com"
                , messagingSenderId: "940547515058"
            };
        }
        else {
            fbsettings = {
                apiKey: "AIzaSyAuE2oZWnu0tWJv_RwWHiQEPBAe8zp8VgM"
                , authDomain: "hallo-bob-prod.firebaseapp.com"
                , databaseURL: "https://hallo-bob-prod.firebaseio.com"
                , projectId: "hallo-bob-prod"
                , storageBucket: "hallo-bob-prod.appspot.com"
                , messagingSenderId: "450441977911"
            };
        }
        if (firebase.apps.length == 0) {
            firebase.initializeApp(fbsettings);
            console.log('init');
        }
        // State
        $stateProvider.state('app.login', {
            url: '/login?instaLogout'
            , views: {
                'content@app': {
                    templateUrl: 'app/main/firebase/authentication/login/login.html'
                    , controller: 'LoginController as vm'
                }
            }
        });
        $stateProvider.state('app.logout', {
            url: '/logout'
            , views: {
                'content@app': {
                    templateUrl: 'app/main/firebase/authentication/logout/logout.html'
                    , controller: 'LogoutController as vm'
                }
            }
        });
        //        $stateProvider.state('app.register', {
        //            url: '/register'
        //            , views: {
        //                'content@app': {
        //                    templateUrl: 'app/main/firebase/authentication/register/register.html'
        //                    , controller: 'RegisterController as vm'
        //                }
        //            }
        //        });
        $stateProvider.state('app.resetpassword', {
            url: '/reset'
            , views: {
                'content@app': {
                    templateUrl: 'app/main/firebase/authentication/reset-password/resetpassword.html'
                    , controller: 'ResetPassController as vm'
                }
            }
        });
        //        $stateProvider.state('app.accountSettings', {
        //            url: '/accountsettings'
        //            , views: {
        //                'content@app': {
        //                    templateUrl: 'app/main/firebase/authentication/account-settings/accountsettings.html'
        //                    , controller: 'AccountSettingsController as vm'
        //                }
        //            }
        //        });
        $stateProvider.state('app.signInSuccess', {
            url: '/signinsuccess'
            , views: {
                'content@app': {
                    templateUrl: 'app/main/firebase/authentication/sign-in-success/sign-in-success.html'
                    , controller: 'SignInSuccessController as vm'
                }
            }
        });
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/firebase');
        // Navigation
        //        msNavigationServiceProvider.saveItem('account', {
        //            title: 'ACCOUNT'
        //            , group: true
        //            , weight: 2
        //            , translate: 'account'
        //        });
        msNavigationServiceProvider.saveItem('login', {
            title: 'LOGIN'
            , weight: 10
                //            , icon: 'icon-account'
                
            , state: 'app.login'
            , /*stateParams: {
                                                                                             'param1': 'page'
                                                                                          },*/
            translate: 'login'
            , hidden: function () {
                return firebase.auth().currentUser;
            }
        });
        //        msNavigationServiceProvider.saveItem('register', {
        //            title: 'REGISTER'
        //            , weight: 2
        //                //            , icon: 'icon-account-plus'
        //                
        //            , state: 'app.register'
        //            , /*stateParams: {
        //                                                 'param1': 'page'
        //                                              },*/
        //            translate: 'register'
        //            , hidden: function () {
        //                return firebase.auth().currentUser;
        //            }
        //        });
        msNavigationServiceProvider.saveItem('logout', {
            title: 'LOGOUT'
            , weight: 10
                //            , icon: 'icon-account'
                
            , state: 'app.logout'
            , /*stateParams: {
                                                                                             'param1': 'page'
                                                                                          },*/
            translate: 'logout'
            , hidden: function () {
                return !firebase.auth().currentUser;
            }
        });
        //        msNavigationServiceProvider.saveItem('settings', {
        //            title: 'ACCOUNTSETTINGS'
        //            , weight: 2
        //                //            , icon: 'icon-cog'
        //                
        //            , state: 'app.accountSettings'
        //            , /*stateParams: {
        //                                                 'param1': 'page'
        //                                              },*/
        //            translate: 'account_settings'
        //            , hidden: function () {
        //                return !firebase.auth().currentUser;
        //            }
        //        });
    }

    function data() {
        return {}
    }

    function ref() {
        return {}
    }
})();