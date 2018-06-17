namespace APISolicitudes.Models
{
    /// <summary>
    /// Clase utilizada para recibir las solicitudes de duplicar una solicitud
    /// </summary>
    public class Duplicado
    {
        public int idSemestre { get; set; }
        public int idSolicitud { get; set; }
        public string beca { get; set; }
    }
}