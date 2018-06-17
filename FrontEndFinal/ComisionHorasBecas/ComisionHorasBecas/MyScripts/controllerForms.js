
///################################### Controlador Formularios y Modals #########################################################
app.controller('FormsModalsController', function ($scope, ServicioHTTP, authFact) {

    ///-------------Modals Comision-----------------------
    $scope.$on('generarModalRechazo', function (e, data) {
        $scope.generaModalRechazo(data.pAccion);
    });

    $scope.generaModalRechazo = function (pAccion) {
        $scope.scpAccionModalRechazo = pAccion;
        if (pAccion === 'pendiente') {
            $scope.scpMensajeModalRechazo = 'Marcar solicitud como pendiente';
            $scope.scpBotonModalRechazo = 'Marcar como pendiente';
            return;
        }
        else if (pAccion === 'rechazar') {
            $scope.scpMensajeModalRechazo = 'Rechazar Solicitud';
            $scope.scpBotonModalRechazo = 'Rechazar';
        }
        else if (pAccion === 'cancelar') {
            $scope.scpMensajeModalRechazo = 'Cancelar una solicitud ya revisada por la comisión (ESTO TENDRÁ CONSECUENCIAS COMO NO VOLVER A SER TOMADO EN CUENTA PARA PRÓXIMOS PERIODOS), indique las observaciones sobre las razones de la cancelación.';
            $scope.scpBotonModalRechazo = 'Cancelar';
        }
        else if (pAccion === 'corregirErrores') {
            $scope.scpMensajeModalRechazo = 'Solicitud con errores';
            $scope.scpBotonModalRechazo = 'Solicitar Corrección';
        }
        else {
            alert('Algo salió mal al definir la acción a procesar.');
        }
    };

    $scope.accionModalRechazo = function () {
        if ($scope.scpAccionModalRechazo === 'rechazar') {
            $scope.generarAlertaConf('rechazar', $scope.scpIdSolicitud);

        }
        else if ($scope.scpAccionModalRechazo === 'pendiente') {
            $scope.generarAlertaConf('pendiente', $scope.scpIdSolicitud);
        }
        else if ($scope.scpAccionModalRechazo === 'corregirErrores') {
            $scope.generarAlertaConf('corregirErrores', $scope.scpIdSolicitud);
        }
        else if ($scope.scpAccionModalRechazo === 'cancelar') {
            $scope.generarAlertaConf('cancelarRev', $scope.scpIdSolicitud);
        }
        else {
            alert('Algo salió mal con el proceso.');
        }
    };

    $scope.accionModalAprobar = function () {
        $scope.generarAlertaConf('aprobar', $scope.scpIdSolicitud);
    };
    ///-------------Modals Comision-----------------------

    ///------------------Alertas--------------------------
    $scope.$on('generarAlertaConf', function (e, data) {
        $scope.generarAlertaConf(data.pAccion);
    });

    $scope.generarAlertaConf = function (pAccion) {

        $scope.scpAccionAlertaConf = pAccion;
        if (pAccion === 'pendiente') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea asignar el estado de pendiente a la solicitud?';
            return;
        }
        else if (pAccion === 'rechazar') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea asignar el estado de rechazado a la solicitud?';
        }
        else if (pAccion === 'aprobar') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea asignar el estado de aprobado a la solicitud?';
        }
        else if (pAccion === 'revisar') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea asignar el estado de revisado a la solicitud?';
        }
        else if (pAccion === 'corregirErrores') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea asignar el estado de solicitud con errores a la solicitud?';
        }
        else if (pAccion === 'cancelarRev') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea cancelar la solicitud, apesar de las consecuencias?';
        }
        else if (pAccion === 'crearUsuario') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea crear el usuario?';
        }
        else if (pAccion === 'crearSemestre') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea crear el semestre?';
        }
        else if (pAccion === 'editarSemestre') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea editar el semestre?';
        }
        else if (pAccion === 'crearPeriodo') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea crear el periodo?';
        }
        else if (pAccion === 'guardarSolicitud') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea guardar la solicitud como borrador?';
        }
        else if (pAccion === 'enviarSolicitud') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea enviar la solicitud?';
        }
        else if (pAccion === 'clonarSolicitud') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea clonar la solicitud?';
        }
        else if (pAccion === 'cancelarSolicitud') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea cancelar la solicitud? Este proceso es irreversible.';
        }
        else if (pAccion === 'editarSolicitud') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea editar la solicitud?';
        }
        else if (pAccion === 'borrarSolicitud') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea eliminar la solicitud? Este proceso es irreversible.';
        }
        else if (pAccion === 'enviarSolicitudGuardada') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea enviar la solicitud?';
        }
        else if (pAccion === 'cambiarContrasena') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea cambiar la contraseña?';
        }
        else if (pAccion === 'aceptarCancelacion') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea aprobar la cancelación de la solicitud?';
        }
        else if (pAccion === 'rechazarCancelacion') {
            $scope.scpMensajeAlertaConf = '¿Está completamente seguro que desea rechazar la cancelación de la solicitud?';
        }
        else {
            alert('Algo salió mal al definir la acción a procesar.');
        }
    };

    $scope.accionAlertaConf = function () {
        if ($scope.scpAccionAlertaConf === 'rechazar') {
            $scope.rechazarSolicitud($scope.scpModalRechazoObservacion, 5);
            $scope.scpModalRechazoObservacion = "";
        }
        else if ($scope.scpAccionAlertaConf === 'pendiente') {
            $scope.rechazarSolicitud($scope.scpModalRechazoObservacion, 3);
            $scope.scpModalRechazoObservacion = "";
        }
        else if ($scope.scpAccionAlertaConf === 'aprobar') {
            $scope.aprobarSolicitud($scope.scpModalAprobarObservacion, $scope.scpModalAprobarEncargado, $scope.scpModalAprobarHoras);
            $scope.scpModalAprobarObservacion = "";
            $scope.scpModalAprobarEncargado = "";
            $scope.scpModalAprobarHoras = "";
        }
        else if ($scope.scpAccionAlertaConf === 'revisar') {
            $scope.revisarSolicitud();
        }
        else if ($scope.scpAccionAlertaConf === 'corregirErrores') {
            $scope.SolicitudConErrores($scope.scpModalRechazoObservacion, 7);
            $scope.scpModalRechazoObservacion = "";
        }
        else if ($scope.scpAccionAlertaConf === 'cancelarRev') {
            $scope.cancelarSolicitudRev($scope.scpIdSolicitud,$scope.scpModalRechazoObservacion);
            $scope.scpModalRechazoObservacion = "";
        }
        else if ($scope.scpAccionAlertaConf === 'crearUsuario') {
            $scope.registrarUsuario();
        }
        else if ($scope.scpAccionAlertaConf === 'crearSemestre') {
            $scope.AgregarSemestre();
        }
        else if ($scope.scpAccionAlertaConf === 'crearPeriodo') {
            $scope.AgregarPeriodo();
        }
        else if ($scope.scpAccionAlertaConf === 'editarSemestre') {
            $scope.EditarSemestre();
        }
        else if ($scope.scpAccionAlertaConf === 'cambiarContrasena') {
            $scope.cambiarContrasena();
        }
        else if ($scope.scpAccionAlertaConf === 'borrador') {
            $scope.almacenarSolicitud($scope.scpEstado, $scope.scpTB);
        }
        else if ($scope.scpAccionAlertaConf === 'enviarSolicitud') {
            $scope.almacenarSolicitud($scope.scpEstado, $scope.scpTB);
        }
        else if ($scope.scpAccionAlertaConf === 'clonarSolicitud') {
            $scope.clonarSolicitud($scope.scpIdSolicitud, $scope.scpTB);
        }
        else if ($scope.scpAccionAlertaConf === 'cancelarSolicitud') {
            $scope.cancelarSolicitud($scope.scpIdSolicitud);
        }
        else if ($scope.scpAccionAlertaConf === 'editarSolicitud') {
            $scope.editarSolicitud($scope.scpTB, $scope.scpIdSolicitud);
        }
        else if ($scope.scpAccionAlertaConf === 'enviarSolicitudGuardada') {
            $scope.enviarSolicitud($scope.scpIdSolicitud);
        }
        else if ($scope.scpAccionAlertaConf === 'borrarSolicitud') {
            $scope.borrarSolicitud($scope.scpIdSolicitud);
        }
        else if ($scope.scpAccionAlertaConf === 'aceptarCancelacion') {
            $scope.AprobarCancelacion($scope.scpIdSolicitud,6);
        }
        else if ($scope.scpAccionAlertaConf === 'rechazarCancelacion') {
            $scope.RechazarCancelacion($scope.scpIdSolicitud,8);
        }
        else {
            alert('Algo salió mal con el proceso.');
        }
    };

    $scope.$on('generarAlertaEstado', function (e, data) {
        $scope.generarAlertaEstado(data.pAccion);
    });

    $scope.generarAlertaEstado = function (pAccion) {
        $scope.scpAccionAlertaEstado = pAccion;
        if (pAccion === 'correcto') {
            $scope.scpMensajeAlertaEstado = 'Cambios guardados';
        }
        else if (pAccion === 'guardado') {
            toastr.success('Solicitud guardada en Borradores.');
        }
        else if (pAccion === ('enviada' || 'editada' || 'borrada' || 'cancelada')) {
            toastr.success('Solicitud  ' + pAccion + ' con éxito.');
        }
        else if (pAccion === 'incorrecto') {
            $scope.scpMensajeAlertaEstado = 'Ocurrió un error';
        }
        else if (pAccion === 'enviarCorreo') {
            $scope.scpMensajeAlertaEstado = 'Correo enviado nuevamente';
        }
        else {
            alert('Algo salió mal al definir la acción a procesar.');
        }
    };
    ///------------------Alertas--------------------------

    ///------------------Formularios----------------------
    $scope.$on('verFormularioSolicitud', function (e, data) {
        $scope.verFormularioSolicitud(data.pId, data.pAccion, data.pBeca);
    });

    ProcesarImagen = function (input, viewContainer, textNombre) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById(viewContainer).src = e.target.result;
                document.getElementById(textNombre).value = input.files[0].name;
            };
            reader.onerror = function (error) {
                toastr.error('Ha ocurrido un error al procesar la imagen');
                //$scope.generarAlertaEstado('incorrecto');
            };
            reader.readAsDataURL(input.files[0]);
        }
    };
    //elimina los datos cargados de un input de imagen
    $scope.EliminarImagen = function (viewContainer, textNombre) {
        document.getElementById(viewContainer).src = '';
        document.getElementById(textNombre).value = '';
    };

    $scope.verFormularioSolicitud = function (pId, pAccion, pBeca) {
        $scope.limpiarInputs();
        $scope.TB = pBeca;
        var ruta = ip;
        $scope.banderas = {
            scpHA: false,
            scpAE: false,
            scpHATU: false,
            scpTipoBeca: false,
            scpCarne: false,
            scpBtnGuardar: false,
            scpBtnAdmin: false,
            scpBtnComision: false,
            scpBtnEstudiante: false,
            scpBtnEditarEst: false
        };
        if (pAccion === 'detallesAdmin') { $scope.bloquearInputs = true; $scope.banderas.scpBtnAdmin = true; $scope.banderas.scpCarne = true; }
        else if (pAccion === 'detallesComision') { $scope.bloquearInputs = true; $scope.banderas.scpBtnComision = true; $scope.banderas.scpCarne = true; }
        else if (pAccion === 'crear') { $scope.bloquearInputs = false; $scope.banderas.scpBtnEstudiante = true; $scope.carne = authFact.getCarne(); $scope.banderas.scpCarne = true; $('#Formulario').modal();}
        else if (pAccion === 'detallesEstudiante') { $scope.bloquearInputs = true; $scope.carne = authFact.getCarne(); $scope.banderas.scpCarne = true; }
        else if (pAccion === 'editarEnviada') { $scope.bloquearInputs = false; $scope.carne = authFact.getCarne(); $scope.banderas.scpCarne = true; $scope.banderas.scpBtnEditarEst = true; }
        else { $scope.bloquearInputs = false; }




        if (pBeca === "HA") { ruta = ruta + '/APISolicitudes/verSolicitudHATU'; $scope.banderas.scpHA = true; $scope.banderas.scpHATU = true; $scope.banderas.scpTipoBeca = true; $scope.scpTipoForm = "Formulario Beca Horas Asistente"; }
        else if (pBeca === "AE") { ruta = ruta + '/APISolicitudes/verSolicitudAE'; $scope.banderas.scpAE = true; $scope.banderas.scpTipoBeca = true; $scope.banderas.scpTipoForm = "Formulario Beca Asistencia Especial"; }
        else if (pBeca === "TU") { ruta = ruta + '/APISolicitudes/verSolicitudHATU'; $scope.banderas.scpHATU = true; $scope.banderas.scpTipoBeca = true; $scope.scpTipoForm = "Formulario Beca Tutoría Estudiantil"; }
        else { ruta = ruta + '/APISolicitudes/verSolicitudHE'; $scope.scpTipoForm = "Formulario Beca Horas Estudiante"; }

        
        $scope.verCarreras();
        if (pAccion !== 'crear') {
            toastr.clear($('.toast-loading')); toastr.loading('Cargando formulario');
            var idSolicitud = { opcionInt: pId };
            var respuesta = ServicioHTTP.post(ruta, idSolicitud);
            respuesta.then(function (response) {
                $scope.solicitud = response.data;
                $scope.CarreraId = $scope.scpCarreras[$scope.solicitud.Carrera - 1];
                $scope.solicitud.IdBanco = $scope.solicitud.IdBanco.toString();
                $scope.solicitud.OtraBeca = $scope.solicitud.OtraBeca.toString();
                $scope.solicitud.CumpleRequisitos = $scope.solicitud.CumpleRequisitos.toString();
                $scope.solicitud.imagenCedula = 'data:image/png;base64,' + $scope.solicitud.imagenCedula;
                $scope.solicitud.imagenPromedioAnterior = 'data:image/png;base64,' + $scope.solicitud.imagenPromedioAnterior;
                $scope.solicitud.imagenPromedioGeneral = 'data:image/png;base64,' + $scope.solicitud.imagenPromedioGeneral;
                $scope.solicitud.imagenCuenta = 'data:image/png;base64,' + $scope.solicitud.imagenCuenta;
                $scope.solicitud.imagenCreditosAnterior = 'data:image/png;base64,' + $scope.solicitud.imagenCreditosAnterior;
                $scope.solicitud.imagenCreditosTec = 'data:image/png;base64,' + $scope.solicitud.imagenCreditosTec;
                $scope.solicitud.ScreenshotNota = 'data:image/png;base64,' + $scope.solicitud.ScreenshotNota;
                if (pBeca === 'AE')
                    $scope.solicitud.Horas = $scope.solicitud.Horas.toString();
                toastr.clear($('.toast-loading'));
                $('#Formulario').modal();
            },
                function (error) {
                    toastr.clear($('.toast-loading'));
                    toastr.error('Ha ocurrido un error al cargar el formulario.');
                    //$scope.generarAlertaEstado('incorrecto');
                    return;
                });
        }
    };

    $scope.prevEditarSolicitud = function (pBeca, pId) {
        $scope.scpIdSolicitud = pId;
        $scope.scpTB = pBeca;
        $scope.generarAlertaConf('editarSolicitud');
    };

    $scope.editarSolicitud = function (pBeca, pId) {
        var ruta = ip;
        var solicitud;
        if (pBeca === 'HE') {
            solicitud = {
                Id: pId,
                IdCarrera: $scope.CarreraId.Id || 1,
                IdSemestre: authFact.getSemestre(),
                Carne: authFact.getCarne() || 0,
                Cedula: $scope.solicitud.Cedula || 0,
                Telefono: $scope.solicitud.Telefono || 0,
                Apellido1: $scope.solicitud.Apellido1 || '',
                Apellido2: $scope.solicitud.Apellido2 || '',
                Nombre: $scope.solicitud.Nombre || '',
                Email: $scope.solicitud.Email || '',
                PonderadoAnterior: $scope.solicitud.PonderadoAnterior || 0,
                PonderadoGeneral: $scope.solicitud.PonderadoGeneral || 0,
                IdBanco: parseInt($scope.solicitud.IdBanco) || 1,
                NumeroCuenta: $scope.solicitud.NumeroCuenta || 0,
                CumpleRequisitos: JSON.parse($scope.solicitud.CumpleRequisitos || 'false'),
                OtraBeca: JSON.parse($scope.solicitud.OtraBeca || 'false'),
                OtraHoras: $scope.solicitud.OtraHoras || 0,
                OtraEscuela: $scope.solicitud.OtraEscuela || '',
                CreditosAprobadosAnterior: $scope.solicitud.CreditosAprobadosAnterior || 0,
                CreditosAprobadosTotal: $scope.solicitud.CreditosAprobadosTotal || 0,
                CreditosSemestreActual: $scope.solicitud.CreditosSemestreActual || 0,
                CursosPendientes: $scope.solicitud.CursosPendientes || 0,
                AnosActivoTec: $scope.solicitud.AnosActivoTec || 0,
                ScreenShotCedula: document.getElementById('viewCedula').src.split(",")[1] || '',
                ScreenShotPonderadoAnterior: document.getElementById('viewPondeAnterior').src.split(",")[1] || '',
                ScreenShotPonderadoGeneral: document.getElementById('viewPondeGeneral').src.split(",")[1] || '',
                ScreenShotCuentaBanco: document.getElementById('viewCuenta').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosTotal: document.getElementById('viewCreditosAnt').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosAnterior: document.getElementById('viewCreditosTEC').src.split(",")[1] || ''
            };
            ruta = ruta + '/APISolicitudes/editarSolicitudHE';
        }
        else if (pBeca === 'AE') {
            solicitud = {
                Id: pId,
                IdCarrera: $scope.CarreraId.Id || 1,
                IdSemestre: authFact.getSemestre(),
                Carne: authFact.getCarne() || 0,
                Cedula: $scope.solicitud.Cedula || 0,
                Telefono: $scope.solicitud.Telefono || 0,
                Apellido1: $scope.solicitud.Apellido1 || '',
                Apellido2: $scope.solicitud.Apellido2 || '',
                Nombre: $scope.solicitud.Nombre || '',
                Email: $scope.solicitud.Email || '',
                PonderadoAnterior: $scope.solicitud.PonderadoAnterior || 0,
                PonderadoGeneral: $scope.solicitud.PonderadoGeneral || 0,
                IdBanco: parseInt($scope.solicitud.IdBanco) || 1,
                NumeroCuenta: $scope.solicitud.NumeroCuenta || 0,
                CumpleRequisitos: JSON.parse($scope.solicitud.CumpleRequisitos || 'false'),
                OtraBeca: JSON.parse($scope.solicitud.OtraBeca || 'false'),
                OtraHoras: $scope.solicitud.OtraHoras || 0,
                OtraEscuela: $scope.solicitud.OtraEscuela || '',
                CreditosAprobadosAnterior: $scope.solicitud.CreditosAprobadosAnterior || 0,
                CreditosAprobadosTotal: $scope.solicitud.CreditosAprobadosTotal || 0,
                CreditosSemestreActual: $scope.solicitud.CreditosSemestreActual || 0,
                CursosPendientes: $scope.solicitud.CursosPendientes || 0,
                AnosActivoTec: $scope.solicitud.AnosActivoTec || 0,
                ScreenShotCedula: document.getElementById('viewCedula').src.split(",")[1] || '',
                ScreenShotPonderadoAnterior: document.getElementById('viewPondeAnterior').src.split(",")[1] || '',
                ScreenShotPonderadoGeneral: document.getElementById('viewPondeGeneral').src.split(",")[1] || '',
                ScreenShotCuentaBanco: document.getElementById('viewCuenta').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosTotal: document.getElementById('viewCreditosAnt').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosAnterior: document.getElementById('viewCreditosTEC').src.split(",")[1] || '',
                Horas: parseInt($scope.solicitud.Horas) || 1
            };
            ruta = ruta + '/APISolicitudes/editarSolicitudAE';
        }
        else if (pBeca === 'HA' || pBeca === 'TU') {
            solicitud = {
                IdCarrera: $scope.CarreraId.Id || 1,
                IdSemestre: authFact.getSemestre(),
                Id: pId,
                Carne: authFact.getCarne() || 0,
                Cedula: $scope.solicitud.Cedula || 0,
                Telefono: $scope.solicitud.Telefono || 0,
                Apellido1: $scope.solicitud.Apellido1 || '',
                Apellido2: $scope.solicitud.Apellido2 || '',
                Nombre: $scope.solicitud.Nombre || '',
                Email: $scope.solicitud.Email || '',
                PonderadoAnterior: $scope.solicitud.PonderadoAnterior || 0,
                PonderadoGeneral: $scope.solicitud.PonderadoGeneral || 0,
                IdBanco: parseInt($scope.solicitud.IdBanco) || 1,
                NumeroCuenta: $scope.solicitud.NumeroCuenta || 0,
                CumpleRequisitos: JSON.parse($scope.solicitud.CumpleRequisitos || 'false'),
                OtraBeca: JSON.parse($scope.solicitud.OtraBeca || 'false'),
                OtraHoras: $scope.solicitud.OtraHoras || 0,
                OtraEscuela: $scope.solicitud.OtraEscuela || '',
                CreditosAprobadosAnterior: $scope.solicitud.CreditosAprobadosAnterior || 0,
                CreditosAprobadosTotal: $scope.solicitud.CreditosAprobadosTotal || 0,
                CreditosSemestreActual: $scope.solicitud.CreditosSemestreActual || 0,
                CursosPendientes: $scope.solicitud.CursosPendientes || 0,
                AnosActivoTec: $scope.solicitud.AnosActivoTec || 0,
                ScreenShotCedula: document.getElementById('viewCedula').src.split(",")[1] || '',
                ScreenShotPonderadoAnterior: document.getElementById('viewPondeAnterior').src.split(",")[1] || '',
                ScreenShotPonderadoGeneral: document.getElementById('viewPondeGeneral').src.split(",")[1] || '',
                ScreenShotCuentaBanco: document.getElementById('viewCuenta').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosTotal: document.getElementById('viewCreditosAnt').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosAnterior: document.getElementById('viewCreditosTEC').src.split(",")[1] || '',
                Horas: parseInt($scope.solicitud.Horas) || 1,
                Codigo: $scope.solicitud.Codigo || '',
                NombreCurso: $scope.solicitud.NombreCurso || '',
                Nota: $scope.solicitud.Nota || 0,
                NombreResponsable: $scope.solicitud.NombreResponsable || '',
                ScreenshotNota: document.getElementById('viewNotaCurso').src.split(",")[1] || ''
            };
            ruta = ruta + '/APISolicitudes/editarSolicitudHATU';
        }
        var respuesta = ServicioHTTP.post(ruta, solicitud);
        toastr.clear($('.toast-loading')); toastr.loading('Guardando cambios');
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $('#Formulario').modal('hide');
            //$scope.generarAlertaEstado('editada');
            toastr.success('Solicitud editada con éxito.');
            $scope.$emit('recargarGuardadas');
            $scope.$emit('recargarEnviadas');
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible guardar los cambios realizados en la solicitud.');
                //$scope.generarAlertaEstado('incorrecto');
            });
    };


    $scope.crearSolicitud = function (pEstado, pBeca, pAccion) {
        $scope.scpEstado = pEstado;
        $scope.scpTB = pBeca;
        $scope.scpAccionAlertaConf = pAccion;
        if (pAccion === 'borrador') { $scope.accionAlertaConf(); }
        else { $scope.generarAlertaConf('enviarSolicitud'); }
    };


    $scope.almacenarSolicitud = function (pEstado, pBeca) {
        var ruta = ip;
        var solicitud;
        if (pBeca === 'HE') {
            solicitud = {
                IdCarrera: $scope.CarreraId.Id || 1,
                IdSemestre: authFact.getSemestre(),
                Estado: pEstado,
                AbreviaturaBeca: pBeca,
                Carne: authFact.getCarne() || 0,
                Cedula: $scope.solicitud.Cedula || 0,
                Telefono: $scope.solicitud.Telefono || 0,
                Apellido1: $scope.solicitud.Apellido1 || '',
                Apellido2: $scope.solicitud.Apellido2 || '',
                Nombre: $scope.solicitud.Nombre || '',
                Email: $scope.solicitud.Email || '',
                PonderadoAnterior: $scope.solicitud.PonderadoAnterior || 0,
                PonderadoGeneral: $scope.solicitud.PonderadoGeneral || 0,
                IdBanco: parseInt($scope.solicitud.IdBanco) || 1,
                NumeroCuenta: $scope.solicitud.NumeroCuenta || 0,
                CumpleRequisitos: JSON.parse($scope.solicitud.CumpleRequisitos || 'false'),
                OtraBeca: JSON.parse($scope.solicitud.OtraBeca || 'false'),
                OtraHoras: $scope.solicitud.OtraHoras || 0,
                OtraEscuela: $scope.solicitud.OtraEscuela || '',
                CreditosAprobadosAnterior: $scope.solicitud.CreditosAprobadosAnterior || 0,
                CreditosAprobadosTotal: $scope.solicitud.CreditosAprobadosTotal || 0,
                CreditosSemestreActual: $scope.solicitud.CreditosSemestreActual || 0,
                CursosPendientes: $scope.solicitud.CursosPendientes || 0,
                AnosActivoTec: $scope.solicitud.AnosActivoTec || 0,
                ScreenShotCedula: document.getElementById('viewCedula').src.split(",")[1] || '',
                ScreenShotPonderadoAnterior: document.getElementById('viewPondeAnterior').src.split(",")[1] || '',
                ScreenShotPonderadoGeneral: document.getElementById('viewPondeGeneral').src.split(",")[1] || '',
                ScreenShotCuentaBanco: document.getElementById('viewCuenta').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosTotal: document.getElementById('viewCreditosAnt').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosAnterior: document.getElementById('viewCreditosTEC').src.split(",")[1] || ''
            };
            ruta = ruta + '/APISolicitudes/almacenarSolicitudHE';
        }
        else if (pBeca === 'AE') {
            solicitud = {
                IdCarrera: $scope.CarreraId.Id || 1,
                IdSemestre: authFact.getSemestre(),
                Estado: pEstado,
                AbreviaturaBeca: pBeca,
                Carne: authFact.getCarne() || 0,
                Cedula: $scope.solicitud.Cedula || 0,
                Telefono: $scope.solicitud.Telefono || 0,
                Apellido1: $scope.solicitud.Apellido1 || '',
                Apellido2: $scope.solicitud.Apellido2 || '',
                Nombre: $scope.solicitud.Nombre || '',
                Email: $scope.solicitud.Email || '',
                PonderadoAnterior: $scope.solicitud.PonderadoAnterior || 0,
                PonderadoGeneral: $scope.solicitud.PonderadoGeneral || 0,
                IdBanco: parseInt($scope.solicitud.IdBanco) || 1,
                NumeroCuenta: $scope.solicitud.NumeroCuenta || 0,
                CumpleRequisitos: JSON.parse($scope.solicitud.CumpleRequisitos || 'false'),
                OtraBeca: JSON.parse($scope.solicitud.OtraBeca || 'false'),
                OtraHoras: $scope.solicitud.OtraHoras || 0,
                OtraEscuela: $scope.solicitud.OtraEscuela || '',
                CreditosAprobadosAnterior: $scope.solicitud.CreditosAprobadosAnterior || 0,
                CreditosAprobadosTotal: $scope.solicitud.CreditosAprobadosTotal || 0,
                CreditosSemestreActual: $scope.solicitud.CreditosSemestreActual || 0,
                CursosPendientes: $scope.solicitud.CursosPendientes || 0,
                AnosActivoTec: $scope.solicitud.AnosActivoTec || 0,
                ScreenShotCedula: document.getElementById('viewCedula').src.split(",")[1] || '',
                ScreenShotPonderadoAnterior: document.getElementById('viewPondeAnterior').src.split(",")[1] || '',
                ScreenShotPonderadoGeneral: document.getElementById('viewPondeGeneral').src.split(",")[1] || '',
                ScreenShotCuentaBanco: document.getElementById('viewCuenta').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosTotal: document.getElementById('viewCreditosAnt').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosAnterior: document.getElementById('viewCreditosTEC').src.split(",")[1] || '',
                Horas: parseInt($scope.solicitud.Horas) || 1
            };
            ruta = ruta + '/APISolicitudes/almacenarSolicitudAE';
        }
        else if (pBeca === 'HA' || pBeca === 'TU') {
            solicitud = {
                IdCarrera: $scope.CarreraId.Id || 1,
                IdSemestre: authFact.getSemestre(),
                Estado: pEstado,
                AbreviaturaBeca: pBeca,
                Carne: authFact.getCarne() || 0,
                Cedula: $scope.solicitud.Cedula || 0,
                Telefono: $scope.solicitud.Telefono || 0,
                Apellido1: $scope.solicitud.Apellido1 || '',
                Apellido2: $scope.solicitud.Apellido2 || '',
                Nombre: $scope.solicitud.Nombre || '',
                Email: $scope.solicitud.Email || '',
                PonderadoAnterior: $scope.solicitud.PonderadoAnterior || 0,
                PonderadoGeneral: $scope.solicitud.PonderadoGeneral || 0,
                IdBanco: parseInt($scope.solicitud.IdBanco) || 1,
                NumeroCuenta: $scope.solicitud.NumeroCuenta || 0,
                CumpleRequisitos: JSON.parse($scope.solicitud.CumpleRequisitos || 'false'),
                OtraBeca: JSON.parse($scope.solicitud.OtraBeca || 'false'),
                OtraHoras: $scope.solicitud.OtraHoras || 0,
                OtraEscuela: $scope.solicitud.OtraEscuela || '',
                CreditosAprobadosAnterior: $scope.solicitud.CreditosAprobadosAnterior || 0,
                CreditosAprobadosTotal: $scope.solicitud.CreditosAprobadosTotal || 0,
                CreditosSemestreActual: $scope.solicitud.CreditosSemestreActual || 0,
                CursosPendientes: $scope.solicitud.CursosPendientes || 0,
                AnosActivoTec: $scope.solicitud.AnosActivoTec || 0,
                ScreenShotCedula: document.getElementById('viewCedula').src.split(",")[1] || '',
                ScreenShotPonderadoAnterior: document.getElementById('viewPondeAnterior').src.split(",")[1] || '',
                ScreenShotPonderadoGeneral: document.getElementById('viewPondeGeneral').src.split(",")[1] || '',
                ScreenShotCuentaBanco: document.getElementById('viewCuenta').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosTotal: document.getElementById('viewCreditosAnt').src.split(",")[1] || '',
                ScreenShotCreditosAprobadosAnterior: document.getElementById('viewCreditosTEC').src.split(",")[1] || '',
                Horas: parseInt($scope.solicitud.Horas) || 1,
                Codigo: $scope.solicitud.Codigo || '',
                NombreCurso: $scope.solicitud.NombreCurso || '',
                Nota: $scope.solicitud.Nota || 0,
                NombreResponsable: $scope.solicitud.NombreResponsable || '',
                ScreenshotNota: document.getElementById('viewNotaCurso').src.split(",")[1] || ''
            };
            ruta = ruta + '/APISolicitudes/almacenarSolicitudHATU';
        }


        var respuesta = ServicioHTTP.post(ruta, solicitud);
        toastr.clear($('.toast-loading'));
        if (pEstado == 0)
            toastr.loading('Guardando solicitud');
        else
            toastr.loading('Enviando solicitud');
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $('#Formulario').modal('hide');
            if (pEstado === 0) {
                toastr.success('Solicitud guarda en Borradores.');
                $scope.$emit('recargarGuardadas');
            }
            else if (pEstado === 1) {
                toastr.success('Solicitud enviada con éxito.');
                //$scope.generarAlertaEstado('enviada');
                $scope.$emit('recargarEnviadas');
            }
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                if (pEstado === 0)
                    toastr.error('Error. No fue posible guardar la solicitud.');
                else
                    toastr.error('Error.No fue posible enviar la solicitud.');
                //$scope.generarAlertaEstado('incorrecto');
            });
    };

    $scope.clonarSolicitud = function (pId, pBeca) {
        var solicitud = { idSemestre: authFact.getSemestre(), idSolicitud: pId, beca: pBeca };
        var ruta = ip + '/APISolicitudes/duplicarSolicitud';
        var respuesta = ServicioHTTP.post(ruta, solicitud);
        toastr.clear($('.toast-loading')); toastr.loading('Clonando solicitud');
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.$emit('recargarGuardadas');
            toastr.success('Solicitud clonada. Se ha guardado en Borradores');
            //$scope.generarAlertaEstado('guardada');
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible clonar la solicitud.');
                // $scope.generarAlertaEstado('incorrecto');
            });
    };

    $scope.cancelarSolicitud = function (pId) {
        var idSolicitud = { opcionInt: pId };
        var ruta = ip + '/APISolicitudes/cancelarEnviadaTiempo';
        var respuesta = ServicioHTTP.post(ruta, idSolicitud);
        toastr.clear($('.toast-loading')); toastr.loading('Cancelando solicitud');
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.$emit('recargarEnviadas');
            toastr.success('Solicitud cancelada con éxito.');
            //$scope.generarAlertaEstado('cancelada');
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible cancelar la solicitud.');
                //$scope.generarAlertaEstado('incorrecto');
            });
    };

    $scope.cancelarSolicitudRev = function (pId, pObs) {
        var idSolicitud = { opcionInt: pId, opcionInt2: 3, opcionStr:pObs };
        var ruta = ip + '/APISolicitudes/cancelarSolicitudRev';
        var respuesta = ServicioHTTP.post(ruta, idSolicitud);
        toastr.clear($('.toast-loading')); toastr.loading('Cancelando solicitud');
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.$emit('recargarEnviadas');
            toastr.success('Solicitud cancelada con éxito.');
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Error. No fue posible cancelar la solicitud.');
                //$scope.generarAlertaEstado('incorrecto');
            });
    };

    ///------------------Formularios----------------------

    $scope.verCarreras = function () {
        var ruta = ip + '/APISolicitudes/carreras';
        var respuesta = ServicioHTTP.getAll(ruta);
        respuesta.then(function (response) {
            $scope.scpCarreras = response.data;
            $scope.CarreraId = $scope.scpCarreras[0];
        },
            function (error) {
                toastr.error('Ha ocurrido un error al cargar las carreras.');
                //$scope.generarAlertaEstado('incorrecto');
            });
    };


    ///---------------------------------------------Funciones auxiliares--------------------------------------///

    $scope.limpiarInputs = function () {
        $scope.solicitud = {
            Cedula: null, Telefono: null, Apellido1: null, Apellido2: null, Nombre: null, Email: null, PonderadoAnterior: null, PonderadoGeneral: null,
            IdBanco: '1', NumeroCuenta: null, CumpleRequisitos: 'false', OtraBeca: null, OtraHoras: null, OtraEscuela: null, CreditosAprobadosAnterior: null,
            CreditosAprobadosTotal: null, CreditosSemestreActual: null, CursosPendientes: null, AnosActivoTec: null, Horas: '1',
            Codigo: null, NombreCurso: null, Nota: null, NombreResponsable: null
        }; 
        document.getElementById('viewCedula').src = ''; document.getElementById('ImaTextCedula').value = '';
        document.getElementById('viewPondeAnterior').src = ''; document.getElementById('ImaTextPondeAnterior').value = '';
        document.getElementById('viewPondeGeneral').src = ''; document.getElementById('ImaTextPondeGeneral').value = '';
        document.getElementById('viewCreditosAnt').src = ''; document.getElementById('ImaTextCreditosAnt').value = '';
        document.getElementById('viewCreditosTEC').src = ''; document.getElementById('ImaTextCreditosTEC').value = '';
        document.getElementById('viewNotaCurso').src = ''; document.getElementById('ImaTextNotaCurso').value = '';
        document.getElementById('viewCuenta').src = ''; document.getElementById('ImaTextCuenta').value = '';
};
    $scope.limpiarInputs();
});
///################################### Controlador Formularios y Modals #########################################################