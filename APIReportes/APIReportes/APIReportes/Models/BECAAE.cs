//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace APIReportes.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class BECAAE
    {
        public int Id { get; set; }
        public Nullable<int> Horas { get; set; }
    
        public virtual SOLICITUD SOLICITUD { get; set; }
    }
}
