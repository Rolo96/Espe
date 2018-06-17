/**
 *Controlador de la pagina de solicitudes enviadas de estudiante 
*/
app.controller('EstSolicitudesController', function ($scope, ServicioHTTP, authFact) {
    $scope.scpUrlBarraNavegacion = "Templates/menuEstudiante.html";

    /**
     * Obtiene las solicitudes enviadas del estudiante
     */
    $scope.obtenerSolicitudesEnviadas = function () {
        $scope.cargandoSpinner = true;
        var idEstudiante = { opcionStr: authFact.getCarne() };
        var ruta = ip + '/APISolicitudes/enviadas';
        toastr.clear($('.toast-loading')); toastr.loading('Cargando enviadas');
        var respuesta = ServicioHTTP.post(ruta, idEstudiante);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.solicitudesEnviadas = response.data;
            for (var i = 0, len = response.data.length; i < len; i++) {
                if (response.data[i].Cancelada === 3) { response.data[i].Estado = response.data[i].Estado + '  -  Pendiente de Cancelación'; }
                else if (response.data[i].Cancelada === 4) { response.data[i].Estado = response.data[i].Estado + '  -  No Cancelada'; }
            }
            $scope.iniciarTooltip();
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Ha ocurrido un error al obtener las solicitudes enviadas.');
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
     * Metodo que solicita clonar una solicitud
     * @param {any} pId id de la solicitud
     * @param {any} pBeca tipo de beca destino
     */
    $scope.prevClonarSolicitud = function (pId, pBeca) {
        $scope.scpIdSolicitud = pId;
        $scope.scpTB = pBeca;
        $scope.generarAlertaConf('clonarSolicitud');
    };

    /**
     * Solicita generar los mensajes de confirmacion
     * @param {any} pAccion tipo de mensaje a mostrar
     */
    $scope.generarAlertaConf = function (pAccion) {
        $scope.$broadcast('generarAlertaConf', { pAccion: pAccion });
    };

    /**
     * Solicita cancelar un solicitud antes de ser revisada
     * @param {any} pId id de la solicitud
     */
    $scope.prevCancelarATiempo = function (pId) {
        $scope.scpIdSolicitud = pId;
        $scope.generarAlertaConf('cancelarSolicitud');
    };

    /**
     * Solicita generar el modal de cancelar la solicitud fuera de tiempo
     * @param {any} pAccion accion a realizar
     * @param {any} pId id de la solicitud
     */
    $scope.generarModalRechazo = function (pAccion, pId) {
        $scope.$broadcast('generarModalRechazo', { pAccion: pAccion });
        $scope.scpIdSolicitud = pId;
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
     *Acepta la solicitud de recargar las solicitudes enviadas
     */
    $scope.$on('recargarEnviadas', function () {
        $scope.obtenerSolicitudesEnviadas();
    });

    //Carga los valores de la pagina y solicitudes
    $scope.iniciarTooltip();
    $scope.obtenerSolicitudesEnviadas();
    $scope.scpTiposBeca = authFact.getTiposBeca();

});