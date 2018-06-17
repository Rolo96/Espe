using System;

namespace APISolicitudes.Models
{
    /// <summary>
    /// Objeto utilizado para castear los body de las solicitudes que traen todo el contenido de una solicitud de horas beca
    /// </summary>
    public class SolicitudCompleta
    {
        public int Id { get; set; }
        public int Cedula { get; set; }
        public string Carne { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Email { get; set; }
        public int Telefono { get; set; }
        public int Estado { get; set; }
        public DateTime FechaAlmacenamiento { get; set; }
        public int Horas { get; set; }
        public bool CumpleRequisitos { get; set; }
        public bool OtraBeca { get; set; }
        public int PonderadoAnterior { get; set; }
        public int PonderadoGeneral { get; set; }
        public int NumeroCuenta { get; set; }
        public int IdBanco { get; set; }
        public int IdSemestre { get; set; }
        public string AbreviaturaBeca { get; set; }
        public byte[] ScreenShotCedula { get; set; }
        public byte[] ScreenShotCuentaBanco { get; set; }
        public byte[] ScreenShotPonderadoAnterior { get; set; }
        public byte[] ScreenShotPonderadoGeneral { get; set; }
        public byte[] ScreenShotCreditosAprobadosAnterior { get; set; }
        public byte[] ScreenShotCreditosAprobadosTotal { get; set; }
        public byte[] ScreenshotNota { get; set; }
        public int OtroHoras { get; set; }
        public int OtraHoras { get; set; }
        public string OtraEscuela { get; set; }
        public int IdCarrera { get; set; }
        public int CreditosAprobadosAnterior { get;set;}
        public int CreditosAprobadosTotal { get; set; }
        public int CreditosSemestreActual { get; set; }
        public int CursosPendientes { get; set; }
        public int AnosActivoTec { get; set; }
        public string Codigo { get; set; }
        public string NombreCurso { get; set; }
        public int Nota { get; set; }
        public string NombreResponsable { get; set; }

    }
}