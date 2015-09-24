var control = angular.module('app.controllers', [])

control.controller('DashCtrl', function ($scope, Estados, Plazos, Mensualidades, $cordovaEmailComposer) {
    $scope.estados = Estados.all();
    $scope.plazos = Plazos.all();
    $scope.mensualidades = Mensualidades.all();
    $scope.enviarMail = function () {
        $cordovaEmailComposer.isAvailable().then(function () {
            alert("disponible");
        }, function () {
            alert("no disponible");
        });

        var email = {
            to: 'egomez@socasesores.com',
            cc: '',
            bcc: ['aban09@gmail.com', 'edgar.gomez.elizalde@hotmail.com'],
            attachments: null,
            subject: 'Cálculos del simulador',
            body: '<h1>Datos del simulador</h1>',
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function () {

        });
    }
});

control.controller('Prospecto', function ($scope, Prospectos) {
    $scope.prospectos = Prospectos.all();

});

control.controller('Res15CrecienteCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
    $scope.valor = $state.params.valor;
    $scope.selEstado = $state.params.selEstado;
    $scope.selMens = $state.params.selMens;
    $scope.selPlazo = $state.params.selPlazo;
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;
    //Banorte
    $scope.banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);

    aforo = $scope.banorte.aforo;
    factorPago = $scope.banorte.factorDePago;
    tasaInteres = $scope.banorte.tasaDeInteres;
    cat = $scope.banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.banorte.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 1);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    $scope.incrementoAnualBanorte = parseFloat($scope.banorte.incrementoAnual * 100).toFixed(2) + "%"
    $scope.pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBanorte = (cat * 100).toFixed(2) + '%';
    $scope.engancheBanorte = parseFloat(enganche).toFixed(2);
    $scope.avaluoBanorte = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.santander = Simula.getForCalc(2, $scope.selMens, $scope.selPlazo);

    aforo = $scope.santander.aforo;
    factorPago = $scope.santander.factorDePago;
    tasaInteres = $scope.santander.tasaDeInteres;
    cat = $scope.santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.santander.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualSantander = parseFloat($scope.santander.incrementoAnual * 100).toFixed(2) + "%"
    $scope.tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catSantander = (cat * 100).toFixed(2) + '%';
    $scope.engancheSantander = parseFloat(enganche).toFixed(2);
    $scope.avaluoSantander = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.scotiabank = Simula.getForCalc(3, $scope.selMens, $scope.selPlazo);

    aforo = $scope.scotiabank.aforo;
    factorPago = $scope.scotiabank.factorDePago;
    tasaInteres = $scope.scotiabank.tasaDeInteres;
    cat = $scope.scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.scotiabank.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 3);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualScotiabank = parseFloat($scope.scotiabank.incrementoAnual * 100).toFixed(2) + "%"
    $scope.tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catScotiabank = (cat * 100).toFixed(2) + '%';
    $scope.engancheScotiabank = parseFloat(enganche).toFixed(2);
    $scope.avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.afirme = Simula.getForCalc(5, $scope.selMens, $scope.selPlazo);

    aforo = $scope.afirme.aforo;
    factorPago = $scope.afirme.factorDePago;
    tasaInteres = $scope.afirme.tasaDeInteres;
    cat = $scope.afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.afirme.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 5);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualAfirme = parseFloat($scope.afirme.incrementoAnual * 100).toFixed(2) + "%"
    $scope.tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catAfirme = (cat * 100).toFixed(2) + '%';
    $scope.engancheAfirme = parseFloat(enganche).toFixed(2);
    $scope.avaluoAfirme = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.hsbc = Simula.getForCalc(7, $scope.selMens, $scope.selPlazo);

    aforo = $scope.hsbc.aforo;
    factorPago = $scope.hsbc.factorDePago;
    tasaInteres = $scope.hsbc.tasaDeInteres;
    cat = $scope.hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.hsbc.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 7);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    $scope.incrementoAnualHSBC = parseFloat($scope.hsbc.incrementoAnual * 100).toFixed(2) + "%"
    $scope.pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catHSBC = (cat * 100).toFixed(2) + '%';
    $scope.engancheHSBC = parseFloat(enganche).toFixed(2);
    $scope.avaluoHSBC = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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

