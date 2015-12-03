(function () {
    var control = angular.module('app.controllers');

    control.controller('SimulaCtrl', function ($scope, $ionicPopup, $state, $ionicPopup,
        Estados, Plazos, Mensualidades) {
        $scope.data = {
            valor: null,
            selMens: 0,
            selPlazo: 0,
            selEstado: 0
        };
        $scope.estados = Estados.all();
        $scope.plazos = Plazos.all();
        $scope.mensualidades = Mensualidades.all();
        $scope.calcular = function () {

            if ($scope.data.valor === null) {
                muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha ingresado un valor del inmueble");
            } else {
                //if($scope.data.acepto === true){
                    if ($scope.data.selMens === "2") {
                        if ($scope.data.selPlazo === "1") {
                            if ($scope.data.selEstado === 0) {
                                muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                            }
                            else {
                                $state.go("app.tabs.resultado20Creciente", {
                                    valor: $scope.data.valor,
                                    selMens: $scope.data.selMens,
                                    selEstado: $scope.data.selEstado,
                                    selPlazo: $scope.data.selPlazo,
                                    idHistorial: undefined
                                });
                            }
                        }
                        else if ($scope.data.selPlazo === "2") {
                            if ($scope.data.selEstado === 0) {
                                muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                            }
                            else {
                                $state.go("app.tabs.resultado15Creciente", {
                                    valor: $scope.data.valor,
                                    selMens: $scope.data.selMens,
                                    selEstado: $scope.data.selEstado,
                                    selPlazo: $scope.data.selPlazo,
                                    idHistorial: undefined
                                });
                            }
                        }
                        else {
                            muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no seleccion&oacute; un plazo");
                        }
                    }
                    else if ($scope.data.selMens === "1") {
                        if ($scope.data.selPlazo === "1") {
                            if ($scope.data.selEstado === 0) {
                                muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                            }
                            else {
                                $state.go("app.tabs.resultado20Fijo", {
                                    valor: $scope.data.valor,
                                    selMens: $scope.data.selMens,
                                    selEstado: $scope.data.selEstado,
                                    selPlazo: $scope.data.selPlazo,
                                    idHistorial: undefined
                                });
                            }
                        }
                        else if ($scope.data.selPlazo === "2") {
                            if ($scope.data.selEstado === 0) {
                                muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                            }
                            else {
                                $state.go("app.tabs.resultado15Fijo", {
                                    valor: $scope.data.valor,
                                    selMens: $scope.data.selMens,
                                    selEstado: $scope.data.selEstado,
                                    selPlazo: $scope.data.selPlazo,
                                    idHistorial: undefined
                                });
                            }
                        }
                        else {
                            muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no seleccion&oacute; un plazo");
                        }
                    }
                    else {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no seleccion&oacute; una mensualidad");
                    }
                //}
                //else {
                //    
                //        var alertPopup = $ionicPopup.alert({
                //            title: 'Atencion',
                //            template: 'Debe Aceptar el Aviso de Privacidad'
                //        });
                //        alertPopup.then(function (res) {
                //            console.log('Se ha informado al usuario');
                //        });
                //    
                //}
            }
        };

        function muestraMensaje(titulo, mensaje) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: mensaje
            });

            alertPopup.then(function (res) {

            });
        }
    });
})();