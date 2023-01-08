using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Security_Logins_Log")]
    public class SecurityLoginsLogPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK ===

        public Guid Login { get; set; } // VArchar ==
        [Column("Source_IP")]
        public string? SourceIP { get; set; } // varchar==
        [Column("Logon_Date")]
        public DateTime LogonDate { get; set; }
        [Column("Is_Succesful")]
        public Boolean IsSuccesful { get; set; }

        public virtual SecurityLoginPoco SecurityLogin { get; set; }
    }
}

