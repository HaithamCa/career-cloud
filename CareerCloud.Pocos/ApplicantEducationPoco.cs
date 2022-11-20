using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;


namespace CareerCloud.Pocos
{
    [Table("Applicant_Educations")]
    public class ApplicantEducationPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK
        public Guid Applicant { get; set; } // FK
        [Column("Major")]
        public string? Major { get; set; } // VArchar
        [Column("Certificate_Diploma")]
        public string? CertificateDiploma { get; set; } // varchar
        [Column("Start_Date")]
        public DateTime? StartDate { get; set; }
        [Column("Completion_Date")]
        public DateTime? CompletionDate { get; set; }
        [Column("Completion_Percent")]
        public byte? CompletionPercent { get; set; } // tinyint
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; } // rowversion

        public virtual ApplicantProfilePoco ApplicantProfile { get; set; }

    }
}

