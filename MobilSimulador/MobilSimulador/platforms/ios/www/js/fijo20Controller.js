(function () {
    var control = angular.module('app.controllers');

    control.controller('Res20FijoCtrl', function ($scope, $state, $ionicPopup,
        Simula, Avaluos, Calculos, GastosNotariales, Prospectos, SendMail) {
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

        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        aforo = banorte.aforo;
        factorPago = banorte.factorDePago;
        tasaInteres = banorte.tasaDeInteres;
        cat = banorte.cat;

        montoCredito = Calculos.calculaMotoDelCredito(banorte.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 1);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluo($scope.valor, 1, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpBanorte = [];
        grpBanorte.push({
            name: banorte.nombreBanco,
            members: [],
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
        });
        grpBanorte[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpBanorte[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        //grpBanorte[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpBanorte[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpBanorte[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpBanorte[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpBanorte[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoBanorte = grpBanorte;
        //$scope.banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
        //gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        //aforo = $scope.banorte.aforo;
        //factorPago = $scope.banorte.factorDePago;
        //tasaInteres = $scope.banorte.tasaDeInteres;
        //cat = $scope.banorte.cat;

        //montoCredito = Calculos.calculaMotoDelCredito($scope.banorte.aforo, $scope.valor);
        //pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        //ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 1);

        //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        //avaluo = Calculos.calcularAvaluo($scope.valor, 1, Avaluos);
        //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
        //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        //$scope.montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
        //$scope.pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
        //$scope.tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
        //$scope.ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
        //$scope.catBanorte = (cat * 100).toFixed(2) + '%';
        //$scope.engancheBanorte = parseFloat(enganche).toFixed(2);
        //$scope.avaluoBanorte = parseFloat(avaluo).toFixed(2);
        //$scope.comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
        //$scope.gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
        //$scope.desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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

        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        aforo = santander.aforo;
        factorPago = santander.factorDePago;
        tasaInteres = santander.tasaDeInteres;
        cat = santander.cat;

        montoCredito = Calculos.calculaMotoDelCredito(santander.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 2);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluo($scope.valor, 2, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpSantander = [];
        grpSantander.push({
            name: santander.nombreBanco,
            members: [],
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
        });
        grpSantander[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpSantander[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        //grpSantander[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpSantander[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpSantander[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpSantander[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpSantander[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoSantander = grpSantander;
        //$scope.santander = Simula.getForCalc(2, $scope.selMens, $scope.selPlazo);
        //gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        //aforo = $scope.santander.aforo;
        //factorPago = $scope.santander.factorDePago;
        //tasaInteres = $scope.santander.tasaDeInteres;
        //cat = $scope.santander.cat;

        //montoCredito = Calculos.calculaMotoDelCredito($scope.santander.aforo, $scope.valor);
        //pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        //ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 2);

        //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        //avaluo = Calculos.calcularAvaluo($scope.valor, 2, Avaluos);
        //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
        //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        //$scope.montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
        //$scope.pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
        //$scope.tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
        //$scope.ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
        //$scope.catSantander = (cat * 100).toFixed(2) + '%';
        //$scope.engancheSantander = parseFloat(enganche).toFixed(2);
        //$scope.avaluoSantander = parseFloat(avaluo).toFixed(2);
        //$scope.comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
        //$scope.gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
        //$scope.desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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

        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        aforo = scotiabank.aforo;
        factorPago = scotiabank.factorDePago;
        tasaInteres = scotiabank.tasaDeInteres;
        cat = scotiabank.cat;

        montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 3);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluo($scope.valor, 3, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpScotiabank = [];
        grpScotiabank.push({
            name: scotiabank.nombreBanco,
            members: [],
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
        });
        grpScotiabank[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpScotiabank[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        //grpScotiabank[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpScotiabank[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpScotiabank[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpScotiabank[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpScotiabank[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoScotiabank = grpScotiabank;
        //$scope.scotiabank = Simula.getForCalc(3, $scope.selMens, $scope.selPlazo);
        //gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        //aforo = $scope.scotiabank.aforo;
        //factorPago = $scope.scotiabank.factorDePago;
        //tasaInteres = $scope.scotiabank.tasaDeInteres;
        //cat = $scope.scotiabank.cat;

        //montoCredito = Calculos.calculaMotoDelCredito($scope.scotiabank.aforo, $scope.valor);
        //pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        //ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 3);

        //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        //avaluo = Calculos.calcularAvaluo($scope.valor, 3, Avaluos);
        //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
        //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        //$scope.montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
        //$scope.pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
        //$scope.tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
        //$scope.ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
        //$scope.catScotiabank = (cat * 100).toFixed(2) + '%';
        //$scope.engancheScotiabank = parseFloat(enganche).toFixed(2);
        //$scope.avaluoScotiabank = parseFloat(avaluo).toFixed(2);
        //$scope.comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
        //$scope.gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
        //$scope.desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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

        // Bancomer
        bancomer = Simula.getForCalc(4, $scope.selMens, $scope.selPlazo);

        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        aforo = bancomer.aforo;
        factorPago = bancomer.factorDePago;
        tasaInteres = bancomer.tasaDeInteres;
        cat = bancomer.cat;

        montoCredito = Calculos.calculaMotoDelCredito(bancomer.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 4);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluo($scope.valor, 4, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpBancomer = [];
        grpBancomer.push({
            name: bancomer.nombreBanco,
            members: [],
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
        });
        grpBancomer[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpBancomer[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpBancomer[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpBancomer[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        //grpBancomer[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpBancomer[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpBancomer[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpBancomer[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpBancomer[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpBancomer[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpBancomer[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpBancomer[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoBancomer = grpBancomer;
        //$scope.bancomer = Simula.getForCalc(4, $scope.selMens, $scope.selPlazo);
        //gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        //aforo = $scope.bancomer.aforo;
        //factorPago = $scope.bancomer.factorDePago;
        //tasaInteres = $scope.bancomer.tasaDeInteres;
        //cat = $scope.bancomer.cat;

        //montoCredito = Calculos.calculaMotoDelCredito($scope.bancomer.aforo, $scope.valor);
        //pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        //ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 4);

        //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        //avaluo = Calculos.calcularAvaluo($scope.valor, 4, Avaluos);
        //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
        //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        //$scope.montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
        //$scope.pagoMensualBancomer = parseFloat(pagoMensual).toFixed(2);
        //$scope.tasaDeInteresBancomer = (tasaInteres * 100).toFixed(2) + '%';
        //$scope.ingresoRequeridoBancomer = parseFloat(ingresoRequerido).toFixed(2);
        //$scope.catBancomer = (cat * 100).toFixed(2) + '%';
        //$scope.engancheBancomer = parseFloat(enganche).toFixed(2);
        //$scope.avaluoBancomer = parseFloat(avaluo).toFixed(2);
        //$scope.comisionAperturaBancomer = parseFloat(comisionApertura).toFixed(2);
        //$scope.gastosNotarialesBancomer = parseFloat(gastosNotariales).toFixed(2);
        //$scope.desembolsoTotalBancomer = parseFloat(desembolsoTotal).toFixed(2);

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

        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        aforo = afirme.aforo;
        factorPago = afirme.factorDePago;
        tasaInteres = afirme.tasaDeInteres;
        cat = afirme.cat;

        montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 5);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluo($scope.valor, 5, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpAfirme = [];
        grpAfirme.push({
            name: afirme.nombreBanco,
            members: [],
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
        });
        grpAfirme[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpAfirme[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        //grpAfirme[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpAfirme[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpAfirme[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpAfirme[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpAfirme[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoAfirme = grpAfirme;
        //$scope.afirme = Simula.getForCalc(5, $scope.selMens, $scope.selPlazo);
        //gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        //aforo = $scope.afirme.aforo;
        //factorPago = $scope.afirme.factorDePago;
        //tasaInteres = $scope.afirme.tasaDeInteres;
        //cat = $scope.afirme.cat;

        //montoCredito = Calculos.calculaMotoDelCredito($scope.afirme.aforo, $scope.valor);
        //pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        //ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 5);

        //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        //avaluo = Calculos.calcularAvaluo($scope.valor, 5, Avaluos);
        //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
        //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        //$scope.montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
        //$scope.pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
        //$scope.tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
        //$scope.ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
        //$scope.catAfirme = (cat * 100).toFixed(2) + '%';
        //$scope.engancheAfirme = parseFloat(enganche).toFixed(2);
        //$scope.avaluoAfirme = parseFloat(avaluo).toFixed(2);
        //$scope.comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
        //$scope.gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
        //$scope.desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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

        // Banamex
        banamex = Simula.getForCalc(6, $scope.selMens, $scope.selPlazo);

        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        aforo = banamex.aforo;
        factorPago = banamex.factorDePago;
        tasaInteres = banamex.tasaDeInteres;
        cat = banamex.cat;

        montoCredito = Calculos.calculaMotoDelCredito(banamex.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 6);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluo($scope.valor, 6, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 6);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpBanamex = [];
        grpBanamex.push({
            name: banamex.nombreBanco,
            members: [],
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
        });
        grpBanamex[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpBanamex[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpBanamex[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpBanamex[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        //grpBanamex[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpBanamex[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpBanamex[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpBanamex[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpBanamex[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpBanamex[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpBanamex[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpBanamex[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoBanamex = grpBanamex;
        //$scope.banamex = Simula.getForCalc(6, $scope.selMens, $scope.selPlazo);
        //gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        //aforo = $scope.banamex.aforo;
        //factorPago = $scope.banamex.factorDePago;
        //tasaInteres = $scope.banamex.tasaDeInteres;
        //cat = $scope.banamex.cat;

        //montoCredito = Calculos.calculaMotoDelCredito($scope.banamex.aforo, $scope.valor);
        //pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        //ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 6);

        //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        //avaluo = Calculos.calcularAvaluo($scope.valor, 6, Avaluos);
        //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 6);
        //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        //$scope.montoCreditoBanamex = parseFloat(montoCredito).toFixed(2);
        //$scope.pagoMensualBanamex = parseFloat(pagoMensual).toFixed(2);
        //$scope.tasaDeInteresBanamex = (tasaInteres * 100).toFixed(2) + '%';
        //$scope.ingresoRequeridoBanamex = parseFloat(ingresoRequerido).toFixed(2);
        //$scope.catBanamex = (cat * 100).toFixed(2) + '%';
        //$scope.engancheBanamex = parseFloat(enganche).toFixed(2);
        //$scope.avaluoBanamex = parseFloat(avaluo).toFixed(2);
        //$scope.comisionAperturaBanamex = parseFloat(comisionApertura).toFixed(2);
        //$scope.gastosNotarialesBanamex = parseFloat(gastosNotariales).toFixed(2);
        //$scope.desembolsoTotalBanamex = parseFloat(desembolsoTotal).toFixed(2);

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
    
        gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        aforo = hsbc.aforo;
        factorPago = hsbc.factorDePago;
        tasaInteres = hsbc.tasaDeInteres;
        cat = hsbc.cat;

        montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, $scope.valor);
        pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 5);

        enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        avaluo = Calculos.calcularAvaluo($scope.valor, 5, Avaluos);
        comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
        gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);
        var grpHSBC = [];
        grpHSBC.push({
            name: hsbc.nombreBanco,
            members: [],
            pagoMensual: '$' + pagoMensual.formatMoney(2, '.', ','),
        });
        grpHSBC[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
        grpHSBC[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
        //grpHSBC[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
        grpHSBC[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
        grpHSBC[0].members.push({ name: "Gastos del credito", quantity: undefined });
        grpHSBC[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Avaluo", quantity: '$' + avaluo.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Comision por apertura", quantity: '$' + comisionApertura.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Gastos notariales", quantity: '$' + gastosNotariales.formatMoney(2, '.', ',') });
        grpHSBC[0].members.push({ name: "Desembolso total", quantity: '$' + desembolsoTotal.formatMoney(2, '.', ',') });

        $scope.grupoHSBC = grpHSBC;
        //$scope.hsbc = Simula.getForCalc(7, $scope.selMens, $scope.selPlazo);
        //gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

        //aforo = $scope.hsbc.aforo;
        //factorPago = $scope.hsbc.factorDePago;
        //tasaInteres = $scope.hsbc.tasaDeInteres;
        //cat = $scope.hsbc.cat;

        //montoCredito = Calculos.calculaMotoDelCredito($scope.hsbc.aforo, $scope.valor);
        //pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
        //ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 7);

        //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
        //avaluo = Calculos.calcularAvaluo($scope.valor, 7, Avaluos);
        //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
        //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

        //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

        //$scope.montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
        //$scope.pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
        //$scope.tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
        //$scope.ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
        //$scope.catHSBC = (cat * 100).toFixed(2) + '%';
        //$scope.engancheHSBC = parseFloat(enganche).toFixed(2);
        //$scope.avaluoHSBC = parseFloat(avaluo).toFixed(2);
        //$scope.comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
        //$scope.gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
        //$scope.desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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