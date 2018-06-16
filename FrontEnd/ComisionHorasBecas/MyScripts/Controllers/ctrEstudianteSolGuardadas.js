/**
 *Controlador de la pagina de solicitudes guardadas de estudiante 
*/
app.controller('EstSolicitudesGuardController', function ($scope, ServicioHTTP, authFact) {
    $scope.scpUrlBarraNavegacion = "Templates/menuEstudiante.html";

    /**
     * Obtiene las solciitudes guardadas del estudiante
     */
    $scope.obtenerSolicitudesGuardadas = function () {
        $scope.cargandoSpinner = true;
        var idEstudiante = { opcionStr: authFact.getCarne() };
        var ruta = ip + '/APISolicitudes/guardadas';
        toastr.clear($('.toast-loading')); toastr.loading('Cargando guardadas');
        var respuesta = ServicioHTTP.post(ruta, idEstudiante);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.solicitudesGuardadas = response.data;
            $scope.iniciarTooltip();
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Ha ocurrido un error al obtener las solcitudes guardadas.');
            });
    };

    /**
     * Obtiene la fecha en un mejor formato
     * @param {any} dt datetime con la fecha
     * @return {any} fecha en mejor formato
     */
    $scope.calculateTime = function (dt) {
        return new Date(dt).getTime();
    };

    /**
     * Abre un formulario
     * @param {any} pId id del formulario
     * @param {any} pAccion accion a realizar con el formulario
     * @param {any} pBeca tipo de beca de la solicitud
     */
    $scope.verFormularioSolicitud = function (pId, pAccion, pBeca) {
        $scope.$broadcast('verFormularioSolicitud', { pId: pId, pAccion: pAccion, pBeca: pBeca });
    };

    /**
     * Solicita clonar una solicitud
     * @param {any} pId id de la solicitud
     * @param {any} pBeca tipo de beca destino
     */
    $scope.prevClonarSolicitud = function (pId, pBeca) {
        $scope.scpIdSolicitud = pId;
        $scope.scpTB = pBeca;
        $scope.generarAlertaConf('clonarSolicitud');
    };

    /**
     * Solicita borrar una solicitud
     * @param {any} pId id de la solicitud
     */
    $scope.borrarSolicitud = function (pId) {
        var idSolicitud = { opcionInt: pId };
        var ruta = ip + '/APISolicitudes/borrarSolicitud';
        toastr.clear($('.toast-loading')); toastr.loading('Borrando solicitud');
        var respuesta = ServicioHTTP.post(ruta, idSolicitud);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.obtenerSolicitudesGuardadas();
            toastr.success('Solicitud borrada con éxito');
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible borrar la solicitud.');
            });
    };

    /**
     * Solicita genearr una alerta de confirmacion
     * @param {any} pAccion accion de la alerta
     */
    $scope.generarAlertaConf = function (pAccion) {
        $scope.$broadcast('generarAlertaConf', { pAccion: pAccion });
    };

    /**
     * Solicita borrar una solicitud
     * @param {any} pId id de la solicitud
     */
    $scope.prevBorrarSolicitud = function (pId) {
        $scope.scpIdSolicitud = pId;
        $scope.generarAlertaConf('borrarSolicitud');
    };

    /**
     * Solicita enviar una solicitud
     * @param {any} pId id de la solicitud
     */
    $scope.prevEnviarSolicitud = function (pId) {
        $scope.scpIdSolicitud = pId;
        $scope.generarAlertaConf('enviarSolicitudGuardada');
    };

    /**
     * Envia una solicitud
     * @param {any} pId id de la solicitud
     */
    $scope.enviarSolicitud = function (pId) {
        var idSolicitud = { opcionInt: pId };
        var ruta = ip + '/APISolicitudes/enviarSolicitud';
        toastr.clear($('.toast-loading')); toastr.loading('Enviando solicitud');
        var respuesta = ServicioHTTP.post(ruta, idSolicitud);
        respuesta.then(function (response) {
            $scope.obtenerSolicitudesGuardadas();
            toastr.clear($('.toast-loading'));
            toastr.success('Solicitud enviada con éxito.');
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible enviar la solicitud.');
            });

    };

    /**
     * Metodo de interfaz
     * @param {any} pBeca tipo de beca
     * @return {any} wtf
     */
    $scope.activarEnviado = function (pBeca) {
        for (var i = 0; i < authFact.getTiposBeca().length; i++) {
            if (pBeca === authFact.getTiposBeca()[i].AbreviaturaBeca) {
                return true;
            }
        }
        return false;
    };

    /**
     * Metodo de interfaz
     */
    $scope.iniciarTooltip = function () {
        $(document).ready(function () {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        });
    };

    /**
     *Recibe la solicitud de recargar las solicitudes enviadas
     */
    $scope.$on('recargarGuardadas', function () {
        $scope.obtenerSolicitudesGuardadas();
    });

    //Inicio de la pagina y carga las solicitudes
    $scope.iniciarTooltip();
    $scope.obtenerSolicitudesGuardadas();
    $scope.scpTiposBeca = authFact.getTiposBeca();
});
///##################################### Controlador Solicitudes Guardadas ####################################################
