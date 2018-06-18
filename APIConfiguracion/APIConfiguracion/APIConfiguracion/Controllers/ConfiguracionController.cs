using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using APIConfiguracion.Models;
using System.Linq;
using System;

namespace APIConfiguracion.Controllers
{
    public class ConfiguracionController : ApiController
    {

        /// <summary>
        /// Inserta un nuevo semestre
        /// </summary>
        /// <param name="semestre">informacion del semestre</param>
        /// <returns>ok si lo agrega</returns>
        [HttpPost]
        [Route("agregarSemestre")]
        public HttpResponseMessage AgregarSemestre(SEMESTRE semestre)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.insertarSemestre(semestre.Semestre1, semestre.FechaInicio.Year, semestre.FechaInicio, semestre.FechaCierre);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Edita la informacion de un semestre (Fechas)
        /// </summary>
        /// <param name="semestre">informacion a editar</param>
        /// <returns>ok si lo edita</returns>
        [HttpPost]
        [Route("editarSemestre")]
        public HttpResponseMessage EditarSemestre(SEMESTRE semestre)
        {            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.editarSemestre(semestre.Id, semestre.FechaInicioEvaluacion, semestre.FechaCierreEvaluacion, semestre.FechaTrabajoSocial);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Edita la informacion de un periodo
        /// </summary>
        /// <param name="periodo">informacion a editar</param>
        /// <returns>ok si lo edita</returns>
        [HttpPost]
        [Route("editarPeriodo")]
        public HttpResponseMessage EditarPeriodo(PeriodoCompleto periodo)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.editarPeriodo(periodo.Id, periodo.FechaApertura, periodo.FechaCierre, "[]");
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Solicita todos los roles de la bd
        /// </summary>
        /// <returns>lista de roles</returns>
        [HttpGet]
        [Route("roles")]
        public HttpResponseMessage VerRoles()
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var roles = (from r in entities.rol
                                        where r.sistema==2
                                        select new
                                        {
                                            r.id_rol,
                                            r.nombre
                                        }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, roles);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene la informacion de un semestre
        /// </summary>
        /// <param name="obj">objeto con el id del semestre</param>
        /// <returns>informacion del semestre</returns>
        [HttpPost]
        [Route("verFechasSemestre")]
        public HttpResponseMessage VerFechasSemestre(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var fechas = (from s in entities.SEMESTRE
                                     where s.Id == obj.opcionInt
                                     select new
                                     {
                                         s.FechaInicioEvaluacion,
                                         s.FechaCierreEvaluacion,
                                         s.FechaTrabajoSocial
                                     }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, fechas);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene la informacion de un periodo
        /// </summary>
        /// <param name="obj">objeto que trae el id del periodo</param>
        /// <returns>Informacion del periodo</returns>
        [HttpPost]
        [Route("verPeriodo")]
        public HttpResponseMessage VerPeriodo(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var periodo = (from p in entities.PERIODO
                                      where p.Id == obj.opcionInt
                                      select new
                                      {
                                          p.FechaApertura,
                                          p.FechaCierre,
                                          Becas = (from bp in entities.BECAXPERIODO
                                                   where bp.IdPeriodo == obj.opcionInt
                                                   select new
                                                   {
                                                       bp.AbreviaturaBeca,
                                                       bp.Horas
                                                   }).ToList()
                                      }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, periodo);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Verifica si hay un semestre en curso
        /// </summary>
        /// <returns>informacion del semestre en curso</returns>
        [HttpGet]
        [Route("haySemestre")]
        public HttpResponseMessage HaySemestre()
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        DateTime actual = DateTime.Now;
                        var semestre = (from s in entities.SEMESTRE
                                        where DateTime.Compare(actual, s.FechaCierre) <= 0 && DateTime.Compare(actual, s.FechaInicio) >= 0
                                        select new
                                        {
                                            s.Id
                                        }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, semestre);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene todos los usuarios del sistema
        /// </summary>
        /// <returns>lista de usuarios</returns>
        [HttpGet]
        [Route("usuarios")]
        public HttpResponseMessage usuarios()
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var usuarios = (from u in entities.usuario
                                        select new
                                        {
                                            u.primer_nombre,
                                            u.segundo_nombre,
                                            u.primer_apellido,
                                            u.segundo_apellido,
                                            u.cedula,
                                            u.correo_electronico
                                        }).OrderBy((x) => x.primer_nombre).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, usuarios);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene todos los peridos de un semestre
        /// </summary>
        /// <param name="obj">objeto que trae el id del semestre</param>
        /// <returns>lista de periodos</returns>
        [HttpPost]
        [Route("verPeriodos")]
        public HttpResponseMessage VerPeriodos(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        DateTime actual = DateTime.Now;
                        var periodos = (from p in entities.PERIODO
                                        where p.IdSemestre == obj.opcionInt
                                        select new
                                        {
                                            p.FechaApertura,
                                            p.FechaCierre,
                                            p.Id,
                                            becas = (from bp in entities.BECAXPERIODO
                                                     where bp.IdPeriodo == p.Id
                                                     select new
                                                     {
                                                         bp.AbreviaturaBeca
                                                     }).ToList()
                                        }).OrderBy((x) => x.FechaApertura).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, periodos);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// inserta un nuevo periodo
        /// </summary>
        /// <param name="periodo">informacion del periodo a agregar</param>
        /// <returns>ok si lo agrega</returns>
        [HttpPost]
        [Route("agregarPeriodo")]
        public HttpResponseMessage AgregarPeriodo(PeriodoCompleto periodo)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.insertarPeriodo(periodo.FechaApertura, periodo.FechaCierre, periodo.IdAdministrador, periodo.IdSemestre, periodo.Becas);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Obtiene los tipos de beca habilitados por los periodos abiertos
        /// </summary>
        /// <returns>lista de tipos de beca hablitados</returns>
        [HttpGet]
        [Route("semestreBecas")]
        public HttpResponseMessage SemestreBecas()
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        DateTime actual = DateTime.Now;
                        var semestre = (from s in entities.SEMESTRE
                                        where DateTime.Compare(actual, s.FechaCierre) <= 0 && DateTime.Compare(actual, s.FechaInicio) >= 0
                                        select new
                                        {
                                            s.Id,
                                            becas = (from p in entities.PERIODO
                                                     join bp in entities.BECAXPERIODO on p.Id equals bp.IdPeriodo
                                                     join b in entities.BECA on bp.AbreviaturaBeca equals b.Abreviatura
                                                     where p.IdSemestre == s.Id
                                                     select new
                                                     {
                                                         bp.AbreviaturaBeca,
                                                         b.Tipo
                                                     }).Distinct().ToList()
                                        }).FirstOrDefault();
                        return Request.CreateResponse(HttpStatusCode.OK, semestre);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

    }
}