using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using APIReportes.Models;

namespace APIReportes.Controllers
{
    public class ReportesController : ApiController
    {

        /// <summary>
        /// Genera el reporte para el sistema del tec
        /// </summary>
        /// <param name="obj">objeto que trae el id del semestre en opcionInt</param>
        /// <returns>Informacion del reporte</returns>
        [HttpPost]
        [Route("reporteTec")]
        public HttpResponseMessage ReporteTec(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var reporte = (from s in entities.SOLICITUD
                                       join rxe in entities.RESPONSABLEXESTUDIANTE on s.Id equals rxe.IdSolicitud
                                       join u in entities.usuario on rxe.IdResponsable equals u.id
                                       join b in entities.BANCO on s.IdBanco equals b.Id
                                       where s.IdSemestre == obj.opcionInt && s.IdEstado==4
                                        select new
                                        {
                                            s.Carne,
                                            s.Nombre,
                                            s.Apellido1,
                                            s.Apellido2,
                                            s.HorasAsignadas,
                                            s.AbreviaturaBeca,
                                            s.NumeroCuenta,
                                            Banco = b.Nombre,
                                            NombreR = u.primer_nombre,
                                            Apellido1R = u.primer_apellido,
                                            Apellido2R = u.segundo_apellido
                                        }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, reporte);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Genera el reporte para trabajo social
        /// </summary>
        /// <param name="obj">objeto que trae el id del semestre en opcionInt</param>
        /// <returns>informacion del reporte</returns>
        [HttpPost]
        [Route("reporteTS")]
        public HttpResponseMessage ReporteTS(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var reporte = (from s in entities.SOLICITUD
                                       join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                       where s.IdSemestre == obj.opcionInt && s.IdEstado == 4
                                       select new
                                       {
                                           s.Carne,
                                           s.Nombre,
                                           s.Apellido1,
                                           s.Apellido2,
                                           s.HorasAsignadas,
                                           Promedio = s.PonderadoGeneral,
                                           TipoBeca = b.Tipo,
                                           HorasRealizadas = (from ev in entities.EVALUACION
                                                                where s.Id == ev.IdSolicitud
                                                                select new { ev.HorasLaboradas }).FirstOrDefault()
                                       }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, reporte);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Genera el reporte de auditoria
        /// </summary>
        /// <param name="obj">objeto que trae el id del semestre en opcionInt</param>
        /// <returns>informacion del reporte</returns>
        [HttpPost]
        [Route("reporteAuditoria")]
        public HttpResponseMessage ReporteAuditoria(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var reporte = (from s in entities.SOLICITUD
                                       join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                       join es in entities.ESTADOSOLICITUD on s.IdEstado equals es.Id
                                       where s.IdSemestre == obj.opcionInt
                                       select new
                                       {
                                           s.Carne,
                                           s.Nombre,
                                           s.Apellido1,
                                           s.Apellido2,
                                           Estado = es.Nombre,
                                           TipoBeca = b.Tipo,
                                       }).OrderBy((x) => x.TipoBeca).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, reporte);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Genera la certificacion de horas
        /// </summary>
        /// <param name="obj">objeto que trae el id del estudiante en opcionStr</param>
        /// <returns>informacion del reporte</returns>
        [HttpPost]
        [Route("certificacionHoras")]
        public HttpResponseMessage certificacionHoras(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var reporte = (from ev in entities.EVALUACION
                                       join s in entities.SOLICITUD on ev.IdSolicitud equals s.Id
                                       join b in entities.BECA on s.AbreviaturaBeca equals b.Abreviatura
                                       join se in entities.SEMESTRE on s.IdSemestre equals se.Id
                                       where ev.IdEstudiante==obj.opcionStr
                                       select new
                                       {
                                           se.Ano,
                                           se.Semestre1,
                                           TipoBeca = b.Tipo,
                                           s.Carne,
                                           ev.HorasLaboradas,
                                           ev.Observacion
                                       }).OrderBy((x) => x.Ano).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK, reporte);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }
    }
}
