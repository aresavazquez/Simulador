(function () {
    var control = angular.module('app.controllers');

    control.controller('PerfilCtrl', function ($scope, $cordovaCamera, ngFB) {
        $scope.foto = '';
        user = JSON.parse(window.localStorage['usuario']);
        $scope.foto = user.foto === '' ? "Foto de Ares" : user.foto;
        $scope.user = {
            id: 0, name: ''
        };
        ngFB.api({
            path: '/me',
            params: { fields: 'id,name' }
        }).then(
            function (user) {
                $scope.user = user;
            },
            function (error) {
                var usuario = JSON.parse(window.localStorage['usuario']);
                $scope.user.id = 0;
                $scope.user.name = usuario.nombre + ' ' + usuario.apellido;
            });
        $scope.tomarFoto = function () {
            var options = {
                quality: 50,
                //destinationType: Camera.DestinationType.DATA_URL,
                //sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
               //encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
               // popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $cordovaCamera.getPicture({})
                .then(function (data) {

                    $scope.foto = "data:image/jpeg;base64," + data;
                    var user = JSON.parse(window.localStorage['usuario']);
                    user.foto = $scope.foto;
                    window.localStorage['usuario'] = JSON.stringify(user);
                }, function (error) {
                    console.log(angular.toJson(error));
                });

        };
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