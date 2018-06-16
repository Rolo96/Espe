﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIConfiguracion.Models
{
    public class PeriodoCompleto
    {
        public string Becas { get; set; }
        public System.DateTime FechaApertura { get; set; }
        public System.DateTime FechaCierre { get; set; }
        public string IdAdministrador { get; set; }
        public int IdSemestre { get; set; }
    }
}