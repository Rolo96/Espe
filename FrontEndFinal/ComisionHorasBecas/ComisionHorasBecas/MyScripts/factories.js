app.factory('authFact', ["$cookieStore", function ($cookieStore) {
    var authFact = {};
    /*get y set de Cookie empleado*/
    authFact.setSemestre = function (semestre) {
        $cookieStore.put('semestre', semestre);
    };
    authFact.getSemestre = function () {
        authFact.authSemestre = $cookieStore.get('semestre');
        return authFact.authSemestre;
    };
    authFact.setTiposBeca = function (tb) {
        $cookieStore.put('becas', tb);
    };
    authFact.getTiposBeca = function () {
        authFact.authTb = $cookieStore.get('becas');
        return authFact.authTb;
    };
    authFact.setCarne = function (carne) {
        $cookieStore.put('carne', carne);
    };
    authFact.getCarne = function () {
        authFact.authCarne = $cookieStore.get('carne');
        return authFact.authCarne;
    };
    authFact.setUsuario = function (usuario) {
        $cookieStore.put('usuario', usuario);
    };
    authFact.getUsuario = function () {
        authFact.authUsuario = $cookieStore.get('usuario');
        return authFact.authUsuario;
    };

    return authFact;
}]);