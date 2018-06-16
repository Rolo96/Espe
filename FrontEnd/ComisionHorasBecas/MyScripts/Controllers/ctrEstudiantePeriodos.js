/**
 *Controlador de la pagina de periodos de estudiante 
*/
app.controller('EstPeriodosController', function ($scope, ServicioHTTP, authFact) {
    $scope.scpUrlBarraNavegacion = "Templates/menuEstudiante.html";

    /**
     * Da formato a las fechas
     * @param {any} dt datetime a dar formato
     * @returns {any} datetime en formato para mostrar
     */
    $scope.calculateTime = function (dt) {
        return new Date(dt).getTime();
    };

    /**
     * Obtiene los periodos de recepcion de solicitudes del semestre
     */
    $scope.obtenerPeriodos = function () {
        $scope.cargandoSpinner = true;
        var semestre = { opcionInt: authFact.getSemestre() };
        var ruta = ip + '/APIConfiguracion/verPeriodos';
        toastr.clear($('.toast-loading')); toastr.loading('Cargando periodos');
        var respuesta = ServicioHTTP.post(ruta, semestre);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.periodos = response.data;
        }, function (error) {
            toastr.clear($('.toast-loading'));
            toastr.error('Ha ocurrido un error al obtener los periodos de recepción.');
        });
    };

    /**
     * Solicita ver el formulario
     * @param {any} pId id de la solicitud
     * @param {any} pAccion accion a realizar con el formulario
     * @param {any} pBeca tipo de beca del formulario
     */
    $scope.verFormularioSolicitud = function (pId, pAccion, pBeca) {
        $scope.$broadcast('verFormularioSolicitud', { pId: pId, pAccion: pAccion, pBeca: pBeca });
    };

    $(document).ready(function () {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    });

    //Se cargan los periodos y la informacion
    $scope.obtenerPeriodos();
    $scope.scpTiposBeca = authFact.getTiposBeca();
});