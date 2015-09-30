(function () {
    var control = angular.module('app.controllers');

    control.controller('PerfilCtrl', function ($scope, ngFB) {
        $scope.user = {
            id:0, name:''
        };
        $scope.foto = './img/cara2.png'
        ngFB.api({
            path: '/me',
            params: { fields: 'id,name' }
        }).then(
            function (user) {
                $scope.user = user;
            },
            function (error) {
                var usuario =JSON.parse( window.localStorage['usuario']);
                $scope.user.id = 0;
                $scope.user.name = usuario.nombre + ' ' + usuario.apellido;
            });
        $scope.share = function (event) {
            ngFB.api({
                method: 'POST',
                path: '/me/feed',
                params: {
                    message: "Estoy usando el simulador SOC by " +
                    $scope.user.name
                }
            }).then(
                function () {
                    alert('The session was shared on Facebook');
                },
                function () {
                    alert('An error occurred while sharing this session on Facebook');
                });
        };
    });
})();