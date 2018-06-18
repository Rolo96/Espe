using System;

namespace APISolicitudes.Models
{
    /// <summary>
    /// Objeto utilizado para castear los body de las solicitudes recibidas
    /// </summary>
    public class transaccion
    {
        public DateTime fecha { get; set; }
        public int opcionInt { get; set; }
        public int opcionInt2 { get; set; }
        public int opcionInt3 { get; set; }

    }
}