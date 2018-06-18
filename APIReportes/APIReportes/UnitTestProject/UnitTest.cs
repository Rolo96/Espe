using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using APIReportes.Controllers;
using APIReportes.Models;
using System.Net.Http;
using System.Web.Http;

namespace UnitTestProject
{
    [TestClass]
    public class UnitTest
    {
        [TestMethod]
        public void ReporteTec()
        {
            var controller = new ReportesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            objGeneral obj = new objGeneral { opcionInt = 1};

            var response = controller.ReporteTec(obj);
            Assert.IsNotNull(response.Content);
        }

        [TestMethod]
        public void ReporteTS()
        {
            var controller = new ReportesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            objGeneral obj = new objGeneral { opcionInt = 1 };

            var response = controller.ReporteTS(obj);
            Assert.IsNotNull(response.Content);
        }

        [TestMethod]
        public void ReporteAuditoria()
        {
            var controller = new ReportesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            objGeneral obj = new objGeneral { opcionInt = 1 };

            var response = controller.ReporteAuditoria(obj);
            Assert.IsNotNull(response.Content);
        }

        [TestMethod]
        public void certificacionHoras()
        {
            var controller = new ReportesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            objGeneral obj = new objGeneral { opcionStr = "2015010203" };

            var response = controller.certificacionHoras(obj);
            Assert.IsNotNull(response.Content);
        }

    }
}
