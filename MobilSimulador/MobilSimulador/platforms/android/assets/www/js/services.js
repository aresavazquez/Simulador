angular.module('app.services', [])

.factory('Mensualidades', function () {
    var mensaualidades = [
        { id: 0, nombre: 'Mensualidad' },
        { id: 1, nombre: 'Fija' },
        { id: 2, nombre: 'Creciente' }
    ];
    return {
        all: function () {
            return mensaualidades;
        },
        remove: function (mensualidad) {
            mensaualidades.splice(mensaualidades.indexOf(mensualidad), 1);
        },
        get: function (mensualidadId) {
            for (var i = 0; i < mensaualidades.length; i++) {
                if (mensaualidades[i].id === parseInt(mensualidadId)) {
                    return mensaualidades[i];
                }
            }
            return undefined;
        }
    };
})

.factory('Plazos', function () {
    var plazos = [
    { id: 0, nombrePlazo: 'Plazo anual', idTipoMensualidad: 0 },
    { id: 2, nombrePlazo: '15' },
    { id: 1, nombrePlazo: '20' },
    //{ id: 3, nombrePlazo: '20', idTipoMensualidad: 2 },
    //{ id: 4, nombrePlazo: '15', idTipoMensualidad: 2 },
    ];

    return {
        all: function () {
            return plazos;
        },
        remove: function (plazo) {
            plazos.splice(plazos.indexOf(plazo), 1);
        },
        get: function (plazoId) {
            for (var i = 0; i < plazos.length; i++) {
                if (plazos[i].id === parseInt(plazoId)) {
                    return plazos[i];
                }
            }
            return undefined;
        }
    };
})

.factory('Prospectos', function () {
    var prospectos = [];
    return {
        all: function () {
            return prospectos;
        },
        remove: function (prospecto) {
            prospectos.splice(plazos.indexOf(prospecto), 1);
        },
        get: function (prospectoId) {
            for (var i = 0; i < prospectos.length; i++) {
                if (prospectos[i].id === parseInt(prospectoId)) {
                    return prospectos[i];
                }
            }
            return undefined;
        }
    };
})

.factory('ServicioCompara', [function () {
    return {
        Compare: function (a, b) {
            if (a.Nombre < b.Nombre)
                return -1;
            if (a.Nombre > b.Nombre)
                return 1;
            return 0;
        }
    };
}])

