//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace APIRetroalimentacion.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class TRANSACCIONES
    {
        public int Id { get; set; }
        public string IdResponsable { get; set; }
        public System.DateTime Fecha { get; set; }
        public int IdSolicitud { get; set; }
        public int IdEstado { get; set; }
    
        public virtual ESTADOSOLICITUD ESTADOSOLICITUD { get; set; }
        public virtual SOLICITUD SOLICITUD { get; set; }
        public virtual usuario usuario { get; set; }
    }
}