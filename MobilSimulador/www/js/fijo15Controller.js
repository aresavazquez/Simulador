(function () {
    var control = angular.module('app.controllers');

    control.controller('Res15FijoCtrl', function ($scope, $state, $ionicPopup,
            Simula, Avaluos, Calculos, GastosNotariales, Prospectos, SendMail,$http) {

        $scope.data = {
            enganche: null,
            valorInmueble: null,
            selEstado: 0,
            selMens: 0,
            selPlazo: 0,
            nombre: '',
            correo: '',
            telefono: '',
            gpBNorte:{}
        };
        var prospecto = Prospectos.get($state.params.idHistorial);

        $scope.data.enganche = parseFloat(prospecto.enganche);
        $scope.data.valorInmueble = parseFloat($state.params.valor);
        $scope.data.selEstado = parseInt($state.params.selEstado, 10);
        $scope.data.selMens = parseInt($state.params.selMens, 10);
        $scope.data.selPlazo = parseInt($state.params.selPlazo, 10);

        $scope.enganche = $state.params.enganche;
        $scope.valor = $state.params.valor;
        $scope.selEstado = $state.params.selEstado;
        $scope.selMens = $state.params.selMens;
        $scope.selPlazo = $state.params.selPlazo;

        console.log('fijo15', $scope.data);

        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };

        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };

        $scope.mandarCorreo = function () {
            if ($state.params.idHistorial === "") {
                data = $scope.data;
                var myPopup = $ionicPopup.show({
                    template: '<input type="text" required placeholder="Nombre" ng-model="data.nombre" />'
                    + '<input type="email" placeholder="Correo" ng-model="data.correo" />'
                    + '<input type="number" placeholder="Teléfono" ng-model="data.telefono" />'
                    + '<div class="card">'
                    + '    <ul class="list checkAviso">'
                    + '        <li class="item item-checkbox">'
                    + '            <label class="checkbox">'
                    + '                <input type="checkbox" class="acepto" ng-model="data.acepto">'
                    + '            </label>'
                    + '            Acepto el Aviso de Privacidad.'
                    + '        </li>'
                    + '    </ul>'
                    + '    <div class="item item-text-wrap aviso">'
                    + '        Respecto al manejo de sus datos favor de revisar el Aviso de Privacidad.'
                    + '    </div>'
                    + '</div>',
                    title: 'Destinatario',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                      {
                          text: 'Cancelar',
                          onTap: function (e) {
                              $scope.cancelar = true;
                          }
                      },
                      {
                          text: '<b>Mandar</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                              $scope.cancelar = false;
                              return $scope.data;
                          }
                      }
                    ]
                });
                myPopup.then(function (res) {
                    if ($scope.cancelar === false) {

                        if ($scope.data.acepto === true) {
                            SendMail.mandar($scope.data);
                            $ionicPopup.alert({
                                title: 'Correcto',
                                template: 'Su correo se ha enviado correctamente'
                            }).then(function (res) {
                                console.log('');
                            });
                        } else {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: 'Debe aceptar los terminos de privacidad.'
                            }).then(function (res) {
                                console.log('');
                            });
                        }
                    }
                });
            } else {
                data = $scope.data;
                var myPopup = $ionicPopup.show({
                    templateUrl: "templates/destinatario.html",
                    title: 'Destinatario',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                      {
                          text: 'Cancelar',
                          onTap: function (e) {
                              $scope.cancelar = true;
                          }
                      },
                      {
                          text: '<b>Mandar</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                              $scope.cancelar = false;
                              return $scope.data;
                          }
                      }
                    ]
                });
                function muestraMensaje(titulo, mensaje, $ionicPopup) {
                    var alertPopup = $ionicPopup.alert({
                        title: titulo,
                        template: mensaje
                    });
            
                    alertPopup.then(function (res) {
            
                    });
                };

                myPopup.then(function (res) {
                    if ($scope.cancelar === false) {
                        if ($scope.data.nombre == "" || !/^[A-Za-z\s]*$/igm.test($scope.data.nombre) ){
                            muestraMensaje("Error", "Debes introducir un nombre válido", $ionicPopup);
                            return;
                        }
                        if($scope.data.correo == "" || !/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/igm.test($scope.data.correo) ){
                            muestraMensaje("Error", "Debes introducir un correo válido", $ionicPopup);
                            return;
                        }
                        if($scope.data.telefono == "" || !/[0-9]/.test($scope.data.telefono) ){
                            muestraMensaje("Error", "Debes introducir un teléfono válido", $ionicPopup);
                            return;
                        } 
                        if ($scope.data.acepto === true) {
                            SendMail.mandar($scope.data);
                            //$ionicPopup.alert({
                            //    title: 'Correcto',
                            //    template: 'Su correo se ha enviado correctamente'
                            //}).then(function (res) {
                            //    console.log('');
                            //});
                        } else {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: 'Debe aceptar los terminos de privacidad.'
                            }).then(function (res) {
                                console.log('');
                            });
                        }
                    }
                });
            }
        };

        //Banorte 1
        //console.log('adasdas',$scope.data);
        //webService consume...
        $http({
            url: 'http://wsl2.sisec.mx/api/Simulador',
            method: "GET",
            params: { idbanco: 1, vi: $scope.data.valorInmueble, plzo: $scope.data.selPlazo, estado: $scope.data.selEstado, msld: $scope.data.selMens, eng: $scope.data.enganche }
        }).success(function (respuesta) {
            var bank = respuesta;
            //console.log(respuesta);

            var grpBanorte = [];
            grpBanorte.push({
                name: bank.banco,
                members: [],
                pagoMensual: '$' + bank.pagomnsl.formatMoney(2, '.', ','),
            });
            grpBanorte[0].members.push({ name: "Pago mensual", quantity: '$' + bank.pagomnsl.formatMoney(2, '.', ',') });
            grpBanorte[0].members.push({ name: "Monto del crédito", quantity: '$' + bank.montocredito.formatMoney(2, '.', ',') });
            grpBanorte[0].members.push({ name: "Tasa de interés", quantity: (bank.tasa).toFixed(2) + '%' });
            grpBanorte[0].members.push({ name: "Ingreso requerido", quantity: '$' + bank.ingreso.formatMoney(2, '.', ',') });
            grpBanorte[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(bank.incremento).toFixed(2) + "%" });
            grpBanorte[0].members.push({ name: "CAT", quantity: (bank.cat).toFixed(2) + '%' });
            grpBanorte[0].members.push({ name: "Gastos del crédito", quantity: undefined });
            grpBanorte[0].members.push({ name: "Enganche", quantity: '$' + bank.enganche.formatMoney(2, '.', ',') });
            grpBanorte[0].members.push({ name: "Avalúo", quantity: '$' + bank.avaluo.formatMoney(2, '.', ',') });
            grpBanorte[0].members.push({ name: "Comisión por apertura", quantity: '$' + bank.comaper.formatMoney(2, '.', ',') });
            grpBanorte[0].members.push({ name: "Gastos notariales", quantity: '$' + bank.gastonot.formatMoney(2, '.', ',') });
            grpBanorte[0].members.push({ name: "Desembolso total", quantity: '$' + bank.desembolso.formatMoney(2, '.', ',') });

            $scope.grupoBanorte = grpBanorte;
        }).error(function (res) {
            console.log("error de conexión server")
        });
        ////////////////////////////////////////////////////


        // Santander 2
        $http({
            url: 'http://wsl2.sisec.mx/api/Simulador',
            method: "GET",
            params: { idbanco: 2, vi: $scope.data.valorInmueble, plzo: $scope.data.selPlazo, estado: $scope.data.selEstado, msld: $scope.data.selMens, eng: $scope.data.enganche }
        }).success(function (respuesta) {
            var bank = respuesta;
            //console.log(respuesta);

            var grpSantander = [];
            grpSantander.push({
                name: bank.banco,
                members: [],
                pagoMensual: '$' + bank.pagomnsl.formatMoney(2, '.', ','),
            });
            grpSantander[0].members.push({ name: "Pago mensual", quantity: '$' + bank.pagomnsl.formatMoney(2, '.', ',') });
            grpSantander[0].members.push({ name: "Monto del crédito", quantity: '$' + bank.montocredito.formatMoney(2, '.', ',') });
            grpSantander[0].members.push({ name: "Tasa de interés", quantity: (bank.tasa).toFixed(2) + '%' });
            grpSantander[0].members.push({ name: "Ingreso requerido", quantity: '$' + bank.ingreso.formatMoney(2, '.', ',') });
            grpSantander[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(bank.incremento).toFixed(2) + "%" });
            grpSantander[0].members.push({ name: "CAT", quantity: (bank.cat).toFixed(2) + '%' });
            grpSantander[0].members.push({ name: "Gastos del crédito", quantity: undefined });
            grpSantander[0].members.push({ name: "Enganche", quantity: '$' + bank.enganche.formatMoney(2, '.', ',') });
            grpSantander[0].members.push({ name: "Avalúo", quantity: '$' + bank.avaluo.formatMoney(2, '.', ',') });
            grpSantander[0].members.push({ name: "Comisión por apertura", quantity: '$' + bank.comaper.formatMoney(2, '.', ',') });
            grpSantander[0].members.push({ name: "Gastos notariales", quantity: '$' + bank.gastonot.formatMoney(2, '.', ',') });
            grpSantander[0].members.push({ name: "Desembolso total", quantity: '$' + bank.desembolso.formatMoney(2, '.', ',') });

            $scope.grupoSantander = grpSantander;
        }).error(function (res) {
            console.log("error de conexión server")
        });
        ////////////////////////////////////////////////////

        // Scotiabank 3
        $http({
            url: 'http://wsl2.sisec.mx/api/Simulador',
            method: "GET",
            params: { idbanco: 3, vi: $scope.data.valorInmueble, plzo: $scope.data.selPlazo, estado: $scope.data.selEstado, msld: $scope.data.selMens, eng: $scope.data.enganche }
        }).success(function (respuesta) {
            var bank = respuesta;
            console.log(respuesta);

            var grpScotiabank = [];
            grpScotiabank.push({
                name: bank.banco,
                members: [],
                pagoMensual: '$' + bank.pagomnsl.formatMoney(2, '.', ','),
            });
            grpScotiabank[0].members.push({ name: "Pago mensual", quantity: '$' + bank.pagomnsl.formatMoney(2, '.', ',') });
            grpScotiabank[0].members.push({ name: "Monto del crédito", quantity: '$' + bank.montocredito.formatMoney(2, '.', ',') });
            grpScotiabank[0].members.push({ name: "Tasa de interés", quantity: (bank.tasa).toFixed(2) + '%' });
            grpScotiabank[0].members.push({ name: "Ingreso requerido", quantity: '$' + bank.ingreso.formatMoney(2, '.', ',') });
            grpScotiabank[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(bank.incremento).toFixed(2) + "%" });
            grpScotiabank[0].members.push({ name: "CAT", quantity: (bank.cat).toFixed(2) + '%' });
            grpScotiabank[0].members.push({ name: "Gastos del crédito", quantity: undefined });
            grpScotiabank[0].members.push({ name: "Enganche", quantity: '$' + bank.enganche.formatMoney(2, '.', ',') });
            grpScotiabank[0].members.push({ name: "Avalúo", quantity: '$' + bank.avaluo.formatMoney(2, '.', ',') });
            grpScotiabank[0].members.push({ name: "Comisión por apertura", quantity: '$' + bank.comaper.formatMoney(2, '.', ',') });
            grpScotiabank[0].members.push({ name: "Gastos notariales", quantity: '$' + bank.gastonot.formatMoney(2, '.', ',') });
            grpScotiabank[0].members.push({ name: "Desembolso total", quantity: '$' + bank.desembolso.formatMoney(2, '.', ',') });

            $scope.grupoScotiabank = grpScotiabank;
        }).error(function (res) {
            console.log("error de conexión server")
        });
        ////////////////////////////////////////////////////

        // Bancomer 4
        $http({
            url: 'http://wsl2.sisec.mx/api/Simulador',
            method: "GET",
            params: { idbanco: 4, vi: $scope.data.valorInmueble, plzo: $scope.data.selPlazo, estado: $scope.data.selEstado, msld: $scope.data.selMens, eng: $scope.data.enganche }
        }).success(function (respuesta) {
            var bank = respuesta;
            console.log(respuesta);

            var grpBancomer = [];
            grpBancomer.push({
                name: bank.banco,
                members: [],
                pagoMensual: '$' + bank.pagomnsl.formatMoney(2, '.', ','),
            });
            grpBancomer[0].members.push({ name: "Pago mensual", quantity: '$' + bank.pagomnsl.formatMoney(2, '.', ',') });
            grpBancomer[0].members.push({ name: "Monto del crédito", quantity: '$' + bank.montocredito.formatMoney(2, '.', ',') });
            grpBancomer[0].members.push({ name: "Tasa de interés", quantity: (bank.tasa).toFixed(2) + '%' });
            grpBancomer[0].members.push({ name: "Ingreso requerido", quantity: '$' + bank.ingreso.formatMoney(2, '.', ',') });
            grpBancomer[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(bank.incremento).toFixed(2) + "%" });
            grpBancomer[0].members.push({ name: "CAT", quantity: (bank.cat).toFixed(2) + '%' });
            grpBancomer[0].members.push({ name: "Gastos del crédito", quantity: undefined });
            grpBancomer[0].members.push({ name: "Enganche", quantity: '$' + bank.enganche.formatMoney(2, '.', ',') });
            grpBancomer[0].members.push({ name: "Avalúo", quantity: '$' + bank.avaluo.formatMoney(2, '.', ',') });
            grpBancomer[0].members.push({ name: "Comisión por apertura", quantity: '$' + bank.comaper.formatMoney(2, '.', ',') });
            grpBancomer[0].members.push({ name: "Gastos notariales", quantity: '$' + bank.gastonot.formatMoney(2, '.', ',') });
            grpBancomer[0].members.push({ name: "Desembolso total", quantity: '$' + bank.desembolso.formatMoney(2, '.', ',') });

            $scope.grupoBancomer = grpBancomer;
        }).error(function (res) {
            console.log("error de conexión server")
        });
        ////////////////////////////////////////////////////

        // Afirme 5
        $http({
            url: 'http://wsl2.sisec.mx/api/Simulador',
            method: "GET",
            params: { idbanco: 5, vi: $scope.data.valorInmueble, plzo: $scope.data.selPlazo, estado: $scope.data.selEstado, msld: $scope.data.selMens, eng: $scope.data.enganche }
        }).success(function (respuesta) {
            var bank = respuesta;
            console.log(respuesta);

            var grpAfirme = [];
            grpAfirme.push({
                name: bank.banco,
                members: [],
                pagoMensual: '$' + bank.pagomnsl.formatMoney(2, '.', ','),
            });
            grpAfirme[0].members.push({ name: "Pago mensual", quantity: '$' + bank.pagomnsl.formatMoney(2, '.', ',') });
            grpAfirme[0].members.push({ name: "Monto del crédito", quantity: '$' + bank.montocredito.formatMoney(2, '.', ',') });
            grpAfirme[0].members.push({ name: "Tasa de interés", quantity: (bank.tasa).toFixed(2) + '%' });
            grpAfirme[0].members.push({ name: "Ingreso requerido", quantity: '$' + bank.ingreso.formatMoney(2, '.', ',') });
            grpAfirme[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(bank.incremento).toFixed(2) + "%" });
            grpAfirme[0].members.push({ name: "CAT", quantity: (bank.cat).toFixed(2) + '%' });
            grpAfirme[0].members.push({ name: "Gastos del crédito", quantity: undefined });
            grpAfirme[0].members.push({ name: "Enganche", quantity: '$' + bank.enganche.formatMoney(2, '.', ',') });
            grpAfirme[0].members.push({ name: "Avalúo", quantity: '$' + bank.avaluo.formatMoney(2, '.', ',') });
            grpAfirme[0].members.push({ name: "Comisión por apertura", quantity: '$' + bank.comaper.formatMoney(2, '.', ',') });
            grpAfirme[0].members.push({ name: "Gastos notariales", quantity: '$' + bank.gastonot.formatMoney(2, '.', ',') });
            grpAfirme[0].members.push({ name: "Desembolso total", quantity: '$' + bank.desembolso.formatMoney(2, '.', ',') });

            $scope.grupoAfirme = grpAfirme;
        }).error(function (res) {
            console.log("error de conexión server")
        });
        ////////////////////////////////////////////////////

        // Banamex 6
        $http({
            url: 'http://wsl2.sisec.mx/api/Simulador',
            method: "GET",
            params: { idbanco: 6, vi: $scope.data.valorInmueble, plzo: $scope.data.selPlazo, estado: $scope.data.selEstado, msld: $scope.data.selMens, eng: $scope.data.enganche }
        }).success(function (respuesta) {
            var bank = respuesta;
            //console.log(respuesta);

            var grpBanamex = [];
            grpBanamex.push({
                name: bank.banco,
                members: [],
                pagoMensual: '$' + bank.pagomnsl.formatMoney(2, '.', ','),
            });
            grpBanamex[0].members.push({ name: "Pago mensual", quantity: '$' + bank.pagomnsl.formatMoney(2, '.', ',') });
            grpBanamex[0].members.push({ name: "Monto del crédito", quantity: '$' + bank.montocredito.formatMoney(2, '.', ',') });
            grpBanamex[0].members.push({ name: "Tasa de interés", quantity: (bank.tasa).toFixed(2) + '%' });
            grpBanamex[0].members.push({ name: "Ingreso requerido", quantity: '$' + bank.ingreso.formatMoney(2, '.', ',') });
            grpBanamex[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(bank.incremento).toFixed(2) + "%" });
            grpBanamex[0].members.push({ name: "CAT", quantity: (bank.cat).toFixed(2) + '%' });
            grpBanamex[0].members.push({ name: "Gastos del crédito", quantity: undefined });
            grpBanamex[0].members.push({ name: "Enganche", quantity: '$' + bank.enganche.formatMoney(2, '.', ',') });
            grpBanamex[0].members.push({ name: "Avalúo", quantity: '$' + bank.avaluo.formatMoney(2, '.', ',') });
            grpBanamex[0].members.push({ name: "Comisión por apertura", quantity: '$' + bank.comaper.formatMoney(2, '.', ',') });
            grpBanamex[0].members.push({ name: "Gastos notariales", quantity: '$' + bank.gastonot.formatMoney(2, '.', ',') });
            grpBanamex[0].members.push({ name: "Desembolso total", quantity: '$' + bank.desembolso.formatMoney(2, '.', ',') });

            $scope.grupoBanamex = grpBanamex;
        }).error(function (res) {
            console.log("error de conexión server")
        });
        ////////////////////////////////////////////////////

        // HSBC 7
        $http({
            url: 'http://wsl2.sisec.mx/api/Simulador',
            method: "GET",
            params: { idbanco: 7, vi: $scope.data.valorInmueble, plzo: $scope.data.selPlazo, estado: $scope.data.selEstado, msld: $scope.data.selMens, eng: $scope.data.enganche }
        }).success(function (respuesta) {
            var bank = respuesta;
            //console.log(respuesta);

            var grpHSBC = [];
            grpHSBC.push({
                name: bank.banco,
                members: [],
                pagoMensual: '$' + bank.pagomnsl.formatMoney(2, '.', ','),
            });
            grpHSBC[0].members.push({ name: "Pago mensual", quantity: '$' + bank.pagomnsl.formatMoney(2, '.', ',') });
            grpHSBC[0].members.push({ name: "Monto del crédito", quantity: '$' + bank.montocredito.formatMoney(2, '.', ',') });
            grpHSBC[0].members.push({ name: "Tasa de interés", quantity: (bank.tasa).toFixed(2) + '%' });
            grpHSBC[0].members.push({ name: "Ingreso requerido", quantity: '$' + bank.ingreso.formatMoney(2, '.', ',') });
            grpHSBC[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(bank.incremento).toFixed(2) + "%" });
            grpHSBC[0].members.push({ name: "CAT", quantity: (bank.cat).toFixed(2) + '%' });
            grpHSBC[0].members.push({ name: "Gastos del crédito", quantity: undefined });
            grpHSBC[0].members.push({ name: "Enganche", quantity: '$' + bank.enganche.formatMoney(2, '.', ',') });
            grpHSBC[0].members.push({ name: "Avalúo", quantity: '$' + bank.avaluo.formatMoney(2, '.', ',') });
            grpHSBC[0].members.push({ name: "Comisión por apertura", quantity: '$' + bank.comaper.formatMoney(2, '.', ',') });
            grpHSBC[0].members.push({ name: "Gastos notariales", quantity: '$' + bank.gastonot.formatMoney(2, '.', ',') });
            grpHSBC[0].members.push({ name: "Desembolso total", quantity: '$' + bank.desembolso.formatMoney(2, '.', ',') });

            $scope.grupoHSBC = grpHSBC;
        }).error(function (res) {
            console.log("error de conexión server")
        });
        ////////////////////////////////////////////////////
    });

})();