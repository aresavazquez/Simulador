Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var control = angular.module('app.controllers', [])

control.controller('DashCtrl', function ($scope, Estados, Plazos, Mensualidades, $cordovaEmailComposer, $cordovaPrinter,
    Simula, Calculos, Avaluos, GastosNotariales) {
    $scope.data = {
        valorInmueble:null,
        selEstado: 0,
        selMens: 0,
        selPlazo: 0,
        nombre: '',
        correo: '',
        telefono: '',
    };
    $scope.estados = Estados.all();
    $scope.plazos = Plazos.all();
    $scope.mensualidades = Mensualidades.all();

    //$scope.print = function () {
    //    if ($cordovaPrinter.isAvailable()) {
    //        $cordovaPrinter.print("<b>This a test</b>");
    //    } else {
    //        alert("Printing is not available on device");
    //    }
    //};

    $scope.enviarMail = function () {
        $cordovaEmailComposer.isAvailable().then(function () {
        }, function () {
        });
        selMens = $scope.data.selMens;
        selPlazo = $scope.data.selPlazo;
        valorInmueble = $scope.data.valorInmueble;
        gastosNotarialesXEstado = GastosNotariales.get($scope.data.selEstado).gastoNotarial;
        documento = "";
        if($scope.data.selMens === "2"){
            if($scope.data.selPlazo === "2"){
                documento = textCorreo15Crecimiento(selMens, selPlazo, valorInmueble,
                    Simula, Calculos, Avaluos, gastosNotarialesXEstado);
            }else{
                documento = textCorreo20Crecimiento(selMens, selPlazo, valorInmueble,
                    Simula, Calculos, Avaluos, gastosNotarialesXEstado);
            }
        } else if ($scope.data.selMens === "1") {
            if ($scope.data.selPlazo === "2") {
                documento = textCorreo15Fijo(selMens, selPlazo, valorInmueble,
                    Simula, Calculos, Avaluos, gastosNotarialesXEstado);
            } else {
                documento = textCorreo20Fijo(selMens, selPlazo, valorInmueble,
                    Simula, Calculos, Avaluos, gastosNotarialesXEstado);
            }
        }
        
        mensaje = "Estimado " + $scope.data.nombre +
            " a continuaci&oacute;n se le proporciona el ejercicio realizado para calcular su cr&eacute;dito: <br/><br/><br/>" + documento;
        var email = {
            to: $scope.data.correo,
            cc: '',
            bcc: [''],
            attachments: null,
            subject: 'Calculos del simulador',
            body: mensaje,
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function () {
        });
    }
});

