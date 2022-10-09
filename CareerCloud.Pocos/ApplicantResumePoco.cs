using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Applicant_Resumes")]
    public class ApplicantResumePoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK

        public Guid Applicant { get; set; } // FK
        [Column("Resume")]
        public string? Resume { get; set; } // varchar
        [Column("Last_Updated")]
        public DateTime? LastUpdated { get; set; }
    }
}

