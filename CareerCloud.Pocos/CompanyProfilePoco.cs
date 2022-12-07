using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Company_Profiles")]
    public class CompanyProfilePoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK
        public DateTime? Registration_Date { get; set; } // FK
        [Column("Company_Website")]
        public string? CompanyWebsite { get; set; } // VArchar
        [Column("Contact_Phone")]
        public string? ContactPhone { get; set; } // varchar
        [Column("Registration_Date")]
        public DateTime RegistrationDate { get; set; } 
        [Column("Contact_Name")]
        public string? ContactName { get; set; }
        [Column("Company_Logo")]
        public byte[]? CompanyLogo { get; set; }
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; } // rowversion

        public virtual ICollection<CompanyDescriptionPoco> CompanyDescriptions { get; set; }
        public virtual ICollection<CompanyJobPoco> CompanyJobs { get; set; }
        public virtual ICollection<CompanyLocationPoco> CompanyLocations { get; set; }
    }
}