function textCorreo20Fijo(selMens, selPlazo, valor, Simula, Calculos, Avaluos) {
    //Banorte
    banorte = Simula.getForCalc(1, selMens, selPlazo);

    aforo = banorte.aforo;
    factorPago = banorte.factorDePago;
    tasaInteres = banorte.tasaDeInteres;
    cat = banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banorte.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 1);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    catBanorte = (cat * 100).toFixed(2) + '%';
    engancheBanorte = parseFloat(enganche).toFixed(2);
    avaluoBanorte = parseFloat(avaluo).toFixed(2);
    comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    santander = Simula.getForCalc(2, selMens, selPlazo);

    aforo = santander.aforo;
    factorPago = santander.factorDePago;
    tasaInteres = santander.tasaDeInteres;
    cat = santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito(santander.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 2);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    catSantander = (cat * 100).toFixed(2) + '%';
    engancheSantander = parseFloat(enganche).toFixed(2);
    avaluoSantander = parseFloat(avaluo).toFixed(2);
    comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    scotiabank = Simula.getForCalc(3, selMens, selPlazo);

    aforo = scotiabank.aforo;
    factorPago = scotiabank.factorDePago;
    tasaInteres = scotiabank.tasaDeInteres;
    cat = scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 3);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    catScotiabank = (cat * 100).toFixed(2) + '%';
    engancheScotiabank = parseFloat(enganche).toFixed(2);
    avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    bancomer = Simula.getForCalc(4, selMens, selPlazo);

    aforo = bancomer.aforo;
    factorPago = bancomer.factorDePago;
    tasaInteres = bancomer.tasaDeInteres;
    cat = bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito(bancomer.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 4);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 4, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
    pagoMensualBancomer = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBancomer = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBancomer = parseFloat(ingresoRequerido).toFixed(2);
    catBancomer = (cat * 100).toFixed(2) + '%';
    engancheBancomer = parseFloat(enganche).toFixed(2);
    avaluoBancomer = parseFloat(avaluo).toFixed(2);
    comisionAperturaBancomer = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBancomer = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBancomer = parseFloat(desembolsoTotal).toFixed(2);

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
    afirme = Simula.getForCalc(5, selMens, selPlazo);

    aforo = afirme.aforo;
    factorPago = afirme.factorDePago;
    tasaInteres = afirme.tasaDeInteres;
    cat = afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 5);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    catAfirme = (cat * 100).toFixed(2) + '%';
    engancheAfirme = parseFloat(enganche).toFixed(2);
    avaluoAfirme = parseFloat(avaluo).toFixed(2);
    comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    banamex = Simula.getForCalc(6, selMens, selPlazo);

    aforo = banamex.aforo;
    factorPago = banamex.factorDePago;
    tasaInteres = banamex.tasaDeInteres;
    cat = banamex.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banamex.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 6);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 6, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 6);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBanamex = parseFloat(montoCredito).toFixed(2);
    pagoMensualBanamex = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBanamex = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBanamex = parseFloat(ingresoRequerido).toFixed(2);
    catBanamex = (cat * 100).toFixed(2) + '%';
    engancheBanamex = parseFloat(enganche).toFixed(2);
    avaluoBanamex = parseFloat(avaluo).toFixed(2);
    comisionAperturaBanamex = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBanamex = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBanamex = parseFloat(desembolsoTotal).toFixed(2);

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
    hsbc = Simula.getForCalc(7, selMens, selPlazo);

    aforo = hsbc.aforo;
    factorPago = hsbc.factorDePago;
    tasaInteres = hsbc.tasaDeInteres;
    cat = hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 7);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    catHSBC = (cat * 100).toFixed(2) + '%';
    engancheHSBC = parseFloat(enganche).toFixed(2);
    avaluoHSBC = parseFloat(avaluo).toFixed(2);
    comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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
    cadena = "<!DOCTYPE html><html><head><title></title></head><body>" +
                    banorte.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBanorte + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBanorte + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBanorte + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBanorte + "<br/>" +
        "CAT: $ " + catBanorte + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBanorte + "<br/>" +
        "Avaluo: $ " + avaluoBanorte + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBanorte + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBanorte + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBanorte + "<br/><br/>" +
        santander.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualSantander + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoSantander + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresSantander + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoSantander + "<br/>" +
        "CAT: $ " + catSantander + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheSantander + "<br/>" +
        "Avaluo: $ " + avaluoSantander + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesSantander + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalSantander + "<br/><br/>" +
        scotiabank.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualScotiabank + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoScotiabank + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresScotiabank + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoScotiabank + "<br/>" +
        "CAT: $ " + catScotiabank + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheScotiabank + "<br/>" +
        "Avaluo: $ " + avaluoScotiabank + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesScotiabank + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalScotiabank + "<br/><br/>" +
        bancomer.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBancomer + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBancomer + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBancomer + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBancomer + "<br/>" +
        "CAT: $ " + catBancomer + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBancomer + "<br/>" +
        "Avaluo: $ " + avaluoBancomer + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBancomer + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBancomer + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBancomer + "<br/><br/>" +
        afirme.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualAfirme + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoAfirme + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresAfirme + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoAfirme + "<br/>" +
        "CAT: $ " + catAfirme + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheAfirme + "<br/>" +
        "Avaluo: $ " + avaluoAfirme + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesAfirme + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalAfirme + "<br/><br/>" +
        banamex.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBanamex + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBanamex + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBanamex + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBanamex + "<br/>" +
        "CAT: $ " + catBanamex + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBanamex + "<br/>" +
        "Avaluo: $ " + avaluoBanamex + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBanamex + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBanamex + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBanamex + "<br/><br/>" +
        hsbc.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualHSBC + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoHSBC + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresHSBC + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoHSBC + "<br/>" +
        "CAT: $ " + catHSBC + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheHSBC + "<br/>" +
        "Avaluo: $ " + avaluoHSBC + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesHSBC + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalHSBC + "<br/><br/>" +
            "</body></html>";
    return cadena;
};

