var ip = '';

app.run(['$rootScope', function ($rootScope) {
    $rootScope.scpUrlFormsModals = 'Templates/FormsModals.html';
}]);

///################################### Controlador Comision #####################################################################
app.controller('ComisionController', function ($rootScope, $scope, ServicioHTTP, $location) {
    $scope.scpUrlBarraNavegacion = 'Templates/menuComision.html';

    ///---------------Generacion de modals---------------
    $scope.generarModalRechazo = function (pAccion, pId) {
        $scope.$broadcast('generarModalRechazo', { pAccion: pAccion});
        $scope.scpIdSolicitud = pId;
    };

    $scope.generarAlertaConf = function (pAccion, pId) {
        $scope.$broadcast('generarAlertaConf', { pAccion: pAccion});
        $scope.scpIdSolicitud = pId;
    };

    $scope.generarAlertaEstado = function (pAccion) {
        $scope.$broadcast('generarAlertaEstado', { pAccion: pAccion });
    };

    $scope.generarModalAprobar = function (pIdSolicitud, pIdEstudiante) {
        $scope.verEncargados();
        $scope.scpIdSolicitud = pIdSolicitud;
        $scope.scpIdEstudiante = pIdEstudiante;
        $('#ModalAprobar').modal();
    };

    $scope.generarModalHistorial = function (pIdEstudiante) {
        $scope.verHistorial(pIdEstudiante);
        $('#ModalHistorial').modal();
    };

    $scope.verFormularioSolicitud = function (pId, pAccion, pBeca) {
        $scope.$broadcast('verFormularioSolicitud', { pId: pId, pAccion: pAccion, pBeca: pBeca });
    };
    ///---------------Generacion de modals---------------


    ///----------------Conexion a API--------------------
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

    $scope.aprobarSolicitud = function (pObservacion, pEncargado, pHoras) {
        var envio = {
            opcionInt: $scope.scpIdSolicitud, opcionStr3: pObservacion,
            opcionStr: $scope.scpIdEstudiante, opcionStr2: pEncargado,
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

    $scope.rechazarSolicitud = function (pObservacion, pEstado) {
        var envio = { opcionInt: $scope.scpIdSolicitud, opcionStr: pObservacion, opcionInt2: pEstado };
        var ruta = ip + '/APISolicitudes/rechazarSolicitud';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.obtenerSolicitudes("T", "0");
        },function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.obtenerSolicitudes = function (pTipoBeca, pEstadoActual) {
        var envio = { opcionInt: 1, opcionStr: pTipoBeca, opcionInt2: pEstadoActual };
        var ruta = ip + '/APISolicitudes/solicitudesComision';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.solicitudesComision = response.data;
        },function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

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
    ///----------------Conexion a API--------------------

    ///-------------Acciones del filtro------------------
    $("#inlineSolicitudSelect").change(function () {
        $scope.obtenerSolicitudes($('#inlineSolicitudSelect option:selected').val(), $('#inlineEstadoSelect option:selected').val());
    });

    $("#inlineEstadoSelect").change(function () {
        $scope.obtenerSolicitudes($('#inlineSolicitudSelect option:selected').val(), $('#inlineEstadoSelect option:selected').val());
    });
    ///-------------Acciones del filtro------------------

    $scope.obtenerSolicitudes("T", "0");
});
///################################### Controlador Comision #####################################################################

///########################################### Controlador Admin ################################################################
app.controller('AdminSolicitudesController', function ($rootScope, $scope, ServicioHTTP, $location) {
    $scope.scpUrlBarraNavegacion = "Templates/menuAdmin.html";

    ///---------------Generacion de modals---------------
    $scope.verFormularioSolicitud = function (pId, pAccion, pBeca) {
        $scope.$broadcast('verFormularioSolicitud', { pId: pId, pAccion:pAccion, pBeca:pBeca });
    };

    $scope.generarAlertaEstado = function (pAccion) {
        $scope.$broadcast('generarAlertaEstado', { pAccion: pAccion });
    };

    $scope.revisionSolicitud = function (pId, pEstado, pAccion) {
        $scope.scpIdSolicitud = pId;
        $scope.scpEstado = pEstado;
        $scope.$broadcast('generarAlertaConf', {pAccion: pAccion});
    };

    $scope.generarModalRechazo = function (pAccion, pId) {
        $scope.$broadcast('generarModalRechazo', { pAccion: pAccion });
        $scope.scpIdSolicitud = pId;
    };
    ///---------------Generacion de modals---------------

    ///----------------Conexion a API--------------------
    $scope.obtenerSolicitudesAdmin = function (pTipoBeca, pEstadoActual) {
        var envio = { opcionInt: 1, opcionStr: pTipoBeca, opcionInt2: pEstadoActual };
        var ruta = ip + '/APISolicitudes/solicitudesAdmin';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.solicitudesAdmin = response.data;
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.revisarSolicitud = function () {
        var envio = {
            opcionInt: $scope.scpIdSolicitud,
            opcionInt2: $scope.scpEstado
        };
        var ruta = ip + '/APISolicitudes/cambiarIdEstado';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.obtenerSolicitudesAdmin("T", "0");
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.SolicitudConErrores = function (pObservacion, pEstado) {
        var envio = { opcionInt: $scope.scpIdSolicitud, opcionStr: pObservacion, opcionInt2: pEstado };
        var ruta = ip + '/APISolicitudes/rechazarSolicitud';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.obtenerSolicitudesAdmin("T", "0");
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    ///----------------Conexion a API--------------------

    ///-------------Acciones del filtro------------------
    $("#inlineSolicitudSelect").change(function () {
        $scope.obtenerSolicitudesAdmin($('#inlineSolicitudSelect option:selected').val(), $('#inlineEstadoSelect option:selected').val());
    });

    $("#inlineEstadoSelect").change(function () {
        $scope.obtenerSolicitudesAdmin($('#inlineSolicitudSelect option:selected').val(), $('#inlineEstadoSelect option:selected').val());
    });
    ///-------------Acciones del filtro------------------

    $scope.obtenerSolicitudesAdmin("T", "0");
});
///########################################### Controlador Admin ################################################################

app.controller('LoginController', function ($scope, ServicioHTTP, $location) {
    $scope.login = function () {
        $('#modalContrasena').modal('toggle');
        $('.modal-backdrop').remove();
        $location.path("/admin");
    };

    (function ($) {
        "use strict";
        var input = $('.validate-input .input100');

        $('.validate-form').on('submit', function () {
            var check = true;

            for (var i = 0; i < input.length; i++) {
                if (validate(input[i]) === false) {
                    showValidate(input[i]);
                    check = false;
                }
            }
            if (check) {
                $scope.login();
            }
        });

        $('.validate-form .input100').each(function () {
            $(this).focus(function () {
                hideValidate(this);
            });
        });

        function validate(input) {
            if ($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
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

        function showValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).addClass('alert-validate');
        }

        function hideValidate(input) {
            var thisAlert = $(input).parent();

            $(thisAlert).removeClass('alert-validate');
        }
    })(jQuery);
});

///########################################### Controlador Periodos #############################################################
app.controller('AdminPeriodosController', function ($scope, authFact, ServicioHTTP) {
    $scope.scpUrlBarraNavegacion = "Templates/menuAdmin.html";

    $scope.haySemestre = function () {
        var ruta = ip + '/APIConfiguracion/haySemestre';
        var respuesta = ServicioHTTP.getAll(ruta);
        respuesta.then(function (response) {
            if (response.data !== null) { authFact.setSemestre(response.data.Id); $scope.scpBtnSemestre = "Semestre en curso"; $scope.scpBtnSemestreActive = true;}
            else { authFact.setSemestre(-1); $scope.scpBtnSemestre = "Abrir semestre"; $scope.scpBtnSemestreActive = false;}
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };

    $scope.verFechasSemestre = function () {
        var ruta = ip + '/APIConfiguracion/verFechasSemestre';
        var semestre = { opcionInt: authFact.getSemestre() };
        var respuesta = ServicioHTTP.post(ruta, semestre);
        respuesta.then(function (response) {
            $scope.fechasSemestre = response.data;
            $scope.fechasSemestre.FechaInicioEvaluacion = new Date($scope.fechasSemestre.FechaInicioEvaluacion);
            $scope.fechasSemestre.FechaCierreEvaluacion = new Date($scope.fechasSemestre.FechaCierreEvaluacion);
            $scope.fechasSemestre.FechaTrabajoSocial = new Date($scope.fechasSemestre.FechaTrabajoSocial);
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };

    $scope.calculateTime = function (dt) {
        return new Date(dt).getTime();
    };

    $scope.verPeriodos = function () {
        var ruta = ip + '/APIConfiguracion/verPeriodos';
        var semestre = { opcionInt: authFact.getSemestre() };
        var respuesta = ServicioHTTP.post(ruta, semestre);
        respuesta.then(function (response) {
            $scope.scpPeriodos = response.data;
            console.log($scope.scpPeriodos);
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };

    $scope.setLimitesFecha = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById("FechaInicio").setAttribute("max", today);    
        document.getElementById("FechaCierre").setAttribute("min", today);
        document.getElementById("FechaInicioEvaluacion").setAttribute("min", today);
        document.getElementById("FechaCierreEvaluacion").setAttribute("min", today);
        document.getElementById("FechaTS").setAttribute("min", today);
    };

    $scope.generarAlertaEstado = function (pAccion) {
        $scope.$broadcast('generarAlertaEstado', { pAccion: pAccion });
    };

    $scope.crearSemestre = function () {
        $scope.$broadcast('generarAlertaConf', { pAccion: 'crearSemestre' });
    };

    $scope.crearPeriodo = function () {
        $scope.$broadcast('generarAlertaConf', { pAccion: 'crearPeriodo' });
    };

    $scope.modificarSemestre = function () {
        $scope.$broadcast('generarAlertaConf', { pAccion: 'editarSemestre' });
    };

    $scope.AgregarSemestre = function () {
        var semestre = {
            Semestre1: $scope.semestre.Semestre || 1,
            Ano: $scope.semestre.Ano,
            FechaInicio: $scope.semestre.Inicio,
            FechaCierre: $scope.semestre.Cierre
        };
        var ruta = ip + '/APIConfiguracion/agregarSemestre';
        var respuesta = ServicioHTTP.post(ruta, semestre);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.haySemestre();
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.AgregarPeriodo = function () {

        Beca = '[';

        bandera = false;
        if ($scope.periodo.HA !== null && $scope.periodo.HA !== undefined) {
            if (!bandera) { Beca += "{\"abreviatura\":" + "\"" + 'HA' + "\", \"horas\": " + $scope.periodo.HA + "}"; }
            else { bandera = true; Beca += ", {\"abreviatura\":" + "\"" + 'HA' + "\", \"horas\": " + $scope.periodo.HA + "}"; }
        }
        if ($scope.periodo.HE !== null && $scope.periodo.HE !== undefined) {
            if (!bandera) { Beca += "{\"abreviatura\":" + "\"" + 'HE' + "\", \"horas\": " + $scope.periodo.HE + "}"; }
            else { bandera = true; Beca += ", {\"abreviatura\":" + "\"" + 'HE' + "\", \"horas\": " + $scope.periodo.HE + "}"; }
        }
        if ($scope.periodo.TU !== null && $scope.periodo.TU !== undefined) {
            if (!bandera) { Beca += "{\"abreviatura\":" + "\"" + 'TU' + "\", \"horas\": " + $scope.periodo.TU + "}"; }
            else { bandera = true; Beca += ", {\"abreviatura\":" + "\"" + 'TU' + "\", \"horas\": " + $scope.periodo.TU + "}"; }
        }
        if ($scope.periodo.AE !== null && $scope.periodo.AE !== undefined) {
            if (!bandera) { Beca += "{\"abreviatura\":" + "\"" + 'AE' + "\", \"horas\": " + $scope.periodo.AE + "}"; }
            else { bandera = true; Beca += ", {\"abreviatura\":" + "\"" + 'AE' + "\", \"horas\": " + $scope.periodo.AE + "}"; }
        }
        Beca += ']';

        function AddZero(num) {
            return num >= 0 && num < 10 ? "0" + num : num + "";
        }

        var strDateTime = $scope.periodo.FechaApertura.getFullYear() + '-' + AddZero($scope.periodo.FechaApertura.getDate()) + '-' + AddZero($scope.periodo.FechaApertura.getMonth() + 1)
            + 'T' +
            AddZero($scope.periodo.FechaApertura.getHours()) + ':' +
            AddZero($scope.periodo.FechaApertura.getMinutes()) + ':00';

        var strDateTime2 = $scope.periodo.FechaCierre.getFullYear() + '-' + AddZero($scope.periodo.FechaCierre.getDate()) + '-' + AddZero($scope.periodo.FechaCierre.getMonth() + 1)
            + 'T' +
            AddZero($scope.periodo.FechaCierre.getHours()) + ':' +
            AddZero($scope.periodo.FechaCierre.getMinutes()) + ':00';

        var periodo = {
            FechaApertura: strDateTime,
            FechaCierre: strDateTime2,
            IdAdministrador: 'pp@gmail.com',
            IdSemestre: authFact.getSemestre(),
            Becas: Beca
        };

        console.log(periodo);


        var ruta = ip + '/APIConfiguracion/agregarPeriodo';
        var respuesta = ServicioHTTP.post(ruta, periodo);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.verPeriodos();
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.EditarSemestre = function () {
        var semestre = {
            Id: authFact.getSemestre(),
            FechaInicioEvaluacion: $scope.fechasSemestre.FechaInicioEvaluacion,
            FechaCierreEvaluacion: $scope.fechasSemestre.FechaCierreEvaluacion,
            FechaTrabajoSocial: $scope.fechasSemestre.FechaTrabajoSocial
        };
        var ruta = ip + '/APIConfiguracion/editarSemestre';
        var respuesta = ServicioHTTP.post(ruta, semestre);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.verFechasSemestre();
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };

    $scope.VerPeriodo = function (pId) {
        var envio = {
            opcionInt: pId
        };
        var ruta = ip + '/APIConfiguracion/verPeriodo';
        var respuesta = ServicioHTTP.post(ruta, envio);
        respuesta.then(function (response) {
            $scope.generarAlertaEstado('correcto');
            $scope.periodo = response.data;
            $scope.periodo.FechaApertura = new Date($scope.periodo.FechaApertura);
            $scope.periodo.FechaCierre = new Date($scope.periodo.FechaCierre);
        }, function (error) {
            $scope.generarAlertaEstado('incorrecto');
        });
    };
    

    $scope.haySemestre();
    $scope.setLimitesFecha();
    $scope.verFechasSemestre();
    $scope.verPeriodos();

});


///########################################### Controlador Periodos #############################################################


///########################################### Controlador Usuarios #############################################################
app.controller('AdminRegistrarUsuarioController', function ($scope, ServicioHTTP) {
    $scope.scpUrlBarraNavegacion = "Templates/menuAdmin.html";

    $scope.verRoles = function () {
        var ruta = ip + '/APIConfiguracion/roles';
        var respuesta = ServicioHTTP.getAll(ruta);
        respuesta.then(function (response) {
            $scope.scpRoles = response.data;
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };

    $scope.crearUsuario = function () {
        $scope.$broadcast('generarAlertaConf', { pAccion: 'crearUsuario' });
    };

    $scope.generarAlertaEstado = function (pAccion) {
        $scope.$broadcast('generarAlertaEstado', { pAccion: pAccion });
    };

    $scope.registrarUsuario = function () {
        var solicitud = {
            Correo: $scope.usuario.Correo,
            Contrasena: $scope.usuario.Contrasena,
            Nombre1: $scope.usuario.Nombre1,
            Nombre2: $scope.usuario.Nombre2,
            Apellido1: $scope.usuario.Apellido1,
            Apellido2: $scope.usuario.Apellido2,
            Rol: $scope.usuario.Rol
        };
        $scope.generarAlertaEstado('correcto');
    };

});
///########################################### Controlador Usuarios #############################################################

app.controller('adminReportes', function ($scope) {
    $scope.scpUrlBarraNavegacion = "Templates/menuAdmin.html";
});

app.controller('ReporteTecController', function ($scope, authFact, ServicioHTTP) {
    $scope.scpUrlBarraNavegacion = "Templates/menuAdmin.html";

    $scope.reporteTec = function () {
        var envio = {
            opcionInt: 1
        };
        var ruta = ip + '/APIReportes/reporteTec';
        var respuesta = ServicioHTTP.post(ruta,envio);
        respuesta.then(function (response) {
            $scope.estudiantes = response.data;
            console.log(response.data);
        },
            function (error) {
                $scope.generarAlertaEstado('incorrecto');
            });
    };
    $scope.reporteTec();


    $scope.generarExcel = function (pAccion) {
        $("#reporte").table2excel({
        exclude: ".noExl",
        name: "Reporte",
        filename: "ReporteTEC"
        });
    };

    $scope.generarAlertaEstado = function (pAccion) {
        $scope.$broadcast('generarAlertaEstado', { pAccion: pAccion });
    };
});

///########################################### Controlador Responsable #############################################################

app.controller('responsableController', function ($scope, ServicioHTTP) {

    //----------------Solicita los estudiantes a cargo del profesor---------------
    $scope.obtenerEstudiantes = function () {
        console.log("a");
        var idProfe = { opcionStr: 'miguel@gmail.com', opcionInt: 2 };
        var ruta = ip + '/APIRetroAlimentacion/solicitarEstudiantes';
        toastr.clear($('.toast-loading')); toastr.loading('Cargando estudiantes');
        var respuesta = ServicioHTTP.post(ruta, idProfe);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.estudiantes = response.data;
            console.log($scope.estudiantes);
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Ha ocurrido un error al obtener los estudiantes a evaluar');
            });
    };

    $scope.abrirFormEvaluacion = function (pEstudiante) {
        $scope.estudiante = pEstudiante;
        if ($scope.estudiante.Evaluacion === null)
            $scope.estudiante.Evaluacion = { Observaciones: '', HorasLaboradas: 0, Recomendado: 'false' };
        else
            $scope.estudiante.Evaluacion.Recomendado = $scope.estudiante.Evaluacion.Recomendado.toString();

        if ($scope.estudiante.Evaluado === false) {
            $scope.botonEvaluar = true;
            $scope.botonActualEval = false;
        }
        else {
            $scope.botonEvaluar = false;
            $scope.botonActualEval = true;
        }
        $('#EvaluacionModal').modal();
    };

    //------------realiza la evaluacion del estudiante------------------
    $scope.evaluarEstudiante = function () {
        var evaluacion = {
            IdResponsable: 'pp@gmail.com',
            IdEstudiante: $scope.estudiante.Carne,
            HorasLaboradas: $scope.estudiante.Evaluacion.HorasLaboradas,
            Recomendable: $scope.estudiante.Evaluacion.Recomendado || false,
            Observacion: $scope.estudiante.Evaluacion.Observaciones || '',
            IdSolicitud: $scope.estudiante.IdSolicitud
        };
        console.log(evaluacion);
        var ruta = ip + '/APIRetroAlimentacion/evaluarEstudiante';
        toastr.clear($('.toast-loading')); toastr.loading('Realizando evaluación');
        var respuesta = ServicioHTTP.post(ruta, evaluacion);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            toastr.success('Evaluación realizada con éxito');
            $scope.obtenerEstudiantes();
            $('#EvaluacionModal').modal('hide');
            $scope.iniciarTooltip();
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible realizar la valuación');
            });
    };

    //-------------guarda los cambios realizados a un estudiante ya evaluado--------------
    $scope.guardarCambiosEvaluacion = function () {
        var evaluacion = {
            Id: $scope.estudiante.Id.Id,
            HorasLaboradas: $scope.estudiante.Evaluacion.HorasLaboradas,
            Recomendable: $scope.estudiante.Evaluacion.Recomendado || false,
            Observacion: $scope.estudiante.Evaluacion.Observaciones || ''
        };
        console.log(evaluacion);
        var ruta = ip + '/APIRetroAlimentacion/editarEvaluarEstudiante';
        toastr.clear($('.toast-loading')); toastr.loading('Guardando cambios');
        var respuesta = ServicioHTTP.post(ruta, evaluacion);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            toastr.success('Cambios realizados con éxito');
            $scope.obtenerEstudiantes();
            $('#EvaluacionModal').modal('hide');
            $scope.iniciarTooltip();
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible realizar la valuación');
            });
    };

    $scope.iniciarTooltip = function () {
        $(document).ready(function () {
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
        });
    };

    $scope.obtenerEstudiantes();
    $scope.iniciarTooltip();

});
///########################################### Controlador Responsable #############################################################
