﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using APIRetroalimentacion.Models;

namespace APIRetroalimentacion.Controllers
{
    public class RetroalimentacionController : ApiController
    {
        /// <summary>
        /// Solicita los estudaintes de un responsable
        /// </summary>
        /// <param name="obj">Objeto que lleva en opcionInt el semestre y en opcionInt2 el id del responsable</param>
        /// <returns>lista de estudiantes</returns>
        [HttpPost]
        [Route("solicitarEstudiantes")]
        public HttpResponseMessage solicitarEstudiantes(objGeneral obj)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        var estudiantes = (from rxe in entities.RESPONSABLEXESTUDIANTE 
                            join e in entities.estudiantes on rxe.IdEstudiante equals e.carne
                            join s in entities.SOLICITUD on rxe.IdSolicitud equals s.Id
                            join se in entities.SEMESTRE on s.IdSemestre equals se.Id
                            where rxe.IdResponsable == obj.opcionInt2 && se.Id==obj.opcionInt
                            select new
                            {
                                Nombre = e.primer_nombre,
                                Apellido1 = e.primer_apellido,
                                Apellido2 = e.segundo_apellido,
                                Carne = e.carne,
                                s.HorasAsignadas,
                                IdSolicitud = s.Id,
                                Id = (from ev in entities.EVALUACION
                                      where ev.IdEstudiante == e.carne && ev.IdSolicitud == s.Id
                                      select new
                                      {
                                          
                                          ev.Id
                                      }).FirstOrDefault(),
                                Evaluacion = (from ev in entities.EVALUACION
                                         where ev.IdEstudiante == e.carne && ev.IdSolicitud == s.Id
                                         select new
                                         {
                                             ev.HorasLaboradas,
                                             Observaciones = ev.Observacion,
                                             Recomendado = ev.Recomendable
                                         }).FirstOrDefault()
                            }).ToList();
                        return Request.CreateResponse(HttpStatusCode.OK,estudiantes);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Realiza la evaluacion del trabajo de un estudiante
        /// </summary>
        /// <param name="evaluacion">informacion a registrar</param>
        /// <returns>ok si guarda la evaluacion</returns>
        [HttpPost]
        [Route("evaluarEstudiante")]
        public HttpResponseMessage EvaluarEstudiante(EVALUACION evaluacion)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.evaluarAsistente(evaluacion.IdEstudiante,evaluacion.IdResponsable,evaluacion.Observacion,evaluacion.Recomendable, Decimal.ToInt32(evaluacion.HorasLaboradas),evaluacion.IdSolicitud);
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

        /// <summary>
        /// Realiza la edicion de una evaluacion
        /// </summary>
        /// <param name="evaluacion">informacion a editar</param>
        /// <returns>ok si lo actualiza</returns>
        [HttpPost]
        [Route("editarEvaluarEstudiante")]
        public HttpResponseMessage EditarEvaluarEstudiante(EVALUACION evaluacion)
        {
            using (HorasBecaEntities entities = new HorasBecaEntities())
            {
                if (ModelState.IsValid)
                {
                    try
                    {
                        entities.editarAsistente(evaluacion.Id, evaluacion.Observacion, evaluacion.Recomendable, Decimal.ToInt32(evaluacion.HorasLaboradas));
                        return Request.CreateResponse(HttpStatusCode.OK);
                    }
                    catch (DataException) { return Request.CreateResponse(HttpStatusCode.Conflict); }
                }
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
        }

    }
}