function textCorreo15Fijo(selMens, selPlazo, valor, Simula, Calculos, Avaluos) {
    //Banorte
    banorte = Simula.getForCalc(1, selMens, selPlazo);

    aforo = banorte.aforo;
    factorPago = banorte.factorDePago;
    tasaInteres = banorte.tasaDeInteres;
    cat = banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banorte.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 1);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    catBanorte = (cat * 100).toFixed(2) + '%';
    engancheBanorte = parseFloat(enganche).toFixed(2);
    avaluoBanorte = parseFloat(avaluo).toFixed(2);
    comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    santander = Simula.getForCalc(2, selMens, selPlazo);

    aforo = santander.aforo;
    factorPago = santander.factorDePago;
    tasaInteres = santander.tasaDeInteres;
    cat = santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito(santander.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 2);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    catSantander = (cat * 100).toFixed(2) + '%';
    engancheSantander = parseFloat(enganche).toFixed(2);
    avaluoSantander = parseFloat(avaluo).toFixed(2);
    comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    scotiabank = Simula.getForCalc(3, selMens, selPlazo);

    aforo = scotiabank.aforo;
    factorPago = scotiabank.factorDePago;
    tasaInteres = scotiabank.tasaDeInteres;
    cat = scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 3);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    catScotiabank = (cat * 100).toFixed(2) + '%';
    engancheScotiabank = parseFloat(enganche).toFixed(2);
    avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    bancomer = Simula.getForCalc(4, selMens, selPlazo);

    aforo = bancomer.aforo;
    factorPago = bancomer.factorDePago;
    tasaInteres = bancomer.tasaDeInteres;
    cat = bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito(bancomer.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 4);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 4, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
    pagoMensualBancomer = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBancomer = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBancomer = parseFloat(ingresoRequerido).toFixed(2);
    catBancomer = (cat * 100).toFixed(2) + '%';
    engancheBancomer = parseFloat(enganche).toFixed(2);
    avaluoBancomer = parseFloat(avaluo).toFixed(2);
    comisionAperturaBancomer = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBancomer = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBancomer = parseFloat(desembolsoTotal).toFixed(2);

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
    afirme = Simula.getForCalc(5, selMens, selPlazo);

    aforo = afirme.aforo;
    factorPago = afirme.factorDePago;
    tasaInteres = afirme.tasaDeInteres;
    cat = afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 5);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    catAfirme = (cat * 100).toFixed(2) + '%';
    engancheAfirme = parseFloat(enganche).toFixed(2);
    avaluoAfirme = parseFloat(avaluo).toFixed(2);
    comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    banamex = Simula.getForCalc(6, selMens, selPlazo);

    aforo = banamex.aforo;
    factorPago = banamex.factorDePago;
    tasaInteres = banamex.tasaDeInteres;
    cat = banamex.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banamex.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 6);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 6, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 6);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBanamex = parseFloat(montoCredito).toFixed(2);
    pagoMensualBanamex = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBanamex = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBanamex = parseFloat(ingresoRequerido).toFixed(2);
    catBanamex = (cat * 100).toFixed(2) + '%';
    engancheBanamex = parseFloat(enganche).toFixed(2);
    avaluoBanamex = parseFloat(avaluo).toFixed(2);
    comisionAperturaBanamex = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBanamex = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBanamex = parseFloat(desembolsoTotal).toFixed(2);

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
    hsbc = Simula.getForCalc(7, selMens, selPlazo);

    aforo = hsbc.aforo;
    factorPago = hsbc.factorDePago;
    tasaInteres = hsbc.tasaDeInteres;
    cat = hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequerido(pagoMensual, 7);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluo(valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    catHSBC = (cat * 100).toFixed(2) + '%';
    engancheHSBC = parseFloat(enganche).toFixed(2);
    avaluoHSBC = parseFloat(avaluo).toFixed(2);
    comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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
    cadena = "<!DOCTYPE html><html><head><title></title></head><body>" +
                    banorte.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBanorte + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBanorte + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBanorte + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBanorte + "<br/>" +
        "CAT: $ " + catBanorte + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBanorte + "<br/>" +
        "Avaluo: $ " + avaluoBanorte + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBanorte + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBanorte + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBanorte + "<br/><br/>" +
        santander.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualSantander + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoSantander + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresSantander + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoSantander + "<br/>" +
        "CAT: $ " + catSantander + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheSantander + "<br/>" +
        "Avaluo: $ " + avaluoSantander + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesSantander + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalSantander + "<br/><br/>" +
        scotiabank.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualScotiabank + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoScotiabank + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresScotiabank + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoScotiabank + "<br/>" +
        "CAT: $ " + catScotiabank + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheScotiabank + "<br/>" +
        "Avaluo: $ " + avaluoScotiabank + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesScotiabank + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalScotiabank + "<br/><br/>" +
        bancomer.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBancomer + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBancomer + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBancomer + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBancomer + "<br/>" +
        "CAT: $ " + catBancomer + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBancomer + "<br/>" +
        "Avaluo: $ " + avaluoBancomer + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBancomer + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBancomer + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBancomer + "<br/><br/>" +
        afirme.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualAfirme + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoAfirme + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresAfirme + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoAfirme + "<br/>" +
        "CAT: $ " + catAfirme + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheAfirme + "<br/>" +
        "Avaluo: $ " + avaluoAfirme + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesAfirme + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalAfirme + "<br/><br/>" +
        banamex.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBanamex + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBanamex + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBanamex + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBanamex + "<br/>" +
        "CAT: $ " + catBanamex + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBanamex + "<br/>" +
        "Avaluo: $ " + avaluoBanamex + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBanamex + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBanamex + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBanamex + "<br/><br/>" +
        hsbc.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualHSBC + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoHSBC + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresHSBC + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoHSBC + "<br/>" +
        "CAT: $ " + catHSBC + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheHSBC + "<br/>" +
        "Avaluo: $ " + avaluoHSBC + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesHSBC + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalHSBC + "<br/><br/>" +
            "</body></html>";
    return cadena;
};

