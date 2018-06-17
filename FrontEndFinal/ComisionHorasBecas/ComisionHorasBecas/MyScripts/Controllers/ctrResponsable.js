/**
 *Controlador de la pagina de responsable 
*/
app.controller('responsableController', function ($scope, ServicioHTTP, authFact) {

    /**
     * Obtiene los estudiantes de un profesor
     */
    $scope.obtenerEstudiantes = function () {
        var idProfe = { opcionInt2: authFact.getUsuario().id, opcionInt: 1 };
        var ruta = ip + '/APIRetroAlimentacion/solicitarEstudiantes';
        toastr.clear($('.toast-loading')); toastr.loading('Cargando estudiantes');
        var respuesta = ServicioHTTP.post(ruta, idProfe);
        respuesta.then(function (response) {
            toastr.clear($('.toast-loading'));
            $scope.estudiantes = response.data;
            console.log(response.data);
        },
            function (error) {
                toastr.clear($('.toast-loading'));
                toastr.error('Ha ocurrido un error al obtener los estudiantes a evaluar');
            });
    };

    /**
     * Abre el formulario para evaluar a un estudiante
     * @param {any} pEstudiante info del estudiante
     */
    $scope.abrirFormEvaluacion = function (pEstudiante) {
        $scope.estudiante = pEstudiante;
        if ($scope.estudiante.Evaluacion === null) {
            $scope.botonEvaluar = true;
            $scope.botonActualEval = false;
            $scope.estudiante.Evaluacion = { Observaciones: '', HorasLaboradas: 0, Recomendado: 'false' };
        }
        else {
            $scope.estudiante.Evaluacion.Recomendado = $scope.estudiante.Evaluacion.Recomendado.toString();
            $scope.botonEvaluar = false;
            $scope.botonActualEval = true;
        }
        $('#EvaluacionModal').modal();
    };

    /**
     * Realiza la evaluacion de un estudiante
     */
    $scope.evaluarEstudiante = function () {
        var evaluacion = {
            IdResponsable: authFact.getUsuario().id,
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

    /**
     * guarda los cambios realizados a un estudiante ya evaluado
     */
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

    //obtiene la informacion de la pagina
    $scope.obtenerEstudiantes();
    $scope.iniciarTooltip();
    $scope.usuario = authFact.getUsuario();
});