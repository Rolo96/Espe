/**
 *Controlador de la pagina de logeo de usuario 
*/
app.controller('LoginController', function ($rootScope, $scope, ServicioHTTP, $location, authFact) {

    /**
     * Realiza el logeo de los usuarios, si tiene que cambiar la contraseña muestra el modal de cambio de contraseña
     */
    $scope.login = function () {
        var ruta = ip + '/APILogueo/ce/UserAuth/Authenticate';
        var info = { password: $scope.strToUTF8Base64($scope.loginPassword), correo_electronico: $scope.loginCorreo };
        var respuesta = ServicioHTTP.post(ruta, info);
        respuesta.then(function (response) {
            authFact.setUsuario(response.data.usuario);
            if (response.data.first_time) { $('#ModalContrasena').modal(); }
            else {
                var flag = false;
                $scope.obtenerSemestre();
                for (var i = 0, len = response.data.usuario.rols.length; i < len; i++) {
                    if (response.data.usuario.rols[i].sistema === 2) {
                        if (response.data.usuario.rols[i].nombre === "Administrador Horas Beca") { $location.path("/admin"); }
                        else if (response.data.usuario.rols[i].nombre === "Comision") { $location.path("/comision"); }
                        else { $location.path("/Responsable"); }
                        flag = true;
                        break;
                    }
                }
                if (!flag){toastr.error('Usuario sin roles en este sistema');}
            }
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
    $scope.solicitarLogin = function () {
        var check = true;
        var input = $('.validate-input .input100');
        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) === false) {
                showValidate(input[i]);
                check = false;
            }
        }
        if (check) {
            $scope.login();
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
     * Convierte string a base 64
     * @param {any} str string a convertir
     * @returns {any} string convertido
     */
    $scope.strToUTF8Base64 = function (str) {

        function decodeSurrogatePair(hi, lo) {
            var resultChar = 0x010000;
            resultChar += lo - 0xDC00;
            resultChar += (hi - 0xD800) << 10;
            return resultChar;
        }

        var bytes = [0, 0, 0];
        var byteIndex = 0;
        var result = [];

        function output(s) {
            result.push(s);
        }

        function emitBase64() {

            var digits =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                'abcdefghijklmnopqrstuvwxyz' +
                '0123456789+/';

            function toDigit(value) {
                return digits[value];
            }

            // --Byte 0--    --Byte 1--    --Byte 2--
            // 1111  1122    2222  3333    3344  4444

            var d1 = toDigit(bytes[0] >> 2);
            var d2 = toDigit(
                ((bytes[0] & 0x03) << 4) |
                (bytes[1] >> 4));
            var d3 = toDigit(
                ((bytes[1] & 0x0F) << 2) |
                (bytes[2] >> 6));
            var d4 = toDigit(
                bytes[2] & 0x3F);

            if (byteIndex === 1) {
                output(d1 + d2 + '==');
            }
            else if (byteIndex === 2) {
                output(d1 + d2 + d3 + '=');
            }
            else {
                output(d1 + d2 + d3 + d4);
            }
        }

        function emit(chr) {
            bytes[byteIndex++] = chr;
            if (byteIndex === 3) {
                emitBase64();
                bytes[0] = 0;
                bytes[1] = 0;
                bytes[2] = 0;
                byteIndex = 0;
            }
        }

        function emitLast() {
            if (byteIndex > 0) {
                emitBase64();
            }
        }

        // Converts the string to UTF8:

        var i, chr;
        var hi, lo;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);

            // Test and decode surrogate pairs in the string
            if (chr >= 0xD800 && chr <= 0xDBFF) {
                hi = chr;
                lo = str.charCodeAt(i + 1);
                if (lo >= 0xDC00 && lo <= 0xDFFF) {
                    chr = decodeSurrogatePair(hi, lo);
                    i++;
                }
            }

            // Encode the character as UTF-8.
            if (chr < 0x80) {
                emit(chr);
            }
            else if (chr < 0x0800) {
                emit((chr >> 6) | 0xC0);
                emit(((chr >> 0) & 0x3F) | 0x80);
            }
            else if (chr < 0x10000) {
                emit((chr >> 12) | 0xE0);
                emit(((chr >> 6) & 0x3F) | 0x80);
                emit(((chr >> 0) & 0x3F) | 0x80);
            }
            else if (chr < 0x110000) {
                emit((chr >> 18) | 0xF0);
                emit(((chr >> 12) & 0x3F) | 0x80);
                emit(((chr >> 6) & 0x3F) | 0x80);
                emit(((chr >> 0) & 0x3F) | 0x80);
            }
        }

        emitLast();

        return result.join('');
    };

    /**
     * Obtiene la informacion del semestre y tipos de beca de los que hay periodos activos
     */
    $scope.obtenerSemestre = function () {
        var ruta = ip + '/APIConfiguracion/semestreBecas';
        var respuesta = ServicioHTTP.getAll(ruta);
        respuesta.then(function (response) {
            if (response.data !== null) {
                authFact.setSemestre(response.data.Id);
            }
            else {
                authFact.setSemestre(-1);
            }
        },
            function (error) {
                toastr.error('Ha ocurrido un error al obtener la informacion del semestre.');
            });
    };

    /**
     * Cambia la contraseña y logea al usuario o muestra un mensaje de error si la contraseña ingresada es de menos de 8 caracteres
     */
    $scope.cambiarContrasena = function () {
        $('#modalContrasena').modal('toggle');
        $('.modal-backdrop').remove();
        console.log($scope.loginNewPassword);
        if (typeof $scope.loginNewPassword === 'undefined' || $scope.loginNewPassword.length < 8 ) {
            toastr.error('Error actualizando contraseña, largo de contraseña incorrecto');
            return;
        }
        var ruta = ip + '/APILogueo/ce/Users/' + authFact.getUsuario().id;
        var info = {
            contrasenna: $scope.strToUTF8Base64($scope.loginNewPassword), correo_electronico: authFact.getUsuario().correo_electronico, primer_nombre: authFact.getUsuario().primer_nombre,
            primer_apellido: authFact.getUsuario().primer_apellido, segundo_nombre: authFact.getUsuario().segundo_nombre, segundo_apellido: authFact.getUsuario().segundo_apellido };
        var respuesta = ServicioHTTP.put(ruta, info);
        console.log(info);
        respuesta.then(function (response) {
            $scope.obtenerSemestre();
            for (var i = 0, len = authFact.getUsuario().rols.length; i < len; i++) {
                if (authFact.getUsuario().rols[i].sistema === 2) {
                    if (authFact.getUsuario().rols[i].nombre === "Administrador Horas Beca") { $location.path("/admin"); }
                    else if (authFact.getUsuario().rols[i].nombre === "Comision") { $location.path("/comision"); }
                    else { $location.path("/Responsable"); }
                    flag = true;
                    break;
                }
            }
            toastr.success('Contraseña actualizada.');
            if (!flag) { toastr.error('Usuario sin roles en este sistema'); }
        },
            function (error) {
                toastr.error('Ha ocurrido un error al obtener la informacion.');
            });
    };

    /**
     * Solicita generar los mensajes de confirmacion
     * @param {any} pAccion tipo de mensaje a mostrar
     */
    $scope.generarAlertaConf = function (pAccion) {
        $scope.$broadcast('generarAlertaConf', { pAccion: pAccion });
    };
});