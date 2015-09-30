(function () {
    var control = angular.module('app.controllers', ['ngOpenFB']);

    control.controller('LoginCtrl', function ($scope, $state, $ionicModal, $timeout, ngFB) {
        $scope.data = {
            nombre: '',
            apellido: '',
            correo: '',
            foto: ''
        };

        $scope.entrar = function () {
            window.localStorage['usuario'] =JSON.stringify($scope.data);
            $state.go("app.tabs.dash");
        };

        $scope.fbLogin = function () {
            ngFB.login({
                scope: 'email,user_likes'
            }).then(function (response) {
                if (response.status === 'connected') {
                    localStorage.status = "conectado";
                    localStorage.accessToken = response.access_token;
                    console.log('Facebook login succeeded');
                    // $scope.closeLogin();
                    $state.go("app.tabs.dash");
                } else {
                    localStorage.status = "deconectado"
                    alert('Facebook login failed');
                }
            });
        };
    });

    control.controller('DashCtrl', function ($scope, $state, Estados, Plazos, Mensualidades,
        $cordovaEmailComposer, $cordovaPrinter, Simula, Calculos,
        Avaluos, GastosNotariales, Prospectos) {
        $scope.data = {
            valorInmueble: null,
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

        $scope.agregar = function () {
            meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Diciembre', 'Diciembre']
            var now = new Date();
            $scope.data.id = now.getTime().toString();
            $scope.data.fecha = now.getDate() + '/' + meses[now.getMonth()] + '/' + now.getFullYear();
            data = angular.copy($scope.data);
            Prospectos.add(data);
            $state.go("app.tabs.historial");
        };
    });

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
        cadena = "<!DOCTYPE html><html><head><title></title></head><body>" + banorte.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBanorte + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBanorte + " <br/>" + "Tasa de interes: $" + tasaDeInteresBanorte + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBanorte + "<br/>" + "CAT: $ " + catBanorte + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBanorte + "<br/>" + "Avaluo: $ " + avaluoBanorte + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBanorte + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBanorte + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBanorte + "<br/><br/>" + santander.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualSantander + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoSantander + " <br/>" + "Tasa de interes: $" + tasaDeInteresSantander + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoSantander + "<br/>" + "CAT: $ " + catSantander + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheSantander + "<br/>" + "Avaluo: $ " + avaluoSantander + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" + "Gastos notariales: $ " + gastosNotarialesSantander + "<br/>" + "Desembolso Total: $ " + desembolsoTotalSantander + "<br/><br/>" + scotiabank.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualScotiabank + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoScotiabank + " <br/>" + "Tasa de interes: $" + tasaDeInteresScotiabank + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoScotiabank + "<br/>" + "CAT: $ " + catScotiabank + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheScotiabank + "<br/>" + "Avaluo: $ " + avaluoScotiabank + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" + "Gastos notariales: $ " + gastosNotarialesScotiabank + "<br/>" + "Desembolso Total: $ " + desembolsoTotalScotiabank + "<br/><br/>" + bancomer.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBancomer + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBancomer + " <br/>" + "Tasa de interes: $" + tasaDeInteresBancomer + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBancomer + "<br/>" + "CAT: $ " + catBancomer + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBancomer + "<br/>" + "Avaluo: $ " + avaluoBancomer + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBancomer + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBancomer + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBancomer + "<br/><br/>" + afirme.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualAfirme + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoAfirme + " <br/>" + "Tasa de interes: $" + tasaDeInteresAfirme + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoAfirme + "<br/>" + "CAT: $ " + catAfirme + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheAfirme + "<br/>" + "Avaluo: $ " + avaluoAfirme + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" + "Gastos notariales: $ " + gastosNotarialesAfirme + "<br/>" + "Desembolso Total: $ " + desembolsoTotalAfirme + "<br/><br/>" + banamex.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBanamex + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBanamex + " <br/>" + "Tasa de interes: $" + tasaDeInteresBanamex + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBanamex + "<br/>" + "CAT: $ " + catBanamex + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBanamex + "<br/>" + "Avaluo: $ " + avaluoBanamex + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBanamex + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBanamex + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBanamex + "<br/><br/>" + hsbc.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualHSBC + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoHSBC + " <br/>" + "Tasa de interes: $" + tasaDeInteresHSBC + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoHSBC + "<br/>" + "CAT: $ " + catHSBC + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheHSBC + "<br/>" + "Avaluo: $ " + avaluoHSBC + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" + "Gastos notariales: $ " + gastosNotarialesHSBC + "<br/>" + "Desembolso Total: $ " + desembolsoTotalHSBC + "<br/><br/>" + "</body></html>";
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
        cadena = "<!DOCTYPE html><html><head><title></title></head><body>" + banorte.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBanorte + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBanorte + " <br/>" + "Tasa de interes: $" + tasaDeInteresBanorte + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBanorte + "<br/>" + "CAT: $ " + catBanorte + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBanorte + "<br/>" + "Avaluo: $ " + avaluoBanorte + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBanorte + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBanorte + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBanorte + "<br/><br/>" + santander.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualSantander + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoSantander + " <br/>" + "Tasa de interes: $" + tasaDeInteresSantander + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoSantander + "<br/>" + "CAT: $ " + catSantander + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheSantander + "<br/>" + "Avaluo: $ " + avaluoSantander + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" + "Gastos notariales: $ " + gastosNotarialesSantander + "<br/>" + "Desembolso Total: $ " + desembolsoTotalSantander + "<br/><br/>" + scotiabank.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualScotiabank + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoScotiabank + " <br/>" + "Tasa de interes: $" + tasaDeInteresScotiabank + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoScotiabank + "<br/>" + "CAT: $ " + catScotiabank + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheScotiabank + "<br/>" + "Avaluo: $ " + avaluoScotiabank + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" + "Gastos notariales: $ " + gastosNotarialesScotiabank + "<br/>" + "Desembolso Total: $ " + desembolsoTotalScotiabank + "<br/><br/>" + bancomer.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBancomer + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBancomer + " <br/>" + "Tasa de interes: $" + tasaDeInteresBancomer + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBancomer + "<br/>" + "CAT: $ " + catBancomer + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBancomer + "<br/>" + "Avaluo: $ " + avaluoBancomer + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBancomer + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBancomer + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBancomer + "<br/><br/>" + afirme.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualAfirme + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoAfirme + " <br/>" + "Tasa de interes: $" + tasaDeInteresAfirme + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoAfirme + "<br/>" + "CAT: $ " + catAfirme + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheAfirme + "<br/>" + "Avaluo: $ " + avaluoAfirme + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" + "Gastos notariales: $ " + gastosNotarialesAfirme + "<br/>" + "Desembolso Total: $ " + desembolsoTotalAfirme + "<br/><br/>" + banamex.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBanamex + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBanamex + " <br/>" + "Tasa de interes: $" + tasaDeInteresBanamex + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBanamex + "<br/>" + "CAT: $ " + catBanamex + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBanamex + "<br/>" + "Avaluo: $ " + avaluoBanamex + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBanamex + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBanamex + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBanamex + "<br/><br/>" + hsbc.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualHSBC + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoHSBC + " <br/>" + "Tasa de interes: $" + tasaDeInteresHSBC + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoHSBC + "<br/>" + "CAT: $ " + catHSBC + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheHSBC + "<br/>" + "Avaluo: $ " + avaluoHSBC + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" + "Gastos notariales: $ " + gastosNotarialesHSBC + "<br/>" + "Desembolso Total: $ " + desembolsoTotalHSBC + "<br/><br/>" + "</body></html>";
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
        ingresoRequerido = pagoMensual * 2.5;

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
        cadena = "<!DOCTYPE html><html><head><title></title></head><body>" + banorte.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBanorte + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBanorte + " <br/>" + "Tasa de interes: $" + tasaDeInteresBanorte + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBanorte + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualBanorte + "<br/>" + "CAT: $ " + catBanorte + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBanorte + "<br/>" + "Avaluo: $ " + avaluoBanorte + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBanorte + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBanorte + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBanorte + "<br/><br/>" + santander.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualSantander + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoSantander + " <br/>" + "Tasa de interes: $" + tasaDeInteresSantander + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoSantander + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualSantander + "<br/>" + "CAT: $ " + catSantander + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheSantander + "<br/>" + "Avaluo: $ " + avaluoSantander + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" + "Gastos notariales: $ " + gastosNotarialesSantander + "<br/>" + "Desembolso Total: $ " + desembolsoTotalSantander + "<br/><br/>" + scotiabank.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualScotiabank + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoScotiabank + " <br/>" + "Tasa de interes: $" + tasaDeInteresScotiabank + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoScotiabank + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualScotiabank + "<br/>" + "CAT: $ " + catScotiabank + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheScotiabank + "<br/>" + "Avaluo: $ " + avaluoScotiabank + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" + "Gastos notariales: $ " + gastosNotarialesScotiabank + "<br/>" + "Desembolso Total: $ " + desembolsoTotalScotiabank + "<br/><br/>" + bancomer.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBancomer + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBancomer + " <br/>" + "Tasa de interes: $" + tasaDeInteresBancomer + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBancomer + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualBancomer + "<br/>" + "CAT: $ " + catBancomer + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBancomer + "<br/>" + "Avaluo: $ " + avaluoBancomer + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBancomer + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBancomer + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBancomer + "<br/><br/>" + afirme.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualAfirme + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoAfirme + " <br/>" + "Tasa de interes: $" + tasaDeInteresAfirme + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoAfirme + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualAfirme + "<br/>" + "CAT: $ " + catAfirme + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheAfirme + "<br/>" + "Avaluo: $ " + avaluoAfirme + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" + "Gastos notariales: $ " + gastosNotarialesAfirme + "<br/>" + "Desembolso Total: $ " + desembolsoTotalAfirme + "<br/><br/>" + hsbc.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualHSBC + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoHSBC + " <br/>" + "Tasa de interes: $" + tasaDeInteresHSBC + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoHSBC + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualHSBC + "<br/>" + "CAT: $ " + catHSBC + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheHSBC + "<br/>" + "Avaluo: $ " + avaluoHSBC + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" + "Gastos notariales: $ " + gastosNotarialesHSBC + "<br/>" + "Desembolso Total: $ " + desembolsoTotalHSBC + "<br/><br/>" + "</body></html>";
        return cadena;
    };

    function textCorreo15Crecimiento(selMens, selPlazo, valor, Simula, Calculos, Avaluos) {
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
        cadena = "<!DOCTYPE html><html><head><title></title></head><body>" + banorte.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualBanorte + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoBanorte + " <br/>" + "Tasa de interes: $" + tasaDeInteresBanorte + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoBanorte + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualBanorte + "<br/>" + "CAT: $ " + catBanorte + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheBanorte + "<br/>" + "Avaluo: $ " + avaluoBanorte + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaBanorte + "<br/>" + "Gastos notariales: $ " + gastosNotarialesBanorte + "<br/>" + "Desembolso Total: $ " + desembolsoTotalBanorte + "<br/><br/>" + santander.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualSantander + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoSantander + " <br/>" + "Tasa de interes: $" + tasaDeInteresSantander + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoSantander + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualSantander + "<br/>" + "CAT: $ " + catSantander + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheSantander + "<br/>" + "Avaluo: $ " + avaluoSantander + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaSantander + "<br/>" + "Gastos notariales: $ " + gastosNotarialesSantander + "<br/>" + "Desembolso Total: $ " + desembolsoTotalSantander + "<br/><br/>" + scotiabank.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualScotiabank + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoScotiabank + " <br/>" + "Tasa de interes: $" + tasaDeInteresScotiabank + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoScotiabank + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualScotiabank + "<br/>" + "CAT: $ " + catScotiabank + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheScotiabank + "<br/>" + "Avaluo: $ " + avaluoScotiabank + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaScotiabank + "<br/>" + "Gastos notariales: $ " + gastosNotarialesScotiabank + "<br/>" + "Desembolso Total: $ " + desembolsoTotalScotiabank + "<br/><br/>" + afirme.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualAfirme + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoAfirme + " <br/>" + "Tasa de interes: $" + tasaDeInteresAfirme + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoAfirme + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualAfirme + "<br/>" + "CAT: $ " + catAfirme + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheAfirme + "<br/>" + "Avaluo: $ " + avaluoAfirme + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaAfirme + "<br/>" + "Gastos notariales: $ " + gastosNotarialesAfirme + "<br/>" + "Desembolso Total: $ " + desembolsoTotalAfirme + "<br/><br/>" + hsbc.nombreBanco + "<br/>" + "Pago mensual: $ " + pagoMensualHSBC + " <br/>" + "Monto del cr&eacute;dito: $ " + montoCreditoHSBC + " <br/>" + "Tasa de interes: $" + tasaDeInteresHSBC + "<br/>" + "Ingreso requerido: $ " + ingresoRequeridoHSBC + "<br/>" + "Incremento anual de pago: $ " + incrementoAnualHSBC + "<br/>" + "CAT: $ " + catHSBC + "<br/>" + "Gastos del cr&eacute;dito <br/>" + "Enganche: $ " + engancheHSBC + "<br/>" + "Avaluo: $ " + avaluoHSBC + "<br/>" + "Comisi&oacute;n por apertura: $ " + comisionAperturaHSBC + "<br/>" + "Gastos notariales: $ " + gastosNotarialesHSBC + "<br/>" + "Desembolso Total: $ " + desembolsoTotalHSBC + "<br/><br/>" + "</body></html>";
        return cadena;
    };
})();
