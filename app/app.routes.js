'use strict';
angular
    .module('app')
    .config(function ($stateProvider) {
        $stateProvider
            .state('start', {
                url: '/',
                templateUrl: 'app.view.html',
                controller: 'appController'
            })
    });