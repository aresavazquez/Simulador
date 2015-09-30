(
	function () {
	    var app = angular.module('app', ['ionic', 'ngCordova', 'angularMoment', 'ngOpenFB', 'ngMaterial', 'app.controllers', 'app.services']);

	    app.run(function ($ionicPlatform, ngFB) {
	        ngFB.init({
	            //appId: '1639952819598830'
	            appId: '1511059905871041'
	        });

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
	        $stateProvider
			//Login
			.state('login', {
			    url: '/login',
			    templateUrl: 'login.html',
			    controller: 'LoginCtrl'
			})
            // Aplicación
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'principal.html'
            })
            // Pestañas
            .state('app.tabs', {
                url: '/tab',
                views: {
                    'principal': {
                        templateUrl: 'templates/tabs.html'
                    }
                }
            }).state('app.tabs.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-prospecto.html',
                        controller: 'DashCtrl'
                    }
                }
            }).state('app.tabs.simular', {
                url: '/simular',
                views: {
                    'tab-simular': {
                        templateUrl: 'templates/tab-simulador.html',
                        controller: 'SimulaCtrl'
                    }
                }
            }).state('app.tabs.resultado15Fijo', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-simular': {
                        templateUrl: 'templates/tab-resultado15Fijo.html',
                        controller: 'Res15FijoCtrl'
                    }
                }
            }).state('app.tabs.resultado15Creciente', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-simular': {
                        templateUrl: 'templates/tab-resultado15Creciente.html',
                        controller: 'Res15CrecienteCtrl'
                    }
                }
            }).state('app.tabs.resultado20Fijo', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-simular': {
                        templateUrl: 'templates/tab-resultado20Fijo.html',
                        controller: 'Res20FijoCtrl'
                    }
                }
            }).state('app.tabs.resultado20Creciente', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-simular': {
                        templateUrl: 'templates/tab-resultado20Creciente.html',
                        controller: 'Res20CrecienteCtrl'
                    }
                }
            }).state('app.tabs.historial', {
                url: '/historial',
                views: {
                    'tab-historial': {
                        templateUrl: 'templates/historial.html',
                        controller: 'HistoryCtrl'
                    }
                }
            }).state('app.tabs.hisotryList', {
                url: '/historyList/:fec',
                views: {
                    'tab-historial': {
                        templateUrl: 'templates/historyList.html',
                        controller: 'HistoryListCtrl'
                    }
                }
            }).state('app.tabs.hresultado15Creciente', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-historial': {
                        templateUrl: 'templates/tab-resultado15Creciente.html',
                        controller: 'Res15CrecienteCtrl'
                    }
                }
            }).state('app.tabs.hresultado15Fijo', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-historial': {
                        templateUrl: 'templates/tab-resultado15Fijo.html',
                        controller: 'Res15FijoCtrl'
                    }
                }
            }).state('app.tabs.hresultado20Fijo', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-historial': {
                        templateUrl: 'templates/tab-resultado20Fijo.html',
                        controller: 'Res20FijoCtrl'
                    }
                }
            }).state('app.tabs.hresultado20Creciente', {
                url: '/resultado/:valor/:selMens/:selPlazo/:selEstado/:idHistorial',
                views: {
                    'tab-historial': {
                        templateUrl: 'templates/tab-resultado20Creciente.html',
                        controller: 'Res20CrecienteCtrl'
                    }
                }
            }).state('app.tabs.perfil', {
                url: '/perfil',
                views: {
                    'tab-perfil': {
                        templateUrl: 'templates/perfil.html',
                        controller: 'PerfilCtrl'
                    }
                }
            }).state('app.tabs.aviso', {
                url: '/aviso',
                views: {
                    'tab-aviso': {
                        templateUrl: 'templates/aviso.html'
                    }
                }
            });

	        $urlRouterProvider.otherwise('/login');
	    });
	})();
