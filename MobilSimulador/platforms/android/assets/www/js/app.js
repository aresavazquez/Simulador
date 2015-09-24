(function () {
    var app = angular.module('app', ['ionic', 'ngCordova','app.controllers', 'app.services']);

    app.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }
        });
    })

    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-prospecto.html',
                    controller: 'DashCtrl'
                }
            }
        })

        $stateProvider.state('resultado15Fijo', {
            url: '/resultado/:valor/:selMens/:selPlazo/:selEstado',
            views: {
                'tab-simular': {
                    templateUrl: 'templates/tab-resultado15Fijo.html',
                    controller: 'Res15FijoCtrl'
                }
            }
        })

        $stateProvider.state('resultado15Creciente', {
            url: '/resultado/:valor/:selMens/:selPlazo/:selEstado',
            views: {
                'tab-simular': {
                    templateUrl: 'templates/tab-resultado15Creciente.html',
                    controller: 'Res15CrecienteCtrl'
                }
            }
        })

        $stateProvider.state('resultado20Fijo', {
            url: '/resultado/:valor/:selMens/:selPlazo/:selEstado',
            views: {
                'tab-simular': {
                    templateUrl: 'templates/tab-resultado20Fijo.html',
                    controller: 'Res20FijoCtrl'
                }
            }
        })

        $stateProvider.state('resultado20Creciente', {
            url: '/resultado/:valor/:selMens/:selPlazo/:selEstado',
            views: {
                'tab-simular': {
                    templateUrl: 'templates/tab-resultado20Creciente.html',
                    controller: 'Res20CrecienteCtrl'
                }
            }
        })

       $stateProvider.state('simular', {
           url: '/simular',
           views: {
               'tab-simular': {
                   templateUrl: 'templates/tab-simulador.html',
                   controller: 'SimulaCtrl'
               }
           }
       })

        $stateProvider.state('historial', {
            url: '/historial',
            views: {
                'tab-historial': {
                    templateUrl: 'templates/historial.html'
                }
            }
        })

        $stateProvider.state('perfil', {
            url: '/perfil',
            views: {
                'tab-perfil': {
                    templateUrl: 'templates/perfil.html'
                }
            }
        })

        $stateProvider.state('aviso', {
            url: '/aviso',
            views: {
                'tab-aviso': {
                    templateUrl: 'templates/aviso.html'
                }
            }
        })


        $urlRouterProvider.otherwise('/dash');
    });
})();
