using APISolicitudes.Models;
using System;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace APISolicitudes.Controllers
{
    /// <summary>
    /// Controlador que recibe todas las peticiones del API (relacionadas a las solicitudes)
    /// </summary>
    public class SolicitudesController : ApiController
    {

        //------------------------------------Metodos de obtener informacion para las solicitudes -----------------------------------
        /// <summary>
        /// Obtiene todos los periodos que NO han cerrado
        /// </summary>
        /// <returns>lista con la informacion de todos los periodos(FechaApertura, FechaCierre, Id, becas[AbreviaturaBeca])</returns>
        [HttpGet]
        [Route("periodos")]
        public HttpResponseMessage VerPeriodos(){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        DateTime actual = DateTime.Now;
                        var periodos = (from p in entities.PERIODO
                            where DateTime.Compare(actual,p.FechaCierre)<0//Solo las solicitudes que no han cerrado
                            select new{
                                p.FechaApertura,
                                p.FechaCierre,
                                p.Id,
                                becas = (from bp in entities.BECAXPERIODO
                                    where bp.IdPeriodo == p.Id
                                    select new{bp.AbreviaturaBeca}
                                ).ToList()
                            }).OrderBy((x) => x.FechaApertura).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, periodos);
                    }catch (DataException) {return Request.CreateResponse(HttpStatusCode.Conflict);}
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene los tipos de beca de los que hay periodos de recepcion abiertos
        /// </summary>
        /// <returns>lista con los tipos de beca de los que hay periodos de recepcion abiertos</returns>
        [HttpGet]
        [Route("tiposBecaHabilitados")]
        public HttpResponseMessage tiposBecaHabilitados(){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        DateTime actual = DateTime.Now;
                        var becas = (from p in entities.PERIODO
                            join bp in entities.BECAXPERIODO on p.Id equals bp.IdPeriodo
                            join b in entities.BECA on bp.AbreviaturaBeca equals b.Abreviatura
                            where DateTime.Compare(actual, p.FechaCierre) < 0
                            select new{
                                b.Tipo
                            }).Distinct().ToList();
                        return Request.CreateResponse(HttpStatusCode.OK,becas);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene una lista con todas las carreras
        /// </summary>
        /// <returns>lista con la informacion de las carreras (Id, Nombre)</returns>
        [HttpGet]
        [Route("carreras")]
        public HttpResponseMessage VerCarreras(){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var enviadas = (from c in entities.CARRERA
                            select new{
                                c.Id,
                                c.Nombre
                            }).OrderBy((x) => x.Id).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, enviadas);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene las solicitudes enviadas de un estudiante
        /// </summary>
        /// <param name="obj">objeto que trae como parametro opcionStr el carné del estudiante</param>
        /// <returns>lista con la informacion de las solicitudes enviadas del estudiante 
        /// (Id, Tipo, AbreviaturaBeca, FechaAlmacenamiento, Estado:NombreDel estado, IdEstado)</returns>
        [HttpPost]
        [Route("enviadas")]
        public HttpResponseMessage VerEnviadas(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var enviadas = (from s in entities.SOLICITUD
                            join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                            join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                            where obj.opcionStr==s.Carne && (s.Estado==1 || s.Estado == 3 || s.Estado == 4)
                            select new{
                                s.Id,
                                b.Tipo,
                                s.AbreviaturaBeca,
                                s.FechaAlmacenamiento,
                                Estado = e.Nombre,
                                Cancelada = s.Estado,
                                s.IdEstado
                            }).OrderBy((x) => x.FechaAlmacenamiento).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK,enviadas);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene las solicitudes guardadas de un estudiante
        /// </summary>
        /// <param name="obj">objeto que trae como parametro opcionStr el carné del estudiante</param>
        /// <returns>lista con la informacion de las solicitudes enviadas del estudiante 
        /// (Id, Tipo, AbreviaturaBeca, FechaAlmacenamiento)</returns>
        [HttpPost]
        [Route("guardadas")]
        public HttpResponseMessage VerGuardadas(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var guardadas = (from s in entities.SOLICITUD
                            join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                            where obj.opcionStr == s.Carne && s.Estado==0
                            select new{
                                s.Id,
                                b.Tipo,
                                s.AbreviaturaBeca,
                                s.FechaAlmacenamiento
                            }).OrderBy((x) => x.FechaAlmacenamiento).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, guardadas);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        //--------------------------------------------Solicitudes Horas estudiante ----------------------------------------------------

        /// <summary>
        /// Obtiene toda la informacion de una solicitud de horas beca del tipo horas estudiante
        /// </summary>
        /// <param name="obj">Objeto que trae en opcionInt el id de la solicitud a obtener la informacion</param>
        /// <returns>Objeto con la informacion de la solicitud</returns>
        [HttpPost]
        [Route("verSolicitudHE")]
        public HttpResponseMessage VerSolicitudHE(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var solicitud = (from s in entities.SOLICITUD.AsEnumerable()
                            where obj.opcionInt == s.Id
                            select new{
                                s.Id,
                                s.Cedula,
                                s.Carne,
                                s.Telefono,
                                s.Apellido1,
                                s.Apellido2,
                                Carrera = s.IdCarrera,
                                s.Nombre,
                                s.Email,
                                s.PonderadoGeneral,
                                s.PonderadoAnterior,
                                s.IdBanco,
                                s.NumeroCuenta,
                                s.CumpleRequisitos,
                                imagenCedula= Convert.ToBase64String(s.ScreenShotCedula),
                                imagenCuenta = Convert.ToBase64String(s.ScreenShotCuentaBanco),
                                imagenPromedioAnterior = Convert.ToBase64String(s.ScreenShotPonderadoAnterior),
                                imagenPromedioGeneral = Convert.ToBase64String(s.ScreenShotPonderadoGeneral),
                                imagenCreditosAnterior = Convert.ToBase64String(s.ScreenShotCreditosAprobadosAnterior),
                                imagenCreditosTec = Convert.ToBase64String(s.ScreenShotCreditosAprobadosTotal),
                                s.OtraEscuela,
                                s.OtraHoras,
                                s.OtraBeca,
                                s.IdEstado,
                                Cancelada = s.Estado,
                                s.AbreviaturaBeca,
                                s.CreditosAprobadosAnterior,
                                s.CreditosAprobadosTotal,
                                s.AnosActivoTec,
                                s.CreditosSemestreActual,
                                s.CursosPendientes,
                                ScreenshotNota = ""
                            }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK,solicitud);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Guarda una solicitud de tipo horas estudiante
        /// </summary>
        /// <param name="solicitud">objeto que trae toda la informacion a guardar</param>
        /// <returns>Ok si la logra guardar sino un mensaje de error</returns>
        [HttpPost]
        [Route("almacenarSolicitudHE")]
        public HttpResponseMessage AlmacenarSolicitudHE(SOLICITUD solicitud){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                try{
                    entities.almacenarSolicitudHE(solicitud.Cedula, solicitud.Carne, solicitud.Nombre, solicitud.Apellido1,
                        solicitud.Apellido2, solicitud.Email, solicitud.Telefono,solicitud.Estado, DateTime.Now,
                        solicitud.CumpleRequisitos, solicitud.OtraBeca, solicitud.OtraEscuela, solicitud.OtraHoras,
                        solicitud.PonderadoAnterior,solicitud.PonderadoGeneral, solicitud.CreditosAprobadosAnterior,
                        solicitud.CreditosAprobadosTotal, solicitud.CreditosSemestreActual, solicitud.CursosPendientes,
                        solicitud.AnosActivoTec, solicitud.NumeroCuenta, solicitud.ScreenShotCedula,
                        solicitud.ScreenShotPonderadoAnterior, solicitud.ScreenShotPonderadoGeneral,
                        solicitud.ScreenShotCreditosAprobadosAnterior, solicitud.ScreenShotCreditosAprobadosTotal,
                        solicitud.ScreenShotCuentaBanco, solicitud.IdBanco, solicitud.IdSemestre,solicitud.AbreviaturaBeca,
                        solicitud.IdCarrera);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
            }
        }

        /// <summary>
        /// Edita una solicitud de tipo horas estudiante
        /// </summary>
        /// <param name="solicitud">objeto que trae toda la informacion a editar</param>
        /// <returns>Ok si la logra editar sino un mensaje de error</returns>
        [HttpPost]
        [Route("editarSolicitudHE")]
        public HttpResponseMessage editarSolicitudHE(SOLICITUD solicitud){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                try{
                    entities.editarSolicitudHE(solicitud.Id, solicitud.Cedula, solicitud.Carne, solicitud.Nombre, solicitud.Apellido1,
                        solicitud.Apellido2, solicitud.Email, solicitud.Telefono,DateTime.Now, solicitud.CumpleRequisitos,
                        solicitud.OtraBeca, solicitud.OtraEscuela, solicitud.OtraHoras, solicitud.PonderadoAnterior,
                        solicitud.PonderadoGeneral, solicitud.CreditosAprobadosAnterior, solicitud.CreditosAprobadosTotal,
                        solicitud.CreditosSemestreActual, solicitud.CursosPendientes,solicitud.AnosActivoTec, solicitud.NumeroCuenta,
                        solicitud.ScreenShotCedula, solicitud.ScreenShotPonderadoAnterior, solicitud.ScreenShotPonderadoGeneral,
                        solicitud.ScreenShotCreditosAprobadosAnterior, solicitud.ScreenShotCreditosAprobadosTotal,
                        solicitud.ScreenShotCuentaBanco, solicitud.IdBanco, solicitud.IdSemestre,solicitud.IdCarrera);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
            }
        }

        /// <summary>
        /// Duplica una solicitud
        /// </summary>
        /// <param name="duplicado">objeto que trae el id de solicitud y el id del semestre actual</param>
        /// <returns>Ok si la duplica, error en caso contrario</returns>
        [HttpPost]
        [Route("duplicarSolicitud")]
        public HttpResponseMessage duplicararSolicitud(Duplicado duplicado){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                try{
                    entities.duplicar(duplicado.idSolicitud, duplicado.idSemestre, DateTime.Now, duplicado.beca);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
            }
        }

        //--------------------------------------------Solicitudes Horas asistente ---------------------------------------------------

        /// <summary>
        /// Obtiene toda la informacion de una solicitud de horas beca del tipo horas asistente
        /// </summary>
        /// <param name="obj">Objeto que trae en opcionInt el id de la solicitud a obtener la informacion</param>
        /// <returns>Objeto con la informacion de la solicitud</returns>
        [HttpPost]
        [Route("verSolicitudAE")]
        public HttpResponseMessage VerSolicitudAE(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var solicitud = (from s in entities.SOLICITUD.AsEnumerable()
                            join ae in entities.BECAAE on s.Id equals ae.Id
                            where obj.opcionInt == s.Id
                            select new{
                                Cancelada = s.Estado,
                                s.Id,
                                s.IdEstado,
                                s.Cedula,
                                s.Carne,
                                s.Telefono,
                                s.Apellido1,
                                s.Apellido2,
                                Carrera = s.IdCarrera,
                                s.Nombre,
                                s.Email,
                                s.PonderadoGeneral,
                                s.PonderadoAnterior,
                                s.IdBanco,
                                s.NumeroCuenta,
                                s.CumpleRequisitos,
                                imagenCedula = Convert.ToBase64String(s.ScreenShotCedula),
                                imagenCuenta = Convert.ToBase64String(s.ScreenShotCuentaBanco),
                                imagenPromedioAnterior = Convert.ToBase64String(s.ScreenShotPonderadoAnterior),
                                imagenPromedioGeneral = Convert.ToBase64String(s.ScreenShotPonderadoGeneral),
                                imagenCreditosAnterior = Convert.ToBase64String(s.ScreenShotCreditosAprobadosAnterior),
                                imagenCreditosTec = Convert.ToBase64String(s.ScreenShotCreditosAprobadosTotal),
                                s.OtraEscuela,
                                s.OtraHoras,
                                s.OtraBeca,
                                s.AbreviaturaBeca,
                                s.CreditosAprobadosAnterior,
                                s.CreditosAprobadosTotal,
                                s.AnosActivoTec,
                                s.CreditosSemestreActual,
                                s.CursosPendientes,
                                ae.Horas,
                                ScreenshotNota = ""
                            }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, solicitud);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Guarda una solicitud de tipo horas asistente
        /// </summary>
        /// <param name="solicitud">objeto que trae toda la informacion a guardar</param>
        /// <returns>Ok si la logra guardar sino un mensaje de error</returns>
        [HttpPost]
        [Route("almacenarSolicitudAE")]
        public HttpResponseMessage AlmacenarSolicitudAE(SolicitudCompleta solicitud){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                try{
                    entities.almacenarSolicitudAE(solicitud.Cedula, solicitud.Carne, solicitud.Nombre, solicitud.Apellido1,
                        solicitud.Apellido2, solicitud.Email, solicitud.Telefono,solicitud.Estado, DateTime.Now,
                        solicitud.CumpleRequisitos, solicitud.OtraBeca, solicitud.OtraEscuela, solicitud.OtraHoras,
                        solicitud.PonderadoAnterior,solicitud.PonderadoGeneral, solicitud.CreditosAprobadosAnterior,
                        solicitud.CreditosAprobadosTotal, solicitud.CreditosSemestreActual, solicitud.CursosPendientes,
                        solicitud.AnosActivoTec, solicitud.NumeroCuenta, solicitud.ScreenShotCedula,
                        solicitud.ScreenShotPonderadoAnterior, solicitud.ScreenShotPonderadoGeneral,
                        solicitud.ScreenShotCreditosAprobadosAnterior, solicitud.ScreenShotCreditosAprobadosTotal,
                        solicitud.ScreenShotCuentaBanco, solicitud.IdBanco, solicitud.IdSemestre,solicitud.AbreviaturaBeca,
                        solicitud.Horas, solicitud.IdCarrera);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
            }
        }

        /// <summary>
        /// Edita una solicitud de tipo horas asistente
        /// </summary>
        /// <param name="solicitud">objeto que trae toda la informacion a editar</param>
        /// <returns>Ok si la logra editar sino un mensaje de error</returns>
        [HttpPost]
        [Route("editarSolicitudAE")]
        public HttpResponseMessage editarSolicitudAE(SolicitudCompleta solicitud){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                try{
                    entities.editarSolicitudAE(solicitud.Id, solicitud.Cedula, solicitud.Carne, solicitud.Nombre, solicitud.Apellido1,
                        solicitud.Apellido2, solicitud.Email, solicitud.Telefono,DateTime.Now, solicitud.CumpleRequisitos,
                        solicitud.OtraBeca, solicitud.OtraEscuela, solicitud.OtraHoras, solicitud.PonderadoAnterior,
                        solicitud.PonderadoGeneral, solicitud.CreditosAprobadosAnterior, solicitud.CreditosAprobadosTotal,
                        solicitud.CreditosSemestreActual, solicitud.CursosPendientes,solicitud.AnosActivoTec, solicitud.NumeroCuenta,
                        solicitud.ScreenShotCedula, solicitud.ScreenShotPonderadoAnterior, solicitud.ScreenShotPonderadoGeneral,
                        solicitud.ScreenShotCreditosAprobadosAnterior, solicitud.ScreenShotCreditosAprobadosTotal,
                        solicitud.ScreenShotCuentaBanco, solicitud.IdBanco, solicitud.IdSemestre,solicitud.Horas, solicitud.IdCarrera);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
            }
        }

        //----------------------------------Solicitudes Horas tutoria y asistencia especial -----------------------------------------

        /// <summary>
        /// Obtiene toda la informacion de una solicitud de horas beca del tipo horas tutoria o asistencia especial
        /// </summary>
        /// <param name="obj">Objeto que trae en opcionInt el id de la solicitud a obtener la informacion</param>
        /// <returns>Objeto con la informacion de la solicitud</returns>
        [HttpPost]
        [Route("verSolicitudHATU")]
        public HttpResponseMessage VerSolicitudHATU(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var solicitud = (from s in entities.SOLICITUD.AsEnumerable()
                            join hatu in entities.BECAHATU on s.Id equals hatu.Id
                            where obj.opcionInt == s.Id
                            select new{
                                Cancelada = s.Estado,
                                s.Id,
                                s.IdEstado,
                                s.Cedula,
                                s.Carne,
                                s.Telefono,
                                s.Apellido1,
                                s.Apellido2,
                                Carrera = s.IdCarrera,
                                s.Nombre,
                                s.Email,
                                s.PonderadoGeneral,
                                s.PonderadoAnterior,
                                s.IdBanco,
                                s.NumeroCuenta,
                                s.CumpleRequisitos,
                                imagenCedula = Convert.ToBase64String(s.ScreenShotCedula),
                                imagenCuenta = Convert.ToBase64String(s.ScreenShotCuentaBanco),
                                imagenPromedioAnterior = Convert.ToBase64String(s.ScreenShotPonderadoAnterior),
                                imagenPromedioGeneral = Convert.ToBase64String(s.ScreenShotPonderadoGeneral),
                                imagenCreditosAnterior = Convert.ToBase64String(s.ScreenShotCreditosAprobadosAnterior),
                                imagenCreditosTec = Convert.ToBase64String(s.ScreenShotCreditosAprobadosTotal),
                                s.OtraEscuela,
                                s.OtraHoras,
                                s.OtraBeca,
                                s.AbreviaturaBeca,
                                s.CreditosAprobadosAnterior,
                                s.CreditosAprobadosTotal,
                                s.AnosActivoTec,
                                s.CreditosSemestreActual,
                                s.CursosPendientes,
                                NombreCurso = hatu.Nombre,
                                hatu.NombreResponsable,
                                hatu.Nota,
                                ScreenshotNota = hatu.ScreenShotNota,
                                hatu.Codigo
                            }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, solicitud);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Guarda una solicitud de tipo horas tutoria y asistencia especial
        /// </summary>
        /// <param name="solicitud">objeto que trae toda la informacion a guardar</param>
        /// <returns>Ok si la logra guardar sino un mensaje de error</returns>
        [HttpPost]
        [Route("almacenarSolicitudHATU")]
        public HttpResponseMessage AlmacenarSolicitudHATU(SolicitudCompleta solicitud){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                try{
                    entities.almacenarSolicitudHATU(solicitud.Cedula, solicitud.Carne, solicitud.Nombre, solicitud.Apellido1,
                        solicitud.Apellido2, solicitud.Email, solicitud.Telefono,solicitud.Estado, DateTime.Now,
                        solicitud.CumpleRequisitos, solicitud.OtraBeca, solicitud.OtraEscuela, solicitud.OtraHoras,
                        solicitud.PonderadoAnterior, solicitud.PonderadoGeneral, solicitud.CreditosAprobadosAnterior,
                        solicitud.CreditosAprobadosTotal, solicitud.CreditosSemestreActual, solicitud.CursosPendientes,
                        solicitud.AnosActivoTec, solicitud.NumeroCuenta, solicitud.ScreenShotCedula,
                        solicitud.ScreenShotPonderadoAnterior, solicitud.ScreenShotPonderadoGeneral,
                        solicitud.ScreenShotCreditosAprobadosAnterior, solicitud.ScreenShotCreditosAprobadosTotal,
                        solicitud.ScreenShotCuentaBanco, solicitud.ScreenshotNota, solicitud.IdBanco, solicitud.IdSemestre,
                        solicitud.AbreviaturaBeca, solicitud.Codigo, solicitud.NombreCurso, solicitud.Nota,
                        solicitud.NombreResponsable, solicitud.IdCarrera);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
            }
        }

        /// <summary>
        /// Edita una solicitud de tipo horas tutoria y asistencia especial
        /// </summary>
        /// <param name="solicitud">objeto que trae toda la informacion a editar</param>
        /// <returns>Ok si la logra editar sino un mensaje de error</returns>
        [HttpPost]
        [Route("editarSolicitudHATU")]
        public HttpResponseMessage editarSolicitudHATU(SolicitudCompleta solicitud){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                try{
                    entities.editarSolicitudHATU(solicitud.Id, solicitud.Cedula, solicitud.Carne, solicitud.Nombre,
                        solicitud.Apellido1, solicitud.Apellido2, solicitud.Email, solicitud.Telefono,DateTime.Now,
                        solicitud.CumpleRequisitos, solicitud.OtraBeca, solicitud.OtraEscuela, solicitud.OtraHoras,
                        solicitud.PonderadoAnterior,solicitud.PonderadoGeneral, solicitud.CreditosAprobadosAnterior,
                        solicitud.CreditosAprobadosTotal, solicitud.CreditosSemestreActual, solicitud.CursosPendientes,
                        solicitud.AnosActivoTec, solicitud.NumeroCuenta, solicitud.ScreenShotCedula,
                        solicitud.ScreenShotPonderadoAnterior, solicitud.ScreenShotPonderadoGeneral,
                        solicitud.ScreenShotCreditosAprobadosAnterior, solicitud.ScreenShotCreditosAprobadosTotal,
                        solicitud.ScreenShotCuentaBanco, solicitud.ScreenshotNota, solicitud.IdBanco, solicitud.IdSemestre,
                        solicitud.Codigo, solicitud.NombreCurso, solicitud.Nota, solicitud.NombreResponsable, solicitud.IdCarrera);
                    return Request.CreateResponse(HttpStatusCode.OK);
                }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
            }
        }

        //------------------------------------Otras acciones sobre las solicitudes---------------------------------------------------

        /// <summary>
        /// Metodo para cancelar una solicitud que no ha sido revisada
        /// </summary>
        /// <param name="obj">objeto que trae en opcionInt el id de la solicitud a cancelar</param>
        /// <returns>Ok si la cancela, error en caso contrario</returns>
        [HttpPost]
        [Route("cancelarEnviadaTiempo")]
        public HttpResponseMessage CancelarEnviadaTiempo(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        entities.cambiarIdEstado(obj.opcionInt,6);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Metodo para borrar una solicitud que esta guardada(No enviada)
        /// </summary>
        /// <param name="obj">objeto que trae en opcionInt el id de la solicitud a borrar</param>
        /// <returns>Ok si la borra, error en caso contrario</returns>
        [HttpPost]
        [Route("borrarSolicitud")]
        public HttpResponseMessage borrarSolicitud(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        entities.cambiarEstado(obj.opcionInt,2);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Cambia una solicitud de guardada a enviada
        /// </summary>
        /// <param name="obj">objeto que trae en opcionInt el id de la solcitud a enviar</param>
        /// <returns>Ok si la envía, error en caso contrario</returns>
        [HttpPost]
        [Route("EnviarSolicitud")]
        public HttpResponseMessage enviarSolicitud(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        entities.enviarSolicitudGuardada(obj.opcionInt, 1, DateTime.Now);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        //----------------------------------Acciones de las solicitudes para la comision---------------------------------------------

        /// <summary>
        /// Metodo que muestra a la vista de comision las solicitudes, basado en el filtro que se tiene
        /// </summary>
        /// <param name="obj">objeto que trae en opcionInt el id del semestre, en opcionInt2 el id del estado y 
        /// en opcionStr la abreviatura del tipo de beca</param>
        /// <returns>lista con la informacion de las solicitudes</returns>
        [HttpPost]
        [Route("solicitudesComision")]
        public HttpResponseMessage solicitudesComision(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        if (obj.opcionStr == "T" && obj.opcionInt2 == 0) {
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where (s.IdEstado == 1 || s.IdEstado == 3 || s.IdEstado == 4 || s.IdEstado == 5 || s.IdEstado == 6) && (s.Estado==1 || s.Estado==3 || s.Estado == 4) &&
                                s.IdSemestre == obj.opcionInt
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    s.IdEstado,
                                    Estado = e.Nombre,
                                    b.Tipo,
                                    Cancelada = s.Estado,
                                    Beca = s.AbreviaturaBeca
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }else if (obj.opcionStr == "T"){
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where s.IdEstado == obj.opcionInt2  && s.IdSemestre == obj.opcionInt
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    Estado = e.Nombre,
                                    b.Tipo
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }else if (obj.opcionInt2 == 0){
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where (s.IdEstado == 1 || s.IdEstado == 3 || s.IdEstado == 4 || s.IdEstado == 5) &&
                                s.IdSemestre == obj.opcionInt && s.AbreviaturaBeca==obj.opcionStr
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    Estado = e.Nombre,
                                    b.Tipo
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }else{
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where s.IdEstado == obj.opcionInt2 && s.IdSemestre == obj.opcionInt &&
                                s.AbreviaturaBeca == obj.opcionStr
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    Estado = e.Nombre,
                                    b.Tipo
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene lista de los usuarios
        /// </summary>
        /// <returns>lista con la informacion de los usuarios
        /// (primer_nombre,primer_apellido,segundo_apellido,.correo_electronico)</returns>
        [HttpGet]
        [Route("verEncargados")]
        public HttpResponseMessage verHistorialEstudiante(){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var encargados = (from u in entities.usuario
                            select new{
                                u.primer_nombre,
                                u.primer_apellido,
                                u.segundo_apellido,
                                u.correo_electronico,
                                u.id
                            }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, encargados);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene la informacion del historial del estudiante
        /// </summary>
        /// <param name="obj">objeto que trae en opcionStr el Carné del estudiante a buscar la informacion</param>
        /// <returns>lista con el historial del estudiante</returns>
        [HttpPost]
        [Route("verHistorialEstudiante")]
        public HttpResponseMessage verHistorialEstudiante(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        var historial = (from e in entities.EVALUACION
                            join s in entities.SOLICITUD on e.IdSolicitud equals s.Id
                            join se in entities.SEMESTRE on s.IdSemestre equals se.Id
                            join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                            where e.IdEstudiante == obj.opcionStr
                            select new{
                                semestre = se.Semestre1,
                                ano = se.Ano,
                                observaciones = e.Observacion,
                                tipoBeca = b.Tipo
                            }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, historial);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Rechaza una solicitud o la pone como pendiente (Por la comision)
        /// </summary>
        /// <param name="obj">Objeto que trae en opcionInt el id de la solicitud, en opcionInt2 el estado de la solicitud y
        /// en opcionStr las observaciones</param>
        /// <returns></returns>
        [HttpPost]
        [Route("rechazarSolicitud")]
        public HttpResponseMessage rechazarSolicitud(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        entities.rechazarSolicitud(obj.opcionInt, obj.opcionInt2, obj.opcionStr);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// solicita cancelar una solicitud ya revisada (estudiante)
        /// </summary>
        /// <param name="obj">Objeto que trae en opcionInt el id de la solicitud, en opcionInt2 el estado de la solicitud y
        /// en opcionStr las observaciones</param>
        /// <returns></returns>
        [HttpPost]
        [Route("cancelarSolicitudRev")]
        public HttpResponseMessage cancelarSolicitudRev(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.cancelarSolicitudRevisada(obj.opcionInt, obj.opcionInt2, obj.opcionStr);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Aprueba una solicitud (Por la comision)
        /// </summary>
        /// <param name="obj">Objeto que trae en opcionInt el id de la solicitud, en opcionStr el carne del estudiante de la solicitud,
        /// en opcionStr2 el correo del responsable del estudiante, en opcionStr3 las observaciones, en opcionInt2 las horas asignadas y
        /// en opcionInt3 el estado de la solicitud</param>
        /// <returns></returns>
        [HttpPost]
        [Route("aprobarSolicitud")]
        public HttpResponseMessage aprobarSolicitud(objGeneral2 obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        entities.aprobarSolicitud(obj.opcionInt, obj.opcionStr, obj.opcionInt4, obj.opcionStr3, obj.opcionInt2, obj.opcionInt3);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        
        [HttpPost]
        [Route("verObservaciones")]
        public HttpResponseMessage verObservaciones(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var observaciones = (from s in entities.SOLICITUD
                                             where s.Id == obj.opcionInt
                                             select new
                                        {
                                            s.ObservacionesEvaluación
                                        }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, observaciones);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        //----------------------------------Acciones de las solicitudes para el administrador----------------------------------------

        /// <summary>
        /// Metodo para ver las solicitudes en la vista del administrador, basado en el filtro
        /// </summary>
        /// <param name="obj">objeto que trae en opcionInt el id del semestre, en opcionInt2 el id del estado y 
        /// en opcionStr la abreviatura del tipo de beca</param>
        /// <returns>lista con la informacion de las solicitudes</returns>
        [HttpPost]
        [Route("solicitudesAdmin")]
        public HttpResponseMessage solicitudesAdmin(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        if (obj.opcionStr == "T" && obj.opcionInt2 == 0){
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where (s.IdEstado == 1 || s.IdEstado == 2 || s.IdEstado == 7) && s.IdSemestre == obj.opcionInt
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    Estado = e.Nombre,
                                    s.IdEstado,
                                    b.Tipo,
                                    Beca = s.AbreviaturaBeca
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }else if (obj.opcionStr == "T"){
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where s.IdEstado == obj.opcionInt2 && s.IdSemestre == obj.opcionInt
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    Estado = e.Nombre,
                                    b.Tipo
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }else if (obj.opcionInt2 == 0){
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where (s.IdEstado == 1 || s.IdEstado == 2 || s.IdEstado == 7) && s.IdSemestre == obj.opcionInt &&
                                s.AbreviaturaBeca == obj.opcionStr
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    Estado = e.Nombre,
                                    b.Tipo
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }else{
                            var solicitudes = (from s in entities.SOLICITUD
                                join c in entities.CARRERA on s.IdCarrera equals c.Id
                                join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                join e in entities.ESTADOSOLICITUD on s.IdEstado equals e.Id
                                where s.IdEstado == obj.opcionInt2 && s.IdSemestre == obj.opcionInt &&
                                s.AbreviaturaBeca == obj.opcionStr
                                select new{
                                    s.Id,
                                    s.Nombre,
                                    s.Apellido1,
                                    s.Apellido2,
                                    Carrera = c.Nombre,
                                    s.PonderadoGeneral,
                                    s.Carne,
                                    s.NumeroCuenta,
                                    Estado = e.Nombre,
                                    b.Tipo
                                }).OrderBy((x) => x.Id).ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, solicitudes);
                        }
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Metodo para cambiar el estado de las solicitudes(revisar por el administrador)
        /// </summary>
        /// <param name="obj">objeto que trae eb opcionInt el id de la solicitud y en opcionInt2 el estado de la solicitud</param>
        /// <returns>Ok si cambia el estado, error en caso contrario</returns>
        [HttpPost]
        [Route("cambiarIdEstado")]
        public HttpResponseMessage CambiarIdEstado(objGeneral obj){
            using (HorasBecaEntities entities = new HorasBecaEntities()){
                if (ModelState.IsValid){
                    try{
                        entities.cambiarIdEstado(obj.opcionInt, obj.opcionInt2);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Rechaza la cancelacion de una solicitud
        /// </summary>
        /// <param name="obj">objeto con el id de la solicitud</param>
        /// <returns>ok si se ejecuta correctamente</returns>
        [HttpPost]
        [Route("rechazarCancelacion")]
        public HttpResponseMessage rechazarCancelacion(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.cambiarEstado(obj.opcionInt, 4);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Inserta una transaccion
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("insertarTransaccion")]
        public HttpResponseMessage insertarTransaccion(transaccion obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.insertarTransaccion(obj.opcionInt,DateTime.Now,obj.opcionInt2, obj.opcionInt3);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Consulta el correo de un estudiante
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("consultarCorreo")]
        public HttpResponseMessage consultarCorreo(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var solicitud = (from e in entities.estudiantes.AsEnumerable()
                                         where obj.opcionStr == e.carne
                                         select new
                                         {
                                             e.correo_electronico
                                         }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK,solicitud);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }
    }
}