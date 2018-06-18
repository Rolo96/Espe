using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using APIRetroalimentacion.Controllers;
using APIRetroalimentacion.Models;
using System.Net.Http;
using System.Web.Http;

namespace UnitTestProject
{
    [TestClass]
    public class UnitTest
    {
        [TestMethod]
        public void solicitarEstudiantes()
        {
            var controller = new RetroalimentacionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            objGeneral obj = new objGeneral { opcionInt = 1, opcionInt2 = 1 };

            var response = controller.solicitarEstudiantes(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsNotNull(response.Content);
        }

        [TestMethod]
        public void EvaluarEstudiante()
        {
            var controller = new RetroalimentacionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            EVALUACION obj = new EVALUACION { IdEstudiante = "2015010203", IdResponsable = 4, Observacion="Prueba", Recomendable=true, HorasLaboradas=12, IdSolicitud=1 };

            var response = controller.EvaluarEstudiante(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void EditarEvaluarEstudiante()
        {
            var controller = new RetroalimentacionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            EVALUACION obj = new EVALUACION { Id = 1, Observacion = "Prueba", Recomendable = true, HorasLaboradas = 12 };
            var response = controller.EditarEvaluarEstudiante(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }
    }
}