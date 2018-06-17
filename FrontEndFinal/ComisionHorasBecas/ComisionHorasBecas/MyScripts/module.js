var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'ngCookies']);

//Ruteador, (relaciona direccion con html y controlador)
app.config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'Templates/LoginAdmin.html',
        controller: 'LoginController'
    })
        .when('/login', {
            templateUrl: 'Templates/Login.html',
            controller: 'LoginEstController'
        })
        .when('/comision', {
            templateUrl: 'Templates/VistaComision.html',
            controller: 'ComisionController'
        })
        .when('/admin', {
            templateUrl: 'Templates/VistaAdminSolicitudes.html',
            controller: 'AdminSolicitudesController'
        })
        .when("/adminReportes", {
            templateUrl: "Templates/AdminReportes.html",
            controller: "AdminReportesController"
        })
        //redirecciona a la vista de configuracion 
        .when("/adminPeriodosRecepcion", {
            templateUrl: "Templates/AdminPeriodos.html",
            controller: "AdminPeriodosController"
        })
        .when("/reporteTec", {
            templateUrl: "Templates/ReporteTec.html",
            controller: "ReporteTecController"
        })
        .when("/estPeriodos", {
            templateUrl: "Templates/EstudPeriodos.html",
            controller: "EstPeriodosController"
        })
        .when("/estSolEnv", {
            templateUrl: "Templates/EstSolicitudesEnviadas.html",
            controller: "EstSolicitudesController"
        })
        .when("/estSolGuard", {
            templateUrl: "Templates/EstSolicitudesGuardadas.html",
            controller: "EstSolicitudesGuardController"
        })
        .when("/adminRegistrarUsuario", {
            templateUrl: "Templates/AdminRegistrarUsuario.html",
            controller: "AdminRegistrarUsuarioController"
        })
        .when('/Responsable', {
            templateUrl: 'Templates/Responsable.html',
            controller: 'responsableController'
        });
    

    $locationProvider.hashPrefix('!');

    toastr.options = {
        "closeButton": true,
        "newestOnTop": true,
        "positionClass": "toast-bottom-right",
        "showDuration": 0,
        "hideDuration": 0,
        "preventDuplicates": true,
        "timeOut": 5000,
        "extendedTimeOut": 3000,
        "showEasing": "swing",
        "hideEasing": "swing",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

});