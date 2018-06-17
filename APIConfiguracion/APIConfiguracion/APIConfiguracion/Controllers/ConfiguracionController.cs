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
                        entities.insertarSemestre(semestre.Semestre1, semestre.Ano, semestre.FechaInicio, semestre.FechaCierre);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

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