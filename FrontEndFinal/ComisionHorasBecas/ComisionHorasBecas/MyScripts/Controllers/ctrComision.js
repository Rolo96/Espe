/**
 *Controlador de la pagina de comision
*/
app.controller('ComisionController', function ($rootScope, $scope, ServicioHTTP, $location) {
    $scope.scpUrlBarraNavegacion = 'Templates/menuComision.html';

    /**
     * Solicita generar el modal para rechazar o marcar una solicitud como pendiente
     * @param {any} pAccion accion a realizar
     * @param {any} pId id de la solicitud
     */
    $scope.generarModalRechazo = function (pAccion, pId) {
        $scope.$broadcast('generarModalRechazo', { pAccion: pAccion });
        $scope.scpIdSolicitud = pId;
    };

    /**
     * Genera el modal de aceptar la cancelacion de una solicitud
     * @param {any} pId id de la solicitud
     */
    $scope.generarModalSolCancelar = function (pId) {
        $scope.scpIdSolicitud = pId;
        $scope.verObservaciones(pId);
    };

    /**
     * Solicita generar una alerta para confirmacion
     * @param {any} pAccion accion a realizar
     * @param {any} pId ide de la solicitud
     */
    $scope.generarAlertaConf = function (pAccion, pId) {
        $scope.$broadcast('generarAlertaConf', { pAccion: pAccion });
        $scope.scpIdSolicitud = pId;
    };

    /**
     * Solicita generar el modal para aprobar una solicitud
     * @param {any} pIdSolicitud id de la solicitud
     * @param {any} pIdEstudiante id del estudiante
     */
    $scope.generarModalAprobar = function (pIdSolicitud, pIdEstudiante) {
        $scope.verEncargados();
        $scope.scpIdSolicitud = pIdSolicitud;
        $scope.scpIdEstudiante = pIdEstudiante;
        $('#ModalAprobar').modal();
    };

    /**
     * Solicita generar el modal para ver el historial de un estudiante
     * @param {any} pIdEstudiante id del estudiante
     */
    $scope.generarModalHistorial = function (pIdEstudiante) {
        $scope.verHistorial(pIdEstudiante);
        $('#ModalHistorial').modal();
    };

    /**
     * Solicita ver el formulario
     * @param {any} pId id de la solicitud
     * @param {any} pAccion accion a realizar
     * @param {any} pBeca tipo de beca de la solicitud
     */
    $scope.verFormularioSolicitud = function (pId, pAccion, pBeca) {
        $scope.$broadcast('verFormularioSolicitud', { pId: pId, pAccion: pAccion, pBeca: pBeca });
    };

    /**
     * Solicita ver los encargadados
     */
    $scope.verEncargados = function () {
        var ruta = ip + '/APISolicitudes/verEncargados';
        var respuesta = ServicioHTTP.getAll(ruta);
        respuesta.then(function (response) {
            $scope.scpEncargados = response.data;
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };

    /**
     * Aprueba una solicitud
     * @param {any} pObservacion observacion de la aprobacion
     * @param {any} pEncargado id del encargado
     * @param {any} pHoras horas a asignar
     */
    $scope.aprobarSolicitud = function (pObservacion, pEncargado, pHoras) {
        var envio = {
            opcionInt: $scope.scpIdSolicitud, opcionStr3: pObservacion,
            opcionStr: $scope.scpIdEstudiante, opcionInt4: pEncargado,
            opcionInt2: pHoras, opcionInt3: 4
        };
        var ruta = ip + '/APISolicitudes/aprobarSolicitud';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.obtenerSolicitudes("T", "0");
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    /**
     * Rechaza una solicitud o la pone en pendiente
     * @param {any} pObservacion observacion a poner
     * @param {any} pEstado estado a asignar
     */
    $scope.rechazarSolicitud = function (pObservacion, pEstado) {
        var envio = { opcionInt: $scope.scpIdSolicitud, opcionStr: pObservacion, opcionInt2: pEstado };
        var ruta = ip + '/APISolicitudes/rechazarSolicitud';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.obtenerSolicitudes("T", "0");
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.AprobarCancelacion = function (pId) {
        
        var envio = { opcionInt: pId, opcionInt2: 6};
        var ruta = ip + '/APISolicitudes/cambiarIdEstado';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {

            console.log(envio);
            $scope.obtenerSolicitudes("T", "0");
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.RechazarCancelacion = function (pId) {

        var envio = { opcionInt: pId};
        var ruta = ip + '/APISolicitudes/rechazarCancelacion';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.obtenerSolicitudes("T", "0");
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    /**
     * Obtiene la solicitudes de la vista
     * @param {any} pTipoBeca tipo de beca mostrar
     * @param {any} pEstadoActual estado de la solicitud
     */
    $scope.obtenerSolicitudes = function (pTipoBeca, pEstadoActual) {
        var envio = { opcionInt: 1, opcionStr: pTipoBeca, opcionInt2: pEstadoActual };
        var ruta = ip + '/APISolicitudes/solicitudesComision';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.solicitudesComision = response.data;
            for (var i = 0, len = response.data.length; i < len; i++) {
                if (response.data[i].Cancelada === 3 && response.data[i].Estado !== 'Cancelada por solicitante') { response.data[i].Estado = response.data[i].Estado + '  -  Pendiente Cancelación'; }
                else if (response.data[i].Cancelada === 4) { response.data[i].Estado = response.data[i].Estado + '  -  No Cancelada'; }
            }
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    /**
     * Solicita el historial de un estudiante
     * @param {any} pIdEstudiante id del estudiante
     */
    $scope.verHistorial = function (pIdEstudiante) {
        var idEst = { opcionStr: pIdEstudiante };
        var ruta = ip + '/APISolicitudes/verHistorialEstudiante';
        var respuesta = ServicioHTTP.post(ruta, idEst);
        respuesta.then(function (response) {
            $scope.historial = response.data;
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };

    /**
     * Solicita las observaciones de una solicitud de cancelacion
     * @param {any} pId id de la solicitud
     */
    $scope.verObservaciones = function (pId) {
        var info = { opcionInt: pId };
        var ruta = ip + '/APISolicitudes/verObservaciones';
        var respuesta = ServicioHTTP.post(ruta, info);
        respuesta.then(function (response) {
            console.log(response.data);
            $scope.Observaciones = response.data.ObservacionesEvaluación;
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };
    
    ///-------------Acciones del filtro------------------
    $("#inlineSolicitudSelect").change(function () {
        $scope.obtenerSolicitudes($('#inlineSolicitudSelect option:selected').val(), $('#inlineEstadoSelect option:selected').val());
    });

    ///-------------Acciones del filtro------------------
    $("#inlineEstadoSelect").change(function () {
        $scope.obtenerSolicitudes($('#inlineSolicitudSelect option:selected').val(), $('#inlineEstadoSelect option:selected').val());
    });

    //Solicita la informacion de la pagina
    $scope.obtenerSolicitudes("T", "0");

    /////////////////////////////Proximo a borrar////////////////////////////////////////////
    $scope.generarAlertaEstado = function (pAccion) {
        $scope.$broadcast('generarAlertaEstado', { pAccion: pAccion });
    };
});