control.controller('Res20CrecienteCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
    $scope.valor = $state.params.valor;
    $scope.selEstado = $state.params.selEstado;
    $scope.selMens = $state.params.selMens;
    $scope.selPlazo = $state.params.selPlazo;
    //Banorte
    $scope.banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.banorte.aforo;
    factorPago = $scope.banorte.factorDePago;
    tasaInteres = $scope.banorte.tasaDeInteres;
    cat = $scope.banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.banorte.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 1);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualBanorte = parseFloat($scope.banorte.incrementoAnual * 100).toFixed(2);
    $scope.tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBanorte = (cat * 100).toFixed(2) + '%';
    $scope.engancheBanorte = parseFloat(enganche).toFixed(2);
    $scope.avaluoBanorte = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.santander = Simula.getForCalc(2, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.santander.aforo;
    factorPago = $scope.santander.factorDePago;
    tasaInteres = $scope.santander.tasaDeInteres;
    cat = $scope.santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.santander.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualSantander = parseFloat($scope.santander.incrementoAnual * 100).toFixed(2);
    $scope.tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catSantander = (cat * 100).toFixed(2) + '%';
    $scope.engancheSantander = parseFloat(enganche).toFixed(2);
    $scope.avaluoSantander = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.scotiabank = Simula.getForCalc(3, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.scotiabank.aforo;
    factorPago = $scope.scotiabank.factorDePago;
    tasaInteres = $scope.scotiabank.tasaDeInteres;
    cat = $scope.scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.scotiabank.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 3);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualScotiabank = parseFloat($scope.scotiabank.incrementoAnual * 100).toFixed(2);
    $scope.tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catScotiabank = (cat * 100).toFixed(2) + '%';
    $scope.engancheScotiabank = parseFloat(enganche).toFixed(2);
    $scope.avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.bancomer = Simula.getForCalc(4, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.bancomer.aforo;
    factorPago = $scope.bancomer.factorDePago;
    tasaInteres = $scope.bancomer.tasaDeInteres;
    cat = $scope.bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.bancomer.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 4);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 4, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
    $scope.incrementoAnualBancomer = parseFloat($scope.bancomer.incrementoAnual * 100).toFixed(2);
    $scope.pagoMensualBancomer = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBancomer = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBancomer = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBancomer = (cat * 100).toFixed(2) + '%';
    $scope.engancheBancomer = parseFloat(enganche).toFixed(2);
    $scope.avaluoBancomer = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBancomer = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBancomer = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBancomer = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.afirme = Simula.getForCalc(5, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.afirme.aforo;
    factorPago = $scope.afirme.factorDePago;
    tasaInteres = $scope.afirme.tasaDeInteres;
    cat = $scope.afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.afirme.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 5);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualAfirme = parseFloat($scope.afirme.incrementoAnual * 100).toFixed(2);
    $scope.tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catAfirme = (cat * 100).toFixed(2) + '%';
    $scope.engancheAfirme = parseFloat(enganche).toFixed(2);
    $scope.avaluoAfirme = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.hsbc = Simula.getForCalc(7, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.hsbc.aforo;
    factorPago = $scope.hsbc.factorDePago;
    tasaInteres = $scope.hsbc.tasaDeInteres;
    cat = $scope.hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.hsbc.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 7);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    $scope.incrementoAnualHSBC = parseFloat($scope.hsbc.incrementoAnual * 100).toFixed(2);
    $scope.tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catHSBC = (cat * 100).toFixed(2) + '%';
    $scope.engancheHSBC = parseFloat(enganche).toFixed(2);
    $scope.avaluoHSBC = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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

control.controller('Res15FijoCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
    $scope.valor = $state.params.valor;
    $scope.selEstado = $state.params.selEstado;
    $scope.selMens = $state.params.selMens;
    $scope.selPlazo = $state.params.selPlazo;
    //Banorte
    $scope.banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.banorte.aforo;
    factorPago = $scope.banorte.factorDePago;
    tasaInteres = $scope.banorte.tasaDeInteres;
    cat = $scope.banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.banorte.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 1);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBanorte = (cat * 100).toFixed(2) + '%';
    $scope.engancheBanorte = parseFloat(enganche).toFixed(2);
    $scope.avaluoBanorte = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.santander = Simula.getForCalc(2, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.santander.aforo;
    factorPago = $scope.santander.factorDePago;
    tasaInteres = $scope.santander.tasaDeInteres;
    cat = $scope.santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.santander.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catSantander = (cat * 100).toFixed(2) + '%';
    $scope.engancheSantander = parseFloat(enganche).toFixed(2);
    $scope.avaluoSantander = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.scotiabank = Simula.getForCalc(3, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.scotiabank.aforo;
    factorPago = $scope.scotiabank.factorDePago;
    tasaInteres = $scope.scotiabank.tasaDeInteres;
    cat = $scope.scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.scotiabank.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 3);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catScotiabank = (cat * 100).toFixed(2) + '%';
    $scope.engancheScotiabank = parseFloat(enganche).toFixed(2);
    $scope.avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.bancomer = Simula.getForCalc(4, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.bancomer.aforo;
    factorPago = $scope.bancomer.factorDePago;
    tasaInteres = $scope.bancomer.tasaDeInteres;
    cat = $scope.bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.bancomer.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 4);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 4, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualBancomer = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBancomer = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBancomer = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBancomer = (cat * 100).toFixed(2) + '%';
    $scope.engancheBancomer = parseFloat(enganche).toFixed(2);
    $scope.avaluoBancomer = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBancomer = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBancomer = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBancomer = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.afirme = Simula.getForCalc(5, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.afirme.aforo;
    factorPago = $scope.afirme.factorDePago;
    tasaInteres = $scope.afirme.tasaDeInteres;
    cat = $scope.afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.afirme.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 5);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catAfirme = (cat * 100).toFixed(2) + '%';
    $scope.engancheAfirme = parseFloat(enganche).toFixed(2);
    $scope.avaluoAfirme = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.banamex = Simula.getForCalc(6, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.banamex.aforo;
    factorPago = $scope.banamex.factorDePago;
    tasaInteres = $scope.banamex.tasaDeInteres;
    cat = $scope.banamex.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.banamex.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 6);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 6, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 6);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBanamex = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualBanamex = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBanamex = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBanamex = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBanamex = (cat * 100).toFixed(2) + '%';
    $scope.engancheBanamex = parseFloat(enganche).toFixed(2);
    $scope.avaluoBanamex = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBanamex = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBanamex = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBanamex = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.hsbc = Simula.getForCalc(7, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.hsbc.aforo;
    factorPago = $scope.hsbc.factorDePago;
    tasaInteres = $scope.hsbc.tasaDeInteres;
    cat = $scope.hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.hsbc.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 7);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catHSBC = (cat * 100).toFixed(2) + '%';
    $scope.engancheHSBC = parseFloat(enganche).toFixed(2);
    $scope.avaluoHSBC = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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

control.controller('Res20FijoCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
    $scope.valor = $state.params.valor;
    $scope.selEstado = $state.params.selEstado;
    $scope.selMens = $state.params.selMens;
    $scope.selPlazo = $state.params.selPlazo;
    //Banorte
    $scope.banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.banorte.aforo;
    factorPago = $scope.banorte.factorDePago;
    tasaInteres = $scope.banorte.tasaDeInteres;
    cat = $scope.banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.banorte.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 1);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBanorte = (cat * 100).toFixed(2) + '%';
    $scope.engancheBanorte = parseFloat(enganche).toFixed(2);
    $scope.avaluoBanorte = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.santander = Simula.getForCalc(2, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.santander.aforo;
    factorPago = $scope.santander.factorDePago;
    tasaInteres = $scope.santander.tasaDeInteres;
    cat = $scope.santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.santander.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catSantander = (cat * 100).toFixed(2) + '%';
    $scope.engancheSantander = parseFloat(enganche).toFixed(2);
    $scope.avaluoSantander = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.scotiabank = Simula.getForCalc(3, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.scotiabank.aforo;
    factorPago = $scope.scotiabank.factorDePago;
    tasaInteres = $scope.scotiabank.tasaDeInteres;
    cat = $scope.scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.scotiabank.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 3);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catScotiabank = (cat * 100).toFixed(2) + '%';
    $scope.engancheScotiabank = parseFloat(enganche).toFixed(2);
    $scope.avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.bancomer = Simula.getForCalc(4, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.bancomer.aforo;
    factorPago = $scope.bancomer.factorDePago;
    tasaInteres = $scope.bancomer.tasaDeInteres;
    cat = $scope.bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.bancomer.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 4);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 4, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualBancomer = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBancomer = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBancomer = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBancomer = (cat * 100).toFixed(2) + '%';
    $scope.engancheBancomer = parseFloat(enganche).toFixed(2);
    $scope.avaluoBancomer = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBancomer = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBancomer = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBancomer = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.afirme = Simula.getForCalc(5, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.afirme.aforo;
    factorPago = $scope.afirme.factorDePago;
    tasaInteres = $scope.afirme.tasaDeInteres;
    cat = $scope.afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.afirme.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 5);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catAfirme = (cat * 100).toFixed(2) + '%';
    $scope.engancheAfirme = parseFloat(enganche).toFixed(2);
    $scope.avaluoAfirme = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.banamex = Simula.getForCalc(6, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.banamex.aforo;
    factorPago = $scope.banamex.factorDePago;
    tasaInteres = $scope.banamex.tasaDeInteres;
    cat = $scope.banamex.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.banamex.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 6);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 6, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 6);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoBanamex = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualBanamex = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresBanamex = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoBanamex = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catBanamex = (cat * 100).toFixed(2) + '%';
    $scope.engancheBanamex = parseFloat(enganche).toFixed(2);
    $scope.avaluoBanamex = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaBanamex = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesBanamex = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalBanamex = parseFloat(desembolsoTotal).toFixed(2);

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
    $scope.hsbc = Simula.getForCalc(7, $scope.selMens, $scope.selPlazo);
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = $scope.hsbc.aforo;
    factorPago = $scope.hsbc.factorDePago;
    tasaInteres = $scope.hsbc.tasaDeInteres;
    cat = $scope.hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito($scope.hsbc.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 7);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluo($scope.valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    $scope.montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    $scope.pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    $scope.tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    $scope.ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    $scope.catHSBC = (cat * 100).toFixed(2) + '%';
    $scope.engancheHSBC = parseFloat(enganche).toFixed(2);
    $scope.avaluoHSBC = parseFloat(avaluo).toFixed(2);
    $scope.comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    $scope.gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    $scope.desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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

control.controller('SimulaCtrl', function ($scope, $ionicPopup, $state, Estados, Plazos, Mensualidades) {
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

            if ($scope.data.selMens === "2") {
                if ($scope.data.selPlazo === "1") {
                    if ($scope.data.selEstado === 0) {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                    }
                    else {
                        $state.go("resultado20Creciente", {
                            valor: $scope.data.valor,
                            selMens: $scope.data.selMens,
                            selEstado: $scope.data.selEstado,
                            selPlazo: $scope.data.selPlazo
                        });
                    }
                }
                else if ($scope.data.selPlazo === "2") {
                    if ($scope.data.selEstado === 0) {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                    }
                    else {
                        $state.go("resultado15Creciente", {
                            valor: $scope.data.valor,
                            selMens: $scope.data.selMens,
                            selEstado: $scope.data.selEstado,
                            selPlazo: $scope.data.selPlazo
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
                        $state.go("resultado20Fijo", {
                            valor: $scope.data.valor,
                            selMens: $scope.data.selMens,
                            selEstado: $scope.data.selEstado,
                            selPlazo: $scope.data.selPlazo
                        });
                    }
                }
                else if ($scope.data.selPlazo === "2") {
                    if ($scope.data.selEstado === 0) {
                        muestraMensaje("Error", "No es posible realizar el c&aacute;lculo debido a que no ha seleccionado un estado");
                    }
                    else {
                        $state.go("resultado15Fijo", {
                            valor: $scope.data.valor,
                            selMens: $scope.data.selMens,
                            selEstado: $scope.data.selEstado,
                            selPlazo: $scope.data.selPlazo
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