.factory('Simula', function () {
    var simula = [
            { id: 1, idBanco: 1, idPlazo: 1, aforo: 0.7000, factorDePago: 8.74, tasaDeInteres: 0.0848, incrementoAnual: undefined, cat: 0.1140, nombreBanco: 'Banorte', idTipoMensualidad: 1 },
            { id: 2, idBanco: 1, idPlazo: 2, aforo: 0.7000, factorDePago: 9.9, tasaDeInteres: 0.0848, incrementoAnual: undefined, cat: 0.1280, nombreBanco: 'Banorte', idTipoMensualidad: 1 },
            { id: 3, idBanco: 1, idPlazo: 1, aforo: 0.9000, factorDePago: 7.85, tasaDeInteres: 0.0899, incrementoAnual: 0.0284, cat: 0.1260, nombreBanco: 'Banorte', idTipoMensualidad: 2 },
            { id: 4, idBanco: 1, idPlazo: 2, aforo: 0.9000, factorDePago: 9.1, tasaDeInteres: 0.0899, incrementoAnual: 0.0278, cat: 0.1280, nombreBanco: 'Banorte', idTipoMensualidad: 2 },
            { id: 5, idBanco: 2, idPlazo: 1, aforo: 0.9000, factorDePago: 9.39, tasaDeInteres: 0.0960, incrementoAnual: undefined, cat: 0.1170, nombreBanco: 'Santander', idTipoMensualidad: 1 },
            { id: 6, idBanco: 2, idPlazo: 2, aforo: 0.9000, factorDePago: 10.5, tasaDeInteres: 0.0960, incrementoAnual: undefined, cat: 0.1180, nombreBanco: 'Santander', idTipoMensualidad: 1 },
            { id: 7, idBanco: 2, idPlazo: 1, aforo: 0.9000, factorDePago: 8.2, tasaDeInteres: 0.0960, incrementoAnual: 0.0202, cat: 0.1170, nombreBanco: 'Santander', idTipoMensualidad: 2 },
            { id: 8, idBanco: 2, idPlazo: 2, aforo: 0.9000, factorDePago: 9, tasaDeInteres: 0.0960, incrementoAnual: 0.0285, cat: 0.1180, nombreBanco: 'Santander', idTipoMensualidad: 2 },
            { id: 9, idBanco: 3, idPlazo: 1, aforo: 0.9000, factorDePago: 10.1, tasaDeInteres: 0.1000, incrementoAnual: undefined, cat: 0.1160, nombreBanco: 'Scotiabank', idTipoMensualidad: 1 },
            { id: 10, idBanco: 3, idPlazo: 2, aforo: 0.9000, factorDePago: 11.15, tasaDeInteres: 0.1000, incrementoAnual: undefined, cat: 0.1160, nombreBanco: 'Scotiabank', idTipoMensualidad: 1 },
            { id: 11, idBanco: 3, idPlazo: 1, aforo: 0.9000, factorDePago: 8.31, tasaDeInteres: 0.0925, incrementoAnual: 0.0240, cat: 0.1090, nombreBanco: 'Scotiabank', idTipoMensualidad: 2 },
            { id: 12, idBanco: 3, idPlazo: 2, aforo: 0.9000, factorDePago: 9.45, tasaDeInteres: 0.0925, incrementoAnual: 0.0240, cat: 0.1090, nombreBanco: 'Scotiabank', idTipoMensualidad: 2 },
            { id: 13, idBanco: 4, idPlazo: 1, aforo: 0.9000, factorDePago: 10.05, tasaDeInteres: 0.1060, incrementoAnual: undefined, cat: 0.1410, nombreBanco: 'Bancomer', idTipoMensualidad: 1 },
            { id: 14, idBanco: 4, idPlazo: 2, aforo: 0.9000, factorDePago: 11.12, tasaDeInteres: 0.1060, incrementoAnual: undefined, cat: 0.1410, nombreBanco: 'Bancomer', idTipoMensualidad: 1 },
            { id: 15, idBanco: 4, idPlazo: 1, aforo: 0.9000, factorDePago: 9, tasaDeInteres: 0.1060, incrementoAnual: 0.0220, cat: 0.1330, nombreBanco: 'Bancomer', idTipoMensualidad: 2 },
            { id: 20, idBanco: 4, idPlazo: 2, aforo: 0.0000, factorDePago: 0, tasaDeInteres: 0.0000, incrementoAnual: 0.0000, cat: 0.0000, nombreBanco: 'Bancomer', idTipoMensualidad: 2 },
            { id: 21, idBanco: 5, idPlazo: 1, aforo: 0.9000, factorDePago: 9.99, tasaDeInteres: 0.1075, incrementoAnual: undefined, cat: 0.1172, nombreBanco: 'Afirme', idTipoMensualidad: 1 },
            { id: 22, idBanco: 5, idPlazo: 2, aforo: 0.7000, factorDePago: 10.53, tasaDeInteres: 0.0980, incrementoAnual: undefined, cat: 0.1213, nombreBanco: 'Afirme', idTipoMensualidad: 1 },
            { id: 23, idBanco: 5, idPlazo: 1, aforo: 0.8000, factorDePago: 9.1, tasaDeInteres: 0.1075, incrementoAnual: 0.0140, cat: 0.1206, nombreBanco: 'Afirme', idTipoMensualidad: 2 },
            { id: 24, idBanco: 5, idPlazo: 2, aforo: 0.6999, factorDePago: 8.73, tasaDeInteres: 0.0899, incrementoAnual: 0.0327, cat: 0.1240, nombreBanco: 'Afirme', idTipoMensualidad: 2 },
            { id: 25, idBanco: 6, idPlazo: 1, aforo: 0.8500, factorDePago: 10.09, tasaDeInteres: 0.1065, incrementoAnual: undefined, cat: 0.1200, nombreBanco: 'Banamex', idTipoMensualidad: 1 },
            { id: 26, idBanco: 6, idPlazo: 2, aforo: 0.8500, factorDePago: 11.15, tasaDeInteres: 0.1065, incrementoAnual: undefined, cat: 0.1200, nombreBanco: 'Banamex', idTipoMensualidad: 1 },
            { id: 27, idBanco: 6, idPlazo: 1, aforo: 0.0000, factorDePago: 0, tasaDeInteres: 0.0000, incrementoAnual: 0.0000, cat: 0.0000, nombreBanco: 'Banamex', idTipoMensualidad: 2 },
            { id: 30, idBanco: 6, idPlazo: 2, aforo: 0.0000, factorDePago: 0, tasaDeInteres: 0.0000, incrementoAnual: 0.0000, cat: 0.0000, nombreBanco: 'Banamex', idTipoMensualidad: 2 },
            { id: 31, idBanco: 7, idPlazo: 1, aforo: 0.8500, factorDePago: 9.72, tasaDeInteres: 0.1010, incrementoAnual: undefined, cat: 0.1160, nombreBanco: 'Hsbc', idTipoMensualidad: 1 },
            { id: 32, idBanco: 7, idPlazo: 2, aforo: 0.8500, factorDePago: 10.81, tasaDeInteres: 0.1010, incrementoAnual: undefined, cat: 0.1170, nombreBanco: 'Hsbc', idTipoMensualidad: 1 },
            { id: 33, idBanco: 7, idPlazo: 1, aforo: 0.8500, factorDePago: 8.56, tasaDeInteres: 0.1010, incrementoAnual: 0.0194, cat: 0.1160, nombreBanco: 'Hsbc', idTipoMensualidad: 2 },
            { id: 34, idBanco: 7, idPlazo: 2, aforo: 0.8500, factorDePago: 9.76, tasaDeInteres: 0.1010, incrementoAnual: 0.0194, cat: 0.1170, nombreBanco: 'Hsbc', idTipoMensualidad: 2 }
    ];

    return {
        all: function () {
            return simula;
        },
        remove: function (sim) {
            simula.splice(simula.indexOf(sim), 1);
        },
        get: function (simId) {
            for (var i = 0; i < simula.length; i++) {
                if (simula[i].id === parseInt(simId)) {
                    return simula[i];
                }
            }
            return undefined;
        },
        getForCalc: function (bancoId, mensualidadId, plazoId) {
            for (var i = 0; i < simula.length; i++) {
                if ((simula[i].idBanco === parseInt(bancoId)) &&
                    (simula[i].idTipoMensualidad === parseInt(mensualidadId)) &&
                    (simula[i].idPlazo === parseInt(plazoId))) {
                    return simula[i];
                }
            }
            return undefined;
        },
    };
})

