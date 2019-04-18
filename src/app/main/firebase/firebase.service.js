(function () {
    'use strict';
    angular.module('app.firebase').provider('firebaseService', service);
    /** @ngInject */
    function service() {
        var service = this;
        var devMode = true;
        var dev = {
            //add all data that is related to the development environment here.
            //url to http functions.. external API's...
        }
        var prod = {
            //add all data that is related to the production environment here.
            //url to http functions.. external API's...
        }
        service.getDevMode = getDevMode;
        service.getData = getData;
        this.$get = function () {
            var service = {
                getDevMode: getDevMode
                , getData: getData
            };
            return service;
        }

        function getDevMode() {
            return devMode;
        }

        function getData() {
            if (devMode) {
                return dev;
            }
            else {
                return prod;
            }
        }
    }
})();