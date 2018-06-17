var ip = '';

app.run(['$rootScope', function ($rootScope) {
    $rootScope.scpUrlFormsModals = 'Templates/FormsModals.html';
}]);
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
