using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Applicant_Work_History")]
    public class ApplicantWorkHistoryPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK ===

        public Guid Applicant { get; set; } // FK====
        [Column("Company_Name")]
        public string? CompanyName { get; set; } // VArchar ==
        [Column("Country_Code")]
        public string? CountryCode { get; set; } // varchar==
        [Column("Location")]
        public string? Location { get; set; }
        [Column("Job_Title")]
        public string? JobTitle { get; set; } // tinyint ==
        [Column("Job_Description")]
        public string? JobDescription { get; set; }
        [Column("Start_Month")]
        public Int16 StartMonth { get; set; }
        [Column("Start_Year")]
        public Int32 StartYear { get; set; } // tinyint ==
        [Column("End_Month")]
        public Int16 EndMonth { get; set; }
        [Column("End_Year")]
        public Int32 EndYear { get; set; } // tinyint ==
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; } // rowversion

        public virtual ApplicantProfilePoco ApplicantProfile { get; set; }
        public virtual SystemCountryCodePoco SystemCountryCode { get; set; }
    }
}