.factory('Avaluos', function () {
    var avaluos = [
            { id: 1, idBanco: 3, mayorA: 1, hasta: 500000, importe: 1800, fijo: undefined, comentarios: undefined },
            { id: 2, idBanco: 3, mayorA: 500001, hasta: 1000000, importe: 2500, fijo: undefined, comentarios: undefined },
            { id: 3, idBanco: 3, mayorA: 1000001, hasta: 2000000, importe: 3600, fijo: undefined, comentarios: undefined },
            { id: 4, idBanco: 3, mayorA: 2000001, hasta: 3000000, importe: 5750, fijo: undefined, comentarios: undefined },
            { id: 5, idBanco: 3, mayorA: 3000001, hasta: 4000000, importe: 7700, fijo: undefined, comentarios: undefined },
            { id: 6, idBanco: 3, mayorA: 4000001, hasta: 5000000, importe: 9450, fijo: undefined, comentarios: undefined },
            { id: 7, idBanco: 3, mayorA: 5000001, hasta: 6000000, importe: 11000, fijo: undefined, comentarios: undefined },
            { id: 8, idBanco: 3, mayorA: 6000001, hasta: 7000000, importe: 12350, fijo: undefined, comentarios: undefined },
            { id: 9, idBanco: 3, mayorA: 7000001, hasta: 8000000, importe: 13500, fijo: undefined, comentarios: undefined },
            { id: 10, idBanco: 3, mayorA: 8000001, hasta: 9000000, importe: 14450, fijo: undefined, comentarios: undefined },
            { id: 11, idBanco: 3, mayorA: 9000001, hasta: 10000000, importe: 15200, fijo: undefined, comentarios: undefined },
            { id: 12, idBanco: 3, mayorA: 10000001, hasta: 11000000, importe: 15750, fijo: undefined, comentarios: undefined },
            { id: 13, idBanco: 3, mayorA: 11000001, hasta: 12000000, importe: 16000, fijo: undefined, comentarios: undefined },
            { id: 14, idBanco: 3, mayorA: 12000001, hasta: 13000000, importe: 16250, fijo: undefined, comentarios: undefined },
            { id: 15, idBanco: 3, mayorA: 13000001, hasta: 14000000, importe: 16500, fijo: undefined, comentarios: undefined },
            { id: 16, idBanco: 3, mayorA: 14000001, hasta: 15000000, importe: 16750, fijo: undefined, comentarios: undefined },
            { id: 17, idBanco: 3, mayorA: 15000001, hasta: 16000000, importe: 17000, fijo: undefined, comentarios: undefined },
            { id: 18, idBanco: 3, mayorA: 16000001, hasta: 17000000, importe: 17250, fijo: undefined, comentarios: undefined },
            { id: 19, idBanco: 3, mayorA: 17000001, hasta: 18000000, importe: 17500, fijo: undefined, comentarios: undefined },
            { id: 20, idBanco: 3, mayorA: 18000001, hasta: 19000000, importe: 18500, fijo: undefined, comentarios: undefined },
            { id: 21, idBanco: 3, mayorA: 19000001, hasta: 20000000, importe: 19500, fijo: undefined, comentarios: undefined },
            { id: 22, idBanco: 3, mayorA: 20000001, hasta: 21000000, importe: 20500, fijo: undefined, comentarios: undefined },
            { id: 23, idBanco: 3, mayorA: 21000001, hasta: undefined, importe: undefined, fijo: undefined, comentarios: '>21000001.00 Por Cotización' },
            { id: 24, idBanco: 6, mayorA: 500000, hasta: 1000000, importe: 3000, fijo: undefined, comentarios: undefined },
            { id: 25, idBanco: 6, mayorA: 1000001, hasta: 3000000, importe: 5000, fijo: undefined, comentarios: undefined },
            { id: 26, idBanco: 6, mayorA: 3000001, hasta: 5000000, importe: 7000, fijo: undefined, comentarios: undefined },
            { id: 27, idBanco: 6, mayorA: 5000001, hasta: 8000000, importe: 10000, fijo: undefined, comentarios: undefined },
            { id: 28, idBanco: 6, mayorA: 8000001, hasta: 15000000, importe: 15000, fijo: undefined, comentarios: undefined },
            { id: 29, idBanco: undefined, mayorA: 15000001, hasta: undefined, importe: undefined, fijo: undefined, comentarios: '>15000001.00 Por Cotización' },
            { id: 30, idBanco: 7, mayorA: 0, hasta: 250000, importe: 800, fijo: undefined, comentarios: undefined },
            { id: 31, idBanco: 7, mayorA: 250001, hasta: 350000, importe: 1000, fijo: undefined, comentarios: undefined },
            { id: 32, idBanco: 7, mayorA: 350001, hasta: 500000, importe: 1450, fijo: undefined, comentarios: undefined },
            { id: 33, idBanco: 7, mayorA: 500001, hasta: 750000, importe: 2050, fijo: undefined, comentarios: undefined },
            { id: 34, idBanco: 7, mayorA: 750001, hasta: 1000000, importe: 2700, fijo: undefined, comentarios: undefined },
            { id: 35, idBanco: 7, mayorA: 1000001, hasta: 1250000, importe: 3350, fijo: undefined, comentarios: undefined },
            { id: 36, idBanco: 7, mayorA: 1250001, hasta: 1500000, importe: 4000, fijo: undefined, comentarios: undefined },
            { id: 37, idBanco: 7, mayorA: 1500001, hasta: 1750000, importe: 4650, fijo: undefined, comentarios: undefined },
            { id: 38, idBanco: 7, mayorA: 1750001, hasta: 2000000, importe: 5300, fijo: undefined, comentarios: undefined },
            { id: 39, idBanco: 7, mayorA: 2000001, hasta: 2250000, importe: 5950, fijo: undefined, comentarios: undefined },
            { id: 40, idBanco: 7, mayorA: 2250001, hasta: 2500000, importe: 6600, fijo: undefined, comentarios: undefined },
            { id: 41, idBanco: 7, mayorA: 2500001, hasta: 2750000, importe: 7250, fijo: undefined, comentarios: undefined },
            { id: 42, idBanco: 7, mayorA: 2750001, hasta: 3000000, importe: 7900, fijo: undefined, comentarios: undefined },
            { id: 43, idBanco: 7, mayorA: 3000001, hasta: 3250000, importe: 8550, fijo: undefined, comentarios: undefined },
            { id: 44, idBanco: 7, mayorA: 3250001, hasta: 3500000, importe: 9200, fijo: undefined, comentarios: undefined },
            { id: 45, idBanco: 7, mayorA: 3500001, hasta: 3750000, importe: 9850, fijo: undefined, comentarios: undefined },
            { id: 46, idBanco: 7, mayorA: 3750001, hasta: 4000000, importe: 10500, fijo: undefined, comentarios: undefined },
            { id: 47, idBanco: 7, mayorA: 4000001, hasta: 4250000, importe: 11150, fijo: undefined, comentarios: undefined },
            { id: 48, idBanco: 7, mayorA: 4250001, hasta: 4500000, importe: 11800, fijo: undefined, comentarios: undefined },
            { id: 49, idBanco: 7, mayorA: 4500001, hasta: 4750000, importe: 12450, fijo: undefined, comentarios: undefined },
            { id: 50, idBanco: 7, mayorA: 4750001, hasta: 5000000, importe: 13100, fijo: undefined, comentarios: undefined },
            { id: 51, idBanco: 7, mayorA: 5000001, hasta: 5250000, importe: 13750, fijo: undefined, comentarios: undefined },
            { id: 52, idBanco: 7, mayorA: 5250001, hasta: 5500000, importe: 14000, fijo: undefined, comentarios: undefined },
            { id: 53, idBanco: 7, mayorA: 5500001, hasta: 5750000, importe: 15000, fijo: undefined, comentarios: undefined },
            { id: 54, idBanco: 7, mayorA: 5750001, hasta: 6000000, importe: 15500, fijo: undefined, comentarios: undefined },
            { id: 55, idBanco: 7, mayorA: 6000001, hasta: undefined, importe: 17500, fijo: undefined, comentarios: '>6000001.00 El importe sera 17500' }
    ];
    return {
        all: function () {
            return avaluos;
        },
        remove: function (avaluo) {
            avaluos.splice(avaluos.indexOf(avaluo), 1);
        },
        get: function (avaluoId) {
            for (var i = 0; i < avaluos.length; i++) {
                if (avaluos[i].id === parseInt(avaluoId)) {
                    return avaluos[i];
                }
            }
            return undefined;
        },
        getForBanco: function (bancoId, valor) {
            var resultado = [];
            for (var i = 0; i < avaluos.length; i++) {
                if (avaluos[i].idBanco === parseInt(bancoId) &&
                    avaluos[i].mayorA <= valor && avaluos[i].hasta >= valor) {
                    resultado.push(avaluos[i].importe);
                }
            }
            return resultado;
        }
    };

})