function textCorreo20Crecimiento(selMens, selPlazo, valor, Simula, Calculos, Avaluos) {
    //Banorte
    banorte = Simula.getForCalc(1, selMens, selPlazo);

    aforo = banorte.aforo;
    factorPago = banorte.factorDePago;
    tasaInteres = banorte.tasaDeInteres;
    cat = banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banorte.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 1);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    incrementoAnualBanorte = parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%"
    pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    catBanorte = (cat * 100).toFixed(2) + '%';
    engancheBanorte = parseFloat(enganche).toFixed(2);
    avaluoBanorte = parseFloat(avaluo).toFixed(2);
    comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    santander = Simula.getForCalc(2, selMens, selPlazo);

    aforo = santander.aforo;
    factorPago = santander.factorDePago;
    tasaInteres = santander.tasaDeInteres;
    cat = santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito(santander.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    incrementoAnualSantander = parseFloat(santander.incrementoAnual * 100).toFixed(2) + "%"
    tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    catSantander = (cat * 100).toFixed(2) + '%';
    engancheSantander = parseFloat(enganche).toFixed(2);
    avaluoSantander = parseFloat(avaluo).toFixed(2);
    comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    scotiabank = Simula.getForCalc(3, selMens, selPlazo);

    aforo = scotiabank.aforo;
    factorPago = scotiabank.factorDePago;
    tasaInteres = scotiabank.tasaDeInteres;
    cat = scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = pagoMensual*2.5;

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    incrementoAnualScotiabank = parseFloat(scotiabank.incrementoAnual * 100).toFixed(2) + "%"
    tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    catScotiabank = (cat * 100).toFixed(2) + '%';
    engancheScotiabank = parseFloat(enganche).toFixed(2);
    avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    bancomer = Simula.getForCalc(4, selMens, selPlazo);

    aforo = bancomer.aforo;
    factorPago = bancomer.factorDePago;
    tasaInteres = bancomer.tasaDeInteres;
    cat = bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito(bancomer.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 4);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 4, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
    pagoMensualBancomer = parseFloat(pagoMensual).toFixed(2);
    incrementoAnualBancomer = parseFloat(bancomer.incrementoAnual * 100).toFixed(2) + "%"
    tasaDeInteresBancomer = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBancomer = parseFloat(ingresoRequerido).toFixed(2);
    catBancomer = (cat * 100).toFixed(2) + '%';
    engancheBancomer = parseFloat(enganche).toFixed(2);
    avaluoBancomer = parseFloat(avaluo).toFixed(2);
    comisionAperturaBancomer = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBancomer = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBancomer = parseFloat(desembolsoTotal).toFixed(2);

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
    afirme = Simula.getForCalc(5, selMens, selPlazo);

    aforo = afirme.aforo;
    factorPago = afirme.factorDePago;
    tasaInteres = afirme.tasaDeInteres;
    cat = afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 5);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    incrementoAnualAfirme = parseFloat(afirme.incrementoAnual * 100).toFixed(2) + "%"
    tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    catAfirme = (cat * 100).toFixed(2) + '%';
    engancheAfirme = parseFloat(enganche).toFixed(2);
    avaluoAfirme = parseFloat(avaluo).toFixed(2);
    comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    hsbc = Simula.getForCalc(7, selMens, selPlazo);

    aforo = hsbc.aforo;
    factorPago = hsbc.factorDePago;
    tasaInteres = hsbc.tasaDeInteres;
    cat = hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 7);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    incrementoAnualHSBC = parseFloat(hsbc.incrementoAnual * 100).toFixed(2) + "%"
    pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    catHSBC = (cat * 100).toFixed(2) + '%';
    engancheHSBC = parseFloat(enganche).toFixed(2);
    avaluoHSBC = parseFloat(avaluo).toFixed(2);
    comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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
    cadena = "<!DOCTYPE html><html><head><title></title></head><body>" +
                    banorte.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBanorte + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBanorte + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBanorte + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBanorte + "<br/>" +
        "Incremento anual de pago: $ " + incrementoAnualBanorte + "<br/>" +
        "CAT: $ " + catBanorte + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBanorte + "<br/>" +
        "Avaluo: $ " + avaluoBanorte + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBanorte + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBanorte + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBanorte + "<br/><br/>" +
        santander.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualSantander + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoSantander + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresSantander + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoSantander + "<br/>" +
        "Incremento anual de pago: $ " + incrementoAnualSantander+ "<br/>" +
        "CAT: $ " + catSantander + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheSantander + "<br/>" +
        "Avaluo: $ " + avaluoSantander + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesSantander + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalSantander + "<br/><br/>" +
        scotiabank.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualScotiabank + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoScotiabank + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresScotiabank + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoScotiabank + "<br/>" +
        "Incremento anual de pago: $ " + incrementoAnualScotiabank + "<br/>" +
        "CAT: $ " + catScotiabank + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheScotiabank + "<br/>" +
        "Avaluo: $ " + avaluoScotiabank + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesScotiabank + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalScotiabank + "<br/><br/>" +
         bancomer.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualBancomer + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoBancomer + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresBancomer + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoBancomer + "<br/>" +
        "Incremento anual de pago: $ " + incrementoAnualBancomer + "<br/>" +
        "CAT: $ " + catBancomer + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheBancomer + "<br/>" +
        "Avaluo: $ " + avaluoBancomer + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaBancomer + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesBancomer + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalBancomer + "<br/><br/>" +
        afirme.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualAfirme + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoAfirme + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresAfirme + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoAfirme + "<br/>" +
        "Incremento anual de pago: $ " + incrementoAnualAfirme + "<br/>" +
        "CAT: $ " + catAfirme + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheAfirme + "<br/>" +
        "Avaluo: $ " + avaluoAfirme + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesAfirme + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalAfirme + "<br/><br/>" +
        hsbc.nombreBanco + "<br/>" +
            "Pago mensual: $ " + pagoMensualHSBC + " <br/>" +
            "Monto del cr&eacute;dito: $ " + montoCreditoHSBC + " <br/>" +
            "Tasa de interes: $" + tasaDeInteresHSBC + "<br/>" +
        "Ingreso requerido: $ " + ingresoRequeridoHSBC + "<br/>" +
        "Incremento anual de pago: $ " + incrementoAnualHSBC + "<br/>" +
        "CAT: $ " + catHSBC + "<br/>" +
        "Gastos del cr&eacute;dito <br/>" +
        "Enganche: $ " + engancheHSBC + "<br/>" +
        "Avaluo: $ " + avaluoHSBC + "<br/>" +
        "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" +
        "Gastos notariales: $ " + gastosNotarialesHSBC + "<br/>" +
        "Desembolso Total: $ " + desembolsoTotalHSBC + "<br/><br/>" +
            "</body></html>";
    return cadena;
};

