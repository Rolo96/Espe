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
                                       join u in entities.usuario on rxe.IdResponsable equals u.correo_electronico
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

    }
}
