(function () {
    var control = angular.module('app.controllers');

    control.controller('Res15CrecienteCtrl', function ($scope, $state, $ionicPopup,
        Simula, Avaluos, Calculos, GastosNotariales, SendMail, Prospectos) {
        $scope.data = {
            valorInmueble: null,
            selEstado: 0,
            selMens: 0,
            selPlazo: 0,
            nombre: '',
            correo: '',
            telefono: '',
        };
        $scope.cancelar = false;
        $scope.data.valorInmueble = $state.params.valor;
        $scope.data.selEstado = $state.params.selEstado;
        $scope.data.selMens = $state.params.selMens;
        $scope.data.selPlazo = $state.params.selPlazo;

        $scope.valor = $state.params.valor;
        $scope.selEstado = $state.params.selEstado;
        $scope.selMens = $state.params.selMens;
        $scope.selPlazo = $state.params.selPlazo;
        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

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
            if ($state.params.idHistorial == "") {
                data = $scope.data;
                var myPopup = $ionicPopup.show({
                    template: '<input type="text" placeholder="Nombre" ng-model="data.nombre" /><input type="email" placeholder="Correo" ng-model="data.correo" />',
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
                        SendMail.mandar($scope.data);
                        $ionicPopup.alert({
                            title: 'Correcto',
                            template: 'Su correo se ha enviado correctamente'
                        }).then(function (res) {
                            console.log('');
                        });
                    }
                });
            } else {
                prospecto = Prospectos.get($state.params.idHistorial);
                $scope.data.valorInmueble = prospecto.valorInmueble;
                $scope.data.selEstado = prospecto.selEstado;
                $scope.data.selMens = prospecto.selMens;
                $scope.data.selPlazo = prospecto.selPlazo;
                $scope.data.nombre = prospecto.nombre;
                $scope.data.correo = prospecto.correo;
                $scope.data.telefono = prospecto.telefono;
                $scope.data.id = prospecto.id;
                SendMail.mandar($scope.data);
                $ionicPopup.alert({
                    title: 'Correcto',
                    template: 'Su correo se ha enviado correctamente'
                }).then(function (res) {
                    console.log('');
                });
            }
        };



        //Banorte
        banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);

        aforo = banorte.aforo;
        factorPago = banorte.factorDePago;
        tasaInteres = banorte.tasaDeInteres;
        cat = banorte.cat;

        montoCredito = Calculos.calculaMotoDelCredito(banorte.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 1);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 1, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpBanorte = [];
        grpBanorte.push({
            name: banorte.nombreBanco,
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
            members: []
        });

        grpBanorte[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpBanorte[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpBanorte[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpBanorte[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpBanorte[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });
        $scope.grupoBanorte = grpBanorte;

        aforo = 0;
        factorPago = 0;
        tasaInteres = 0;
        cat = 0;
        montoCredito = 0;
        pagoMensual = 0;
        ingresoRequerido = 0;
        enganche = 0;
        avaluo = 0;
        comisionApertura = 0;
        gastosNotariales = 0;
        desembolsoTotal = 0;

        // Santander
        santander = Simula.getForCalc(2, $scope.selMens, $scope.selPlazo);


        aforo = santander.aforo;
        factorPago = santander.factorDePago;
        tasaInteres = santander.tasaDeInteres;
        cat = santander.cat;

        montoCredito = Calculos.calculaMotoDelCredito(santander.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpSantander = [];
        grpSantander.push({
            name: santander.nombreBanco,
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
            members: []
        });

        grpSantander[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpSantander[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpSantander[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpSantander[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpSantander[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoSantander = grpSantander;

        aforo = 0;
        factorPago = 0;
        tasaInteres = 0;
        cat = 0;
        montoCredito = 0;
        pagoMensual = 0;
        ingresoRequerido = 0;
        enganche = 0;
        avaluo = 0;
        comisionApertura = 0;
        gastosNotariales = 0;
        desembolsoTotal = 0;

        // Scotiabank
        scotiabank = Simula.getForCalc(3, $scope.selMens, $scope.selPlazo);


        aforo = scotiabank.aforo;
        factorPago = scotiabank.factorDePago;
        tasaInteres = scotiabank.tasaDeInteres;
        cat = scotiabank.cat;

        montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 3);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 3, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpScotiabank = [];
        grpScotiabank.push({
            name: scotiabank.nombreBanco,
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
            members: []
        });

        grpScotiabank[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpScotiabank[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpScotiabank[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpScotiabank[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpScotiabank[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoScotiabank = grpScotiabank;

        aforo = 0;
        factorPago = 0;
        tasaInteres = 0;
        cat = 0;
        montoCredito = 0;
        pagoMensual = 0;
        ingresoRequerido = 0;
        enganche = 0;
        avaluo = 0;
        comisionApertura = 0;
        gastosNotariales = 0;
        desembolsoTotal = 0;

        // Afirme
        afirme = Simula.getForCalc(5, $scope.selMens, $scope.selPlazo);


        aforo = afirme.aforo;
        factorPago = afirme.factorDePago;
        tasaInteres = afirme.tasaDeInteres;
        cat = afirme.cat;

        montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 3);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 3, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        var grpAfirme = [];
        grpAfirme.push({
            name: afirme.nombreBanco,
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
            members: []
        });

        grpAfirme[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpAfirme[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpAfirme[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpAfirme[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpAfirme[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoAfirme = grpAfirme;

        aforo = 0;
        factorPago = 0;
        tasaInteres = 0;
        cat = 0;
        montoCredito = 0;
        pagoMensual = 0;
        ingresoRequerido = 0;
        enganche = 0;
        avaluo = 0;
        comisionApertura = 0;
        gastosNotariales = 0;
        desembolsoTotal = 0;

        // HSBC
        hsbc = Simula.getForCalc(7, $scope.selMens, $scope.selPlazo);


        aforo = hsbc.aforo;
        factorPago = hsbc.factorDePago;
        tasaInteres = hsbc.tasaDeInteres;
        cat = hsbc.cat;

        montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 3);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 3, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpHSBC = [];
        grpHSBC.push({
            name: hsbc.nombreBanco,
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
            members: []
        });

        grpHSBC[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpHSBC[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpHSBC[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpHSBC[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpHSBC[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });
        $scope.grupoHSBC = grpHSBC;

        aforo = 0;
        factorPago = 0;
        tasaInteres = 0;
        cat = 0;
        montoCredito = 0;
        pagoMensual = 0;
        ingresoRequerido = 0;
        enganche = 0;
        avaluo = 0;
        comisionApertura = 0;
        gastosNotariales = 0;
        desembolsoTotal = 0;
    });
})();