.factory('GastosNotariales', function () {
        var gastos = [
            { id: 1, idEstado: 1, gastoNotarial: 0.04 },
            { id: 2, idEstado: 2, gastoNotarial: 0.06 },
            { id: 3, idEstado: 3, gastoNotarial: 0.05 },
            { id: 4, idEstado: 4, gastoNotarial: 0.04 },
            { id: 5, idEstado: 5, gastoNotarial: 0.05 },
            { id: 6, idEstado: 6, gastoNotarial: 0.04 },
            { id: 7, idEstado: 7, gastoNotarial: 0.04 },
            { id: 8, idEstado: 8, gastoNotarial: 0.06 },
            { id: 9, idEstado: 9, gastoNotarial: 0.09 },
            { id: 10, idEstado: 10, gastoNotarial: 0.06 },
            { id: 11, idEstado: 11, gastoNotarial: 0.03 },
            { id: 12, idEstado: 12, gastoNotarial: 0.03 },
            { id: 13, idEstado: 13, gastoNotarial: 0.10 },
            { id: 14, idEstado: 14, gastoNotarial: 0.05 },
            { id: 15, idEstado: 15, gastoNotarial: 0.09 },
            { id: 16, idEstado: 16, gastoNotarial: 0.04 },
            { id: 17, idEstado: 17, gastoNotarial: 0.04 },
            { id: 18, idEstado: 18, gastoNotarial: 0.06 },
            { id: 19, idEstado: 19, gastoNotarial: 0.04 },
            { id: 20, idEstado: 20, gastoNotarial: 0.02 },
            { id: 21, idEstado: 21, gastoNotarial: 0.06 },
            { id: 22, idEstado: 22, gastoNotarial: 0.04 },
            { id: 23, idEstado: 23, gastoNotarial: 0.04 },
            { id: 24, idEstado: 24, gastoNotarial: 0.02 },
            { id: 25, idEstado: 25, gastoNotarial: 0.07 },
            { id: 26, idEstado: 26, gastoNotarial: 0.04 },
            { id: 27, idEstado: 27, gastoNotarial: 0.06 },
            { id: 28, idEstado: 28, gastoNotarial: 0.05 },
            { id: 29, idEstado: 29, gastoNotarial: 0.08 },
            { id: 30, idEstado: 30, gastoNotarial: 0.02 },
            { id: 31, idEstado: 31, gastoNotarial: 0.04 },
            { id: 32, idEstado: 32, gastoNotarial: 0.03 }
        ];

        return {
            all: function () {
                return gastos;
            },
            remove: function (gasto) {
                gastos.splice(gastos.indexOf(gasto), 1);
            },
            get: function (estadoId) {
                for (var i = 0; i < gastos.length; i++) {
                    if (gastos[i].idEstado === parseInt(estadoId)) {
                        return gastos[i];
                    }
                }
                return undefined;
            }
        };
    })