function textCorreo15Crecimiento(selMens, selPlazo, valor, Simula, Calculos, Avaluos) {
    //Banorte
    banorte = Simula.getForCalc(1, selMens, selPlazo);

    aforo = banorte.aforo;
    factorPago = banorte.factorDePago;
    tasaInteres =banorte.tasaDeInteres;
    cat = banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banorte.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 1);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 1, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    incrementoAnualBanorte = parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%"
    pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresBanorte = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoBanorte = parseFloat(ingresoRequerido).toFixed(2);
    catBanorte = (cat * 100).toFixed(2) + '%';
    engancheBanorte = parseFloat(enganche).toFixed(2);
    avaluoBanorte = parseFloat(avaluo).toFixed(2);
    comisionAperturaBanorte = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesBanorte = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalBanorte = parseFloat(desembolsoTotal).toFixed(2);

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
    santander = Simula.getForCalc(2, selMens, selPlazo);

    aforo = santander.aforo;
    factorPago = santander.factorDePago;
    tasaInteres = santander.tasaDeInteres;
    cat = santander.cat;

    montoCredito = Calculos.calculaMotoDelCredito(santander.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    incrementoAnualSantander = parseFloat(santander.incrementoAnual * 100).toFixed(2) + "%"
    tasaDeInteresSantander = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoSantander = parseFloat(ingresoRequerido).toFixed(2);
    catSantander = (cat * 100).toFixed(2) + '%';
    engancheSantander = parseFloat(enganche).toFixed(2);
    avaluoSantander = parseFloat(avaluo).toFixed(2);
    comisionAperturaSantander = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesSantander = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalSantander = parseFloat(desembolsoTotal).toFixed(2);

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
    scotiabank = Simula.getForCalc(3, selMens, selPlazo);

    aforo = scotiabank.aforo;
    factorPago = scotiabank.factorDePago;
    tasaInteres = scotiabank.tasaDeInteres;
    cat = scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 3);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    incrementoAnualScotiabank = parseFloat(scotiabank.incrementoAnual * 100).toFixed(2) + "%"
    tasaDeInteresScotiabank = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoScotiabank = parseFloat(ingresoRequerido).toFixed(2);
    catScotiabank = (cat * 100).toFixed(2) + '%';
    engancheScotiabank = parseFloat(enganche).toFixed(2);
    avaluoScotiabank = parseFloat(avaluo).toFixed(2);
    comisionAperturaScotiabank = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesScotiabank = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalScotiabank = parseFloat(desembolsoTotal).toFixed(2);

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
    afirme = Simula.getForCalc(5, selMens, selPlazo);

    aforo = afirme.aforo;
    factorPago = afirme.factorDePago;
    tasaInteres = afirme.tasaDeInteres;
    cat = afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 5);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    incrementoAnualAfirme = parseFloat(afirme.incrementoAnual * 100).toFixed(2) + "%"
    tasaDeInteresAfirme = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoAfirme = parseFloat(ingresoRequerido).toFixed(2);
    catAfirme = (cat * 100).toFixed(2) + '%';
    engancheAfirme = parseFloat(enganche).toFixed(2);
    avaluoAfirme = parseFloat(avaluo).toFixed(2);
    comisionAperturaAfirme = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesAfirme = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalAfirme = parseFloat(desembolsoTotal).toFixed(2);

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
    hsbc = Simula.getForCalc(7, selMens, selPlazo);

    aforo = hsbc.aforo;
    factorPago = hsbc.factorDePago;
    tasaInteres = hsbc.tasaDeInteres;
    cat = hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 7);

    enganche = Calculos.calculoEnganche(valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente(valor, 7, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    gastosNotariales = Calculos.calculoGastosNotariales(valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    incrementoAnualHSBC = parseFloat(hsbc.incrementoAnual * 100).toFixed(2) + "%"
    pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    tasaDeInteresHSBC = (tasaInteres * 100).toFixed(2) + '%';
    ingresoRequeridoHSBC = parseFloat(ingresoRequerido).toFixed(2);
    catHSBC = (cat * 100).toFixed(2) + '%';
    engancheHSBC = parseFloat(enganche).toFixed(2);
    avaluoHSBC = parseFloat(avaluo).toFixed(2);
    comisionAperturaHSBC = parseFloat(comisionApertura).toFixed(2);
    gastosNotarialesHSBC = parseFloat(gastosNotariales).toFixed(2);
    desembolsoTotalHSBC = parseFloat(desembolsoTotal).toFixed(2);

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
    cadena = "<!DOCTYPE html><html><head><title></title></head><body>" +
                    banorte.nombreBanco+"<br/>"+
            "Pago mensual: $ "+pagoMensualBanorte+" <br/>"+
            "Monto del cr&eacute;dito: $ "+montoCreditoBanorte+" <br/>"+
            "Tasa de interes: $"+ tasaDeInteresBanorte+"<br/>"+
        "Ingreso requerido: $ "+ingresoRequeridoBanorte+"<br/>"+
        "Incremento anual de pago: $ "+incrementoAnualBanorte+"<br/>"+
        "CAT: $ "+ catBanorte+"<br/>"+
        "Gastos del cr&eacute;dito <br/>"+
        "Enganche: $ "+engancheBanorte+"<br/>"+
        "Avaluo: $ "+avaluoBanorte+"<br/>"+
        "Comisi&oacute;n por apertura: $ "+comisionAperturaBanorte+"<br/>"+
        "Gastos notariales: $ "+gastosNotarialesBanorte+"<br/>"+
        "Desembolso Total: $ "+desembolsoTotalBanorte+"<br/><br/>"+
        santander.nombreBanco+"<br/>"+
            "Pago mensual: $ "+pagoMensualSantander+" <br/>"+
            "Monto del cr&eacute;dito: $ "+montoCreditoSantander+" <br/>"+
            "Tasa de interes: $"+ tasaDeInteresSantander+"<br/>"+
        "Ingreso requerido: $ "+ingresoRequeridoSantander+"<br/>"+
        "Incremento anual de pago: $ "+incrementoAnualSantander+"<br/>"+
        "CAT: $ "+ catSantander+"<br/>"+
        "Gastos del cr&eacute;dito <br/>"+
        "Enganche: $ "+engancheSantander+"<br/>"+
        "Avaluo: $ "+avaluoSantander+"<br/>"+
        "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" +
        "Gastos notariales: $ "+gastosNotarialesSantander+"<br/>"+
        "Desembolso Total: $ "+desembolsoTotalSantander+"<br/><br/>"+
        scotiabank.nombreBanco+"<br/>"+
            "Pago mensual: $ "+pagoMensualScotiabank+" <br/>"+
            "Monto del cr&eacute;dito: $ "+montoCreditoScotiabank+" <br/>"+
            "Tasa de interes: $"+ tasaDeInteresScotiabank+"<br/>"+
        "Ingreso requerido: $ "+ingresoRequeridoScotiabank+"<br/>"+
        "Incremento anual de pago: $ "+incrementoAnualScotiabank+"<br/>"+
        "CAT: $ "+ catScotiabank+"<br/>"+
        "Gastos del cr&eacute;dito <br/>"+
        "Enganche: $ "+engancheScotiabank+"<br/>"+
        "Avaluo: $ "+avaluoScotiabank+"<br/>"+
        "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" +
        "Gastos notariales: $ "+gastosNotarialesScotiabank+"<br/>"+
        "Desembolso Total: $ "+desembolsoTotalScotiabank+"<br/><br/>"+
        afirme.nombreBanco+"<br/>"+
            "Pago mensual: $ "+pagoMensualAfirme+" <br/>"+
            "Monto del cr&eacute;dito: $ "+montoCreditoAfirme+" <br/>"+
            "Tasa de interes: $"+ tasaDeInteresAfirme+"<br/>"+
        "Ingreso requerido: $ "+ingresoRequeridoAfirme+"<br/>"+
        "Incremento anual de pago: $ "+incrementoAnualAfirme+"<br/>"+
        "CAT: $ "+ catAfirme+"<br/>"+
        "Gastos del cr&eacute;dito <br/>"+
        "Enganche: $ "+engancheAfirme+"<br/>"+
        "Avaluo: $ "+avaluoAfirme+"<br/>"+
        "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" +
        "Gastos notariales: $ "+gastosNotarialesAfirme+"<br/>"+
        "Desembolso Total: $ "+desembolsoTotalAfirme+"<br/><br/>"+
        hsbc.nombreBanco+"<br/>"+
            "Pago mensual: $ "+pagoMensualHSBC+" <br/>"+
            "Monto del cr&eacute;dito: $ "+montoCreditoHSBC+" <br/>"+
            "Tasa de interes: $"+ tasaDeInteresHSBC+"<br/>"+
        "Ingreso requerido: $ "+ingresoRequeridoHSBC+"<br/>"+
        "Incremento anual de pago: $ "+incrementoAnualHSBC+"<br/>"+
        "CAT: $ "+ catHSBC+"<br/>"+
        "Gastos del cr&eacute;dito <br/>"+
        "Enganche: $ "+engancheHSBC+"<br/>"+
        "Avaluo: $ "+avaluoHSBC+"<br/>"+
        "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" +
        "Gastos notariales: $ "+gastosNotarialesHSBC+"<br/>"+
        "Desembolso Total: $ "+desembolsoTotalHSBC+"<br/><br/>"+
            "</body></html>";
    return cadena;
};

control.controller('Res15CrecienteCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
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

    //Banorte
    banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
    var grpBanorte = [];
    grpBanorte.push({
        name: banorte.nombreBanco,
        members:[]
    });

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

    grpBanorte[0].members.push({ name: "Pago mensual", quantity: '$'+pagoMensual.formatMoney(2,'.',',') });
    grpBanorte[0].members.push({ name: "Monto del credito", quantity: '$'+montoCredito.formatMoney(2,'.',',') });
    grpBanorte[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpBanorte[0].members.push({ name: "Ingreso requerido", quantity: '$'+ingresoRequerido.formatMoney(2,'.',',') });
    grpBanorte[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpBanorte[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpBanorte[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpBanorte[0].members.push({ name: "Enganche", quantity: '$' + enganche.formatMoney(2,'.',',') });
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
    var grpSantander = [];
    grpSantander.push({
        name: santander.nombreBanco,
        members: []
    });

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
    var grpScotiabank = [];
    grpScotiabank.push({
        name: scotiabank.nombreBanco,
        members: []
    });  

    aforo = scotiabank.aforo;
    factorPago = scotiabank.factorDePago;
    tasaInteres =scotiabank.tasaDeInteres;
    cat = scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 3);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 3, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

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
    var grpAfirme = [];
    grpAfirme.push({
        name: afirme.nombreBanco,
        members: []
    });

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
    var grpHSBC= [];
    grpHSBC.push({
        name: hsbc.nombreBanco,
        members: []
    });

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

control.controller('Res20CrecienteCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
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
    //Banorte
    banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
    var grpBanorte = [];
    grpBanorte.push({
        name: banorte.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

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
    //ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 1);

    //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    //avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 1, Avaluos);
    //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 1);
    //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    //$scope.montoCreditoBanorte = parseFloat(montoCredito).toFixed(2);
    //$scope.pagoMensualBanorte = parseFloat(pagoMensual).toFixed(2);
    //$scope.incrementoAnualBanorte = parseFloat($scope.banorte.incrementoAnual * 100).toFixed(2);
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
    var grpSantander = [];
    grpSantander.push({
        name: santander.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

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
    //ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    //avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    //$scope.montoCreditoSantander = parseFloat(montoCredito).toFixed(2);
    //$scope.pagoMensualSantander = parseFloat(pagoMensual).toFixed(2);
    //$scope.incrementoAnualSantander = parseFloat($scope.santander.incrementoAnual * 100).toFixed(2);
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
    var grpScotiabank = [];
    grpScotiabank.push({
        name: scotiabank.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = scotiabank.aforo;
    factorPago = scotiabank.factorDePago;
    tasaInteres = scotiabank.tasaDeInteres;
    cat = scotiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito(scotiabank.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

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
    //ingresoRequerido = pagoMensual * 2.5;

    //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    //avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 3, Avaluos);
    //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 3);
    //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    //$scope.montoCreditoScotiabank = parseFloat(montoCredito).toFixed(2);
    //$scope.pagoMensualScotiabank = parseFloat(pagoMensual).toFixed(2);
    //$scope.incrementoAnualScotiabank = parseFloat($scope.scotiabank.incrementoAnual * 100).toFixed(2);
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
    var grpBancomer = [];
    grpBancomer.push({
        name: bancomer.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = bancomer.aforo;
    factorPago = bancomer.factorDePago;
    tasaInteres = bancomer.tasaDeInteres;
    cat = bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito(bancomer.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

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
    //ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 4);

    //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    //avaluo = Calculos.calcularAvaluo($scope.valor, 4, Avaluos);
    //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 4);
    //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    //$scope.montoCreditoBancomer = parseFloat(montoCredito).toFixed(2);
    //$scope.incrementoAnualBancomer = parseFloat($scope.bancomer.incrementoAnual * 100).toFixed(2);
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
    var grpAfirme = [];
    grpAfirme.push({
        name: afirme.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = afirme.aforo;
    factorPago = afirme.factorDePago;
    tasaInteres = afirme.tasaDeInteres;
    cat = afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 5);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 5, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

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
    //ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 5);

    //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    //avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 5, Avaluos);
    //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 5);
    //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    //$scope.montoCreditoAfirme = parseFloat(montoCredito).toFixed(2);
    //$scope.pagoMensualAfirme = parseFloat(pagoMensual).toFixed(2);
    //$scope.incrementoAnualAfirme = parseFloat($scope.afirme.incrementoAnual * 100).toFixed(2);
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

    // HSBC
    hsbc = Simula.getForCalc(7, $scope.selMens, $scope.selPlazo);
    var grpHSBC = [];
    grpHSBC.push({
        name: hsbc.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = hsbc.aforo;
    factorPago = hsbc.factorDePago;
    tasaInteres = hsbc.tasaDeInteres;
    cat = hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

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
    //ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 7);

    //enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    //avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 7, Avaluos);
    //comisionApertura = Calculos.calculoComisionApertura(montoCredito, 7);
    //gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    //desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    //$scope.montoCreditoHSBC = parseFloat(montoCredito).toFixed(2);
    //$scope.pagoMensualHSBC = parseFloat(pagoMensual).toFixed(2);
    //$scope.incrementoAnualHSBC = parseFloat($scope.hsbc.incrementoAnual * 100).toFixed(2);
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

control.controller('Res15FijoCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
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

    //Banorte
    banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
    var grpBanorte = [];
    grpBanorte.push({
        name: banorte.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = banorte.aforo;
    factorPago = banorte.factorDePago;
    tasaInteres = banorte.tasaDeInteres;
    cat = banorte.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banorte.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

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
    var grpSantander = [];
    grpSantander.push({
        name: santander.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

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
    soctiabank = Simula.getForCalc(3, $scope.selMens, $scope.selPlazo);
    var grpScotiabank = [];
    grpScotiabank.push({
        name: soctiabank.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = soctiabank.aforo;
    factorPago = soctiabank.factorDePago;
    tasaInteres = soctiabank.tasaDeInteres;
    cat = soctiabank.cat;

    montoCredito = Calculos.calculaMotoDelCredito(soctiabank.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

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
    var grpBancomer = [];
    grpBancomer.push({
        name: bancomer.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = bancomer.aforo;
    factorPago = bancomer.factorDePago;
    tasaInteres = bancomer.tasaDeInteres;
    cat = bancomer.cat;

    montoCredito = Calculos.calculaMotoDelCredito(bancomer.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    grpBancomer[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpBancomer[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpBancomer[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpBancomer[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpBancomer[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpBancomer[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpAfirme = [];
    grpAfirme.push({
        name: afirme.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = afirme.aforo;
    factorPago = afirme.factorDePago;
    tasaInteres = afirme.tasaDeInteres;
    cat = afirme.cat;

    montoCredito = Calculos.calculaMotoDelCredito(afirme.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    grpAfirme[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpAfirme[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpAfirme[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpAfirme[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpAfirme[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpAfirme[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpBanamex = [];
    grpBanamex.push({
        name: banamex.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = banamex.aforo;
    factorPago = banamex.factorDePago;
    tasaInteres = banamex.tasaDeInteres;
    cat = banamex.cat;

    montoCredito = Calculos.calculaMotoDelCredito(banamex.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    grpBanamex[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpBanamex[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpBanamex[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpBanamex[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpBanamex[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpBanamex[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpHSBC = [];
    grpHSBC.push({
        name: hsbc.nombreBanco,
        members: []
    });
    gastosNotarialesXEstado = GastosNotariales.get($scope.selEstado).gastoNotarial;

    aforo = hsbc.aforo;
    factorPago = hsbc.factorDePago;
    tasaInteres = hsbc.tasaDeInteres;
    cat = hsbc.cat;

    montoCredito = Calculos.calculaMotoDelCredito(hsbc.aforo, $scope.valor);
    pagoMensual = Calculos.calcularPagoMensual(montoCredito, factorPago);
    ingresoRequerido = Calculos.calculoIngresoRequeridoCreciente(pagoMensual, 2);

    enganche = Calculos.calculoEnganche($scope.valor, montoCredito);
    avaluo = Calculos.calcularAvaluoCreciente($scope.valor, 2, Avaluos);
    comisionApertura = Calculos.calculoComisionApertura(montoCredito, 2);
    gastosNotariales = Calculos.calculoGastosNotariales($scope.valor, gastosNotarialesXEstado);

    desembolsoTotal = parseFloat(enganche) + parseFloat(avaluo) + parseFloat(comisionApertura) + parseFloat(gastosNotariales);

    grpHSBC[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpHSBC[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpHSBC[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpHSBC[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpHSBC[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpHSBC[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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

control.controller('Res20FijoCtrl', function ($scope, $state, Simula, Avaluos, Calculos, GastosNotariales) {
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
    //Banorte
    banorte = Simula.getForCalc(1, $scope.selMens, $scope.selPlazo);
    var grpBanorte = [];
    grpBanorte.push({
        name: banorte.nombreBanco,
        members: []
    });
    
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

    grpBanorte[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpBanorte[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpBanorte[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpBanorte[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpBanorte[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpBanorte[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpBanorte[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpBanorte[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpBanorte[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpBanorte[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpBanorte[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpBanorte[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpSantander = [];
    grpSantander.push({
        name: santander.nombreBanco,
        members: []
    });

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

    grpSantander[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpSantander[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpSantander[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpSantander[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpSantander[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpSantander[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpSantander[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpSantander[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpSantander[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpSantander[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpSantander[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpSantander[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpScotiabank = [];
    grpScotiabank.push({
        name: scotiabank.nombreBanco,
        members: []
    });

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

    grpScotiabank[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpScotiabank[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpScotiabank[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpScotiabank[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpScotiabank[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpScotiabank[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpScotiabank[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpScotiabank[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpScotiabank[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpScotiabank[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpScotiabank[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpScotiabank[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpBancomer = [];
    grpBancomer.push({
        name: bancomer.nombreBanco,
        members: []
    });

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

    grpBancomer[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpBancomer[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpBancomer[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpBancomer[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpBancomer[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpBancomer[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpBancomer[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpAfirme = [];
    grpAfirme.push({
        name: afirme.nombreBanco,
        members: []
    });
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

    grpAfirme[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpAfirme[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpAfirme[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpAfirme[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpAfirme[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpAfirme[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpAfirme[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpBanamex = [];
    grpBanamex.push({
        name: banamex.nombreBanco,
        members: []
    });

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

    grpBanamex[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpBanamex[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpBanamex[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpBanamex[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpBanamex[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpBanamex[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpBanamex[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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
    var grpHSBC = [];
    grpHSBC.push({
        name: hsbc.nombreBanco,
        members: []
    });
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

    grpHSBC[0].members.push({ name: "Pago mensual", quantity: '$' + pagoMensual.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Monto del credito", quantity: '$' + montoCredito.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Tasa de interes", quantity: (tasaInteres * 100).toFixed(2) + '%' });
    grpHSBC[0].members.push({ name: "Ingreso requerido", quantity: '$' + ingresoRequerido.formatMoney(2, '.', ',') });
    //grpHSBC[0].members.push({ name: "Incremento anual del pago", quantity: parseFloat(banorte.incrementoAnual * 100).toFixed(2) + "%" });
    grpHSBC[0].members.push({ name: "CAT", quantity: (cat * 100).toFixed(2) + '%' });
    grpHSBC[0].members.push({ name: "Gastos del credito", quantity: undefined });
    grpHSBC[0].members.push({ name: "Enganche", quantity: '$'+enganche.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Avaluo", quantity: '$'+avaluo.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Comision por apertura", quantity: '$'+comisionApertura.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Gastos notariales", quantity: '$'+gastosNotariales.formatMoney(2, '.', ',') });
    grpHSBC[0].members.push({ name: "Desembolso total", quantity: '$'+desembolsoTotal.formatMoney(2, '.', ',') });

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

