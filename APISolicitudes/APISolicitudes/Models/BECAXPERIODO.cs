//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace APISolicitudes.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class BECAXPERIODO
    {
        public int IdPeriodo { get; set; }
        public string AbreviaturaBeca { get; set; }
        public int Horas { get; set; }
    
        public virtual BECA BECA { get; set; }
        public virtual PERIODO PERIODO { get; set; }
    }
}