.factory('Calculos', function () {
    return {
        calculaMotoDelCredito: function (aforo, valor) {
            return valor * aforo;
        },
        calcularPagoMensual: function (montoCredito, factorPago) {
            return (montoCredito / 1000) * factorPago;
        },
        calculoIngresoRequerido: function (pagoMensual, bancoId) {
            switch (bancoId) {
                case 2:
                case 4:
                case 5:
                case 6:
                    return pagoMensual * 2.5;
                    break;
                case 3:
                    return pagoMensual * 2.6;
                    break;
                default:
                    return pagoMensual * 2;
                    break;
            }
        },
        calculoIngresoRequeridoCreciente: function (pagoMensual, bancoId) {
            switch (bancoId) {
                case 2:
                case 4:
                case 5:
                case 6:
                    return pagoMensual * 2.5;
                    break;
                case 3:
                    return pagoMensual * 2.6;
                    break;
                case 1:
                    return pagoMensual * 2.35;
                    break;
                default:
                    return pagoMensual * 2;
                    break;
            }
        },
        calculoEnganche: function (valor, montoCredito) {
            return valor - montoCredito;
        },
        calcularAvaluo: function (valor, bancoId, Avaluos) {
            switch (bancoId) {
                case 2:
                    return (valor * 2.75) / 1000;
                    break;
                case 3:
                case 7:
                case 6:
                    try {
                        var importe = 0;
                        var avaluos = Avaluos.all();
                        for (var i = 0; i < avaluos.length; i++) {
                            if (avaluos[i].idBanco === bancoId &&
                                avaluos[i].mayorA <= valor && avaluos[i].hasta >= valor)
                            {
                                importe += parseFloat(avaluos[i].importe);
                            }
                        }
                        return importe;
                    }
                    catch (err) {
                        f = err.message;
                    }
                    break;
                case 4:
                    return (valor * 2.5) / 1000 + 700;
                    break;
                case 5:
                    return (valor * 3) / 1000;
                    break;
                default:
                    return valor * 0.003;
                    break;
            }
        },
        calcularAvaluoCreciente: function (valor, bancoId, Avaluos) {
            switch (bancoId) {
                case 1:
                    return valor * 0.0034;
                    break;
                case 2:
                    return (valor * 2.75) / 1000;
                    break;
                case 3:
                case 7:
                    try {
                        var importe = 0;
                        var avaluos = Avaluos.all();
                        for (var i = 0; i < avaluos.length; i++) {
                            if (avaluos[i].idBanco === bancoId &&
                                avaluos[i].mayorA <= valor && avaluos[i].hasta >= valor)
                            {
                                importe += parseFloat(avaluos[i].importe);
                            }
                        }
                        return importe;
                    }
                    catch (err) {
                        f = err.message;
                    }
                    break;
                case 5:
                    return (valor * 3) / 1000;
                    break;
                default:
                    return valor * 0.003;
                    break;
            }
        },
        calculoComisionApertura:function(montoCredito, idBanco) {
            switch (idBanco) {
                case 3:
                    return montoCredito * 0.0125;
                    break;
                case 4:
                case 6:
                    return 0;
                    break;
                default:
                    return montoCredito * 0.01;
                    break;
            }
        },
        calculoGastosNotariales: function (valor, gasto) {
            return valor * gasto;
        }
    };
})

