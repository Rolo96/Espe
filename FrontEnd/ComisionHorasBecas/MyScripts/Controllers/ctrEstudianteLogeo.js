/**
 *Controlador de la pagina de logeo de estudiante 
*/
app.controller('LoginEstController', function ($scope, ServicioHTTP, $location, authFact) {

    /**
     * Metodo para solicitar la clave al servidor
     * Activa los botones de ingresar y reenviar clave si se envia la clave al correo
     */
    $scope.solicitarClave = function () {
        var ruta = ip + '/APILogueo/ce/StudentAuth/Token';
        var info = { carne: $scope.loginCarne, email: $scope.loginEmail };
        var respuesta = ServicioHTTP.post(ruta, info);
        respuesta.then(function (response) {
            toastr.success('Contraseña de acceso enviada a su correo.');
            document.getElementById('btnReenviar').disabled = false;
        },
            function (error) {
                toastr.error('Error de credenciales');
                console.log('error');
            });
    };

    /**
     * Realiza el logeo del estudiante una vez insertada la contraseña
     */
    $scope.login = function () {
        var ruta = ip + '/APILogueo/ce/StudentAuth/Authenticate';
        var info = { carne: $scope.loginCarne, email: $scope.loginEmail, token: $scope.loginContrasena };
        var respuesta = ServicioHTTP.post(ruta, info);
        respuesta.then(function (response) {
            $scope.limpiarInputs();
            console.log(response);
            $location.path("/estPeriodos");
            $scope.obtenerSemestre();
            authFact.setCarne($scope.loginCarne.toString());
        },
            function (error) {
                toastr.error('Error de credenciales');
            });
    };

    /**
     * Realiza la validacion de los campos de email y carné
     * @param {any} input campo a validar
     * @return {boolean} false si no se cumple la validacion
     */
    function validate(input) {
        if ($(input).attr('type') === 'email' || $(input).attr('name') === 'emailFormA') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) === null) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() === '') {
                return false;
            }
        }
    }

    /**
     * Muestra el error de la validacion de los campos
     * @param {any} input campo a mostrar el error
     */
    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    /**
     * Realiza la solicitud de validacion de los campos.
     * Si hay errores de validacion los manda a mostrar
     * Si no solicita la clave
     */
    $scope.generarContrasena = function () {
        var check = true;
        var input = $('.validate-input .input100');
        for (var i = 0; i < input.length; i++) {
            if (input[i].name === "formA" || input[i].name === "emailFormA") {
                if (validate(input[i]) === false) {
                    showValidate(input[i]);
                    check = false;
                }
            }
        }
        if (check) {
            $scope.solicitarClave();
        }
    };

    /**
     * Funciones de interfaz
     */
    (function ($) {
        "use strict";
        var input = $('.validate-input .input100');

        /**
         *Oculta el mensaje de error
         */
        $('.validate-form .input100').each(function () {
            $(this).focus(function () {
                hideValidate(this);
            });
        });

        /**
         *Oculta el mensaje de error
         * @param {any} input campo a ocultar el mensaje
         */
        function hideValidate(input) {
            var thisAlert = $(input).parent();
            $(thisAlert).removeClass('alert-validate');
        }
    })(jQuery);

    /**
     * Obtiene la informacion del semestre y tipos de beca de los que hay periodos activos
     */
    $scope.obtenerSemestre = function () {
        var ruta = ip + '/APIConfiguracion/semestreBecas';
        var respuesta = ServicioHTTP.getAll(ruta);
        respuesta.then(function (response) {
            if (response.data !== null) {
                authFact.setSemestre(response.data.Id);
                authFact.setTiposBeca(response.data.becas);
            }
            else {
                authFact.setSemestre(-1);
                authFact.setTiposBeca([]);
                $scope.scpTiposBeca = [];
            }
        },
            function (error) {
                toastr.error('Ha ocurrido un error al obtener la informacion del semestre.');
            });
    };

    ///---------------------------------------------Funciones auxiliares--------------------------------------///
    $scope.limpiarInputs = function () {
        $scope.loginCarne = null;
        $scope.loginEmail = null;
        $scope.loginContrasena = null;
    };
    $scope.limpiarInputs();
});