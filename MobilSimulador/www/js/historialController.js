(function () {
    var control = angular.module('app.controllers');
    function groupBy(array, func) {
        var groups = {};
        array.forEach(function (o) {
            var group = o.fecha;//JSON.stringify(func(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        })
    };
    function calcula(prospect, $state) {
        if (prospect.valor === null) {
            muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha ingresado un valor del inmueble");
        } else {
            if (prospect.selMens === "2") {
                if (prospect.selPlazo === "1") {
                    if (prospect.selEstado === 0) {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                    }
                    else {
                        $state.go("app.tabs.hresultado20Creciente", {
                            valor: prospect.valor - prospect.enganche,
                            selMens: prospect.selMens,
                            selEstado: prospect.selEstado,
                            selPlazo: prospect.selPlazo,
                            idHistorial: prospect.id
                        });
                    }
                }
                else if (prospect.selPlazo === "2") {
                    if (prospect.selEstado === 0) {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                    }
                    else {
                        $state.go("app.tabs.hresultado15Creciente", {
                            valor: prospect.valor - prospect.enganche,
                            selMens: prospect.selMens,
                            selEstado: prospect.selEstado,
                            selPlazo: prospect.selPlazo,
                            idHistorial: prospect.id
                        });
                    }
                }
                else {
                    muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no seleccion&oacute; un plazo");
                }
            }
            else if (prospect.selMens === "1") {
                if (prospect.selPlazo === "1") {
                    if (prospect.selEstado === 0) {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                    }
                    else {
                        $state.go("app.tabs.hresultado20Fijo", {
                            valor: prospect.valor- prospect.enganche,
                            selMens: prospect.selMens,
                            selEstado: prospect.selEstado,
                            selPlazo: prospect.selPlazo,
                            idHistorial: prospect.id
                        });
                    }
                }
                else if (prospect.selPlazo === "2") {
                    if (prospect.selEstado === 0) {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                    }
                    else {
                        $state.go("app.tabs.hresultado15Fijo", {
                            valor: prospect.valor - prospect.enganche,
                            selMens: prospect.selMens,
                            selEstado: prospect.selEstado,
                            selPlazo: prospect.selPlazo,
                            idHistorial: prospect.id
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
        }
    }

    control.controller('HistoryListCtrl', function ($scope, $state, $stateParams, Prospectos) {
        $scope.prospectos = Prospectos.getByDate($stateParams.fec);

        $scope.resultado = function (id) {
            prospect = Prospectos.get(id);
            calcula(prospect, $state);
        };

    });

    control.directive('ngEnter', function (Prospectos) {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);

                        scope.prospectos = Prospectos.getByName(scope.dato);
                        if (scope.prospectos.length === 0) {
                            scope.prospectos = Prospectos.getByDate(scope.dato);
                           
                        }
                    });

                    event.preventDefault();
                }
            });
        };
    });

    control.controller('HistoryCtrl', function ($scope, $state, Prospectos, $ionicPopup) {
        $scope.irA = function (prospecto) {
            if (prospecto[0] != undefined) {
                $state.go("app.tabs.hisotryList", { fec: prospecto[0].fecha })
            } else {
                calcula(prospecto, $state, $ionicPopup);
            }
        };


        $scope.prospectos = groupBy(Prospectos.all(), function (item) {
            return [item.fecha];
        });;
    });
    function muestraMensaje(titulo, mensaje, $ionicPopup) {
        var alertPopup = $ionicPopup.alert({
            title: titulo,
            template: mensaje
        });

        alertPopup.then(function (res) {

        });
    }
})();