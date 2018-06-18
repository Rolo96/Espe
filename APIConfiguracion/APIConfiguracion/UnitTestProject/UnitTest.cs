namespace UnitTestProject
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;  
    using System.Net.Http;
    using System.Web.Http;
    using APIConfiguracion.Controllers;
    using APIConfiguracion.Models;
    using System;

    [TestClass]
    public class UnitTest1
    {

        [TestMethod]
        public void AgregarSemestre()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            SEMESTRE semestre = new SEMESTRE { Semestre1 = 1, FechaInicio = DateTime.Parse("2018-01-01"), FechaCierre = DateTime.Parse("2018-01-01") };

            var response = controller.AgregarSemestre(semestre);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void EditarSemestre()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            SEMESTRE semestre = new SEMESTRE { Id = 2, FechaInicioEvaluacion = DateTime.Parse("2018-01-01"),
                FechaCierreEvaluacion = DateTime.Parse("2018-01-01"),
                FechaTrabajoSocial = DateTime.Parse("2018-01-01") };

            var response = controller.EditarSemestre(semestre);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void EditarPeriodo()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            PeriodoCompleto periodo = new PeriodoCompleto
            {
                Id = 1,
                FechaApertura = DateTime.Parse("2018-01-01"),
                FechaCierre = DateTime.Parse("2018-01-01")
            };

            var response = controller.EditarPeriodo(periodo);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void VerRoles()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            var response = controller.VerRoles();
            Assert.IsNotNull(response.Content);
        }

        public void VerFechasSemestre()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.VerFechasSemestre(obj);
            
            object a;
            response.TryGetContentValue(out a);
            System.Reflection.PropertyInfo pi = a.GetType().GetProperty("FechaInicioEvaluacion");
            DateTime fecha = (DateTime)(pi.GetValue(a, null));
            Assert.AreEqual(DateTime.Parse("2017-10-10 00:00:00.000"), fecha);
        }

        [TestMethod]
        public void VerPeriodo()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.VerPeriodo(obj);

            object a;
            response.TryGetContentValue(out a);
            System.Reflection.PropertyInfo pi = a.GetType().GetProperty("FechaApertura");
            DateTime fecha = (DateTime)(pi.GetValue(a, null));
            Assert.AreEqual(DateTime.Parse("2018-01-01 00:00:00.000"), fecha);
        }
        
        [TestMethod]
        public void HaySemestre()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            var response = controller.HaySemestre();
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void Usuarios()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            var response = controller.usuarios();
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void VerPeriodos()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.VerPeriodos(obj);
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void AgregarPeriodo()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            PeriodoCompleto periodo = new PeriodoCompleto
            {
                Id = 1,
                FechaApertura = DateTime.Parse("2018-01-01"),
                FechaCierre = DateTime.Parse("2018-01-01"),
                IdAdministrador = 1,
                IdSemestre = 1,
                Becas = "[]"
            };

            var response = controller.AgregarPeriodo(periodo);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void SemestreBecas()
        {
            var controller = new ConfiguracionController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            var response = controller.SemestreBecas();
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }
    }  
}