//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace APIConfiguracion.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class SOLICITUD
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SOLICITUD()
        {
            this.EVALUACION = new HashSet<EVALUACION>();
            this.RESPONSABLEXESTUDIANTE = new HashSet<RESPONSABLEXESTUDIANTE>();
            this.TRANSACCIONES = new HashSet<TRANSACCIONES>();
        }
    
        public int Id { get; set; }
        public Nullable<int> Cedula { get; set; }
        public string Carne { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Email { get; set; }
        public Nullable<int> Telefono { get; set; }
        public Nullable<int> Estado { get; set; }
        public Nullable<System.DateTime> FechaAlmacenamiento { get; set; }
        public Nullable<int> HorasAsignadas { get; set; }
        public Nullable<bool> CumpleRequisitos { get; set; }
        public Nullable<bool> OtraBeca { get; set; }
        public string OtraEscuela { get; set; }
        public Nullable<int> OtraHoras { get; set; }
        public Nullable<int> PonderadoAnterior { get; set; }
        public Nullable<int> PonderadoGeneral { get; set; }
        public Nullable<int> CreditosAprobadosAnterior { get; set; }
        public Nullable<int> CreditosAprobadosTotal { get; set; }
        public Nullable<int> CreditosSemestreActual { get; set; }
        public Nullable<int> CursosPendientes { get; set; }
        public Nullable<int> AnosActivoTec { get; set; }
        public Nullable<int> NumeroCuenta { get; set; }
        public byte[] ScreenShotCedula { get; set; }
        public byte[] ScreenShotPonderadoAnterior { get; set; }
        public byte[] ScreenShotPonderadoGeneral { get; set; }
        public byte[] ScreenShotCreditosAprobadosAnterior { get; set; }
        public byte[] ScreenShotCreditosAprobadosTotal { get; set; }
        public byte[] ScreenShotCuentaBanco { get; set; }
        public string ObservacionesEvaluación { get; set; }
        public int IdSemestre { get; set; }
        public int IdEstado { get; set; }
        public int IdBanco { get; set; }
        public string AbreviaturaBeca { get; set; }
        public Nullable<int> IdCarrera { get; set; }
    
        public virtual BANCO BANCO { get; set; }
        public virtual BECA BECA { get; set; }
        public virtual BECAAE BECAAE { get; set; }
        public virtual BECAHATU BECAHATU { get; set; }
        public virtual CARRERA CARRERA { get; set; }
        public virtual ESTADOSOLICITUD ESTADOSOLICITUD { get; set; }
        public virtual estudiantes estudiantes { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EVALUACION> EVALUACION { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<RESPONSABLEXESTUDIANTE> RESPONSABLEXESTUDIANTE { get; set; }
        public virtual SEMESTRE SEMESTRE { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TRANSACCIONES> TRANSACCIONES { get; set; }
    }
}
