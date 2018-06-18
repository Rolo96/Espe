using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using APISolicitudes.Controllers;
using APISolicitudes.Models;
using System.Net.Http;
using System.Web.Http;

namespace UnitTestProject
{
    [TestClass]
    public class UnitTest
    {
        [TestMethod]
        public void VerPeriodos()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            var response = controller.VerPeriodos();
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void tiposBecaHabilitados()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            var response = controller.tiposBecaHabilitados();
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void VerCarreras()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            var response = controller.VerCarreras();
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void VerEnviadas()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionStr = "2015010203" };
            var response = controller.VerEnviadas(obj);
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void VerGuardadas()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionStr = "2015010203" };
            var response = controller.VerGuardadas(obj);

            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void VerSolicitudHE()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.VerSolicitudHE(obj);

            object a;
            response.TryGetContentValue(out a);
            System.Reflection.PropertyInfo pi = a.GetType().GetProperty("Nombre");
            string nombre = (string)(pi.GetValue(a, null));
            Assert.AreEqual("Raul", nombre);
            Assert.IsNotNull(response.Content);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void duplicararSolicitud()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            Duplicado obj = new Duplicado { idSolicitud = 1, idSemestre = 1, beca = "HA" };

            var response = controller.duplicararSolicitud(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void VerSolicitudAE()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 4 };
            var response = controller.VerSolicitudAE(obj);
            object a;
            response.TryGetContentValue(out a);
            System.Reflection.PropertyInfo pi = a.GetType().GetProperty("Nombre");
            string nombre = (string)(pi.GetValue(a, null));
            Assert.AreEqual("Raul", nombre);
            Assert.IsNotNull(response.Content);
        }

        [TestMethod]
        public void VerSolicitudHATU()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 2 };
            var response = controller.VerSolicitudHATU(obj);
            object a;
            response.TryGetContentValue(out a);
            System.Reflection.PropertyInfo pi = a.GetType().GetProperty("Nombre");
            string nombre = (string)(pi.GetValue(a, null));
            Assert.AreEqual("Raul", nombre);
            Assert.IsNotNull(response.Content);
        }

        [TestMethod]
        public void CancelarEnviadaTiempo()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.CancelarEnviadaTiempo(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void borrarSolicitud()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.borrarSolicitud(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void enviarSolicitud()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.enviarSolicitud(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void rechazarCancelacion()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionInt = 1 };
            var response = controller.rechazarCancelacion(obj);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void AgregarTransaccion()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();

            transaccion transaccion = new transaccion { opcionInt = 1, opcionInt2 = 1, opcionInt3 = 1 };

            var response = controller.insertarTransaccion(transaccion);
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void consultarCorreo()
        {
            var controller = new SolicitudesController();
            controller.Request = new HttpRequestMessage();
            controller.Configuration = new HttpConfiguration();
            objGeneral obj = new objGeneral { opcionStr = "2015010203" };
            var response = controller.consultarCorreo(obj);
            object a;
            response.TryGetContentValue(out a);
            System.Reflection.PropertyInfo pi = a.GetType().GetProperty("correo_electronico");
            string nombre = (string)(pi.GetValue(a, null));
            Assert.AreEqual("rolocholo@gmail.com", nombre);
            Assert.IsNotNull(response.Content);
        }

    }
}
