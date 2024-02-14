angular.module('WhWorld', ['ui.router']);
angular.module('WhWorld')
.config(function($stateProvider) {
    $stateProvider
        .state('start', {
                url: 'start',
                templateUrl: 'start.html',
                controller: 'StartController'
            })
        .state('inventory', {
                url: 'inventory',
                templateUrl: 'inventory.html',
                controller: 'InventoryController'
            })
        .state('canvas', {
                url: 'canvas',
                templateUrl: 'canvas.html',
                controller: 'CanvasController'
            })
        .state('map', {
                url: 'map',
                templateUrl: 'map.html',
                controller: 'MapController'
            })
        .state('scenario', {
                url: 'scenario',
                templateUrl: 'scenario.html',
                controller: 'ScenarioController'
            })
        .state('save', {
                url: 'save',
                templateUrl: 'save.html',
                controller: 'SaveController'
            });
    }
)
