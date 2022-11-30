using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Applicant_Job_Applications")]
    public class ApplicantJobApplicationPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK

        public Guid Applicant { get; set; } // FK

        public Guid Job { get; set; } // FK

        [Column("Application_Date")]
        public DateTime ApplicationDate { get; set; }

        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; }

        public virtual ApplicantProfilePoco ApplicantProfile { get; set; }
        public virtual CompanyJobPoco CompanyJob { get; set; }
    }
}


