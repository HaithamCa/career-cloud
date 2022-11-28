using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Applicant_Profiles")]
    public class ApplicantProfilePoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK
        public Guid Login { get; set; } // FK
        [Column("Current_Salary")]
        public decimal? CurrentSalary { get; set; } // VArchar
        [Column("Current_Rate")]
        public decimal? CurrentRate { get; set; } // varchar
        [Column("Currency")]
        public string? Currency { get; set; }
        [Column("Currency_Code")]
        public string? CurrencyCode { get; set; }
        [Column("Country_Code")]
        public string? Country { get; set; }
        [Column("State_Province_Code")]
        public string? Province { get; set; } // rowversion
        [Column("Street_Address")]
        public string? Street { get; set; }
        [Column("City_Town")]
        public string? City { get; set; } // tinyint
        [Column("Zip_Postal_Code")]
        public string? PostalCode { get; set; } // rowversion
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; } // rowversion

        public virtual SecurityLoginPoco SecurityLogin { get; set; }
        public virtual SystemCountryCodePoco SystemCountryCode { get; set; }
        public virtual ICollection<ApplicantEducationPoco> ApplicantEducations { get; set; }
        public virtual ICollection<ApplicantJobApplicationPoco> ApplicantJobApplications { get; set; }
        public virtual ICollection<ApplicantResumePoco> ApplicantResumes { get; set; }
        public virtual ICollection<ApplicantSkillPoco> ApplicantSkills { get; set; }
        public object ApplicantWorkHistorys { get; set; }
        //public object ApplicantWorkHistories { get; set; }
    }
}