.factory('Estados', function () {
    var estados = [
          { id: 0, nombre: 'ESTADO' },
          { id: 1, nombre: 'AGUASCALIENTES' },
          { id: 2, nombre: 'BAJA CALIFORNIA' },
          { id: 3, nombre: 'BAJA CALIFORNIA SUR' },
          { id: 4, nombre: 'CAMPECHE' },
          { id: 5, nombre: 'COAHUILA' },
          { id: 6, nombre: 'COLIMA' },
          { id: 7, nombre: 'CHIAPAS' },
          { id: 8, nombre: 'CHIHUAHUA' },
          { id: 9, nombre: 'DISTRITO FEDERAL' },
          { id: 10, nombre: 'DURANGO' },
          { id: 11, nombre: 'GUANAJUATO' },
          { id: 12, nombre: 'GUERRERO' },
          { id: 13, nombre: 'HIDALGO' },
          { id: 14, nombre: 'JALISCO' },
          { id: 15, nombre: 'MEXICO' },
          { id: 16, nombre: 'MICHOACAN' },
          { id: 17, nombre: 'MORELOS' },
          { id: 18, nombre: 'NAYARIT' },
          { id: 19, nombre: 'NUEVO LEON' },
          { id: 20, nombre: 'OAXACA' },
          { id: 21, nombre: 'PUEBLA' },
          { id: 22, nombre: 'QUERETARO' },
          { id: 23, nombre: 'QUINTANA ROO' },
          { id: 24, nombre: 'SAN LUIS POTOSI' },
          { id: 25, nombre: 'SINALOA' },
          { id: 26, nombre: 'SONORA' },
          { id: 27, nombre: 'TABASCO' },
          { id: 28, nombre: 'TAMAULIPAS' },
          { id: 29, nombre: 'TLAXCALA' },
          { id: 30, nombre: 'VERACRUZ' },
          { id: 31, nombre: 'YUCATAN' },
          { id: 32, nombre: 'ZACATECAS' }
    ];

    return {
        all: function () {
            return estados;
        },
        remove: function (estado) {
            estados.splice(estados.indexOf(estado), 1);
        },
        get: function (estadoId) {
            for (var i = 0; i < estados.length; i++) {
                if (estados[i].id === parseInt(estadoId)) {
                    return estados[i];
                }
            }
            return undefined;
        }
    };
})

