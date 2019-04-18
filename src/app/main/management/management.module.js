(function ()
{
    'use strict';

    angular
        .module('app.management',
            [
                // 3rd Party Dependencies
                'ng-sortable',
                'textAngular'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.management', {
            url      : '/management',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/management/management.html',
                    controller : 'ManagementController as vm'
                }
            },
            bodyClass: 'management'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/management');

        // Api
//        msApiProvider.register('management.tasks', ['app/data/management/tasks.json']);
//        msApiProvider.register('management.tags', ['app/data/management/tags.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('to-do', {
            title : 'To-Do',
            icon  : 'icon-checkbox-marked',
            state : 'app.to-do',
            weight: 9
        });
    }

})();