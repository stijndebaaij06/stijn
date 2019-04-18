(function () {
    'use strict';
    angular.module('app.select-entity', []).config(config).directive('dynamic', dynamic);
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.select-entity', {
            url: '/select-entity'
            , views: {
                'content@app': {
                    templateUrl: 'app/main/select-entity/select-entity.html'
                    , controller: 'SelectEntityController as vm'
                }
            }
        });
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/select-entity');
        // Navigation
        msNavigationServiceProvider.saveItem('select-entity', {
            title: 'Select entity'
            , weight: -10
                //            , icon: 'icon-home'
                
            , state: 'app.select-entity'
                //            , stateParams: {
                ////                           'personal': false
                //                        }
                
            , translate: 'select_entity'
        });
    }

    function dynamic($compile) {
        return {
            restrict: 'A'
            , replace: true
            , link: function (scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function (html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    }
})();