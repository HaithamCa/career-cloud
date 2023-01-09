using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("System_Country_Codes")]
    public class SystemCountryCodePoco
    {
        [Key]
        public string? Code { get; set; }
        [Column("Name")]
        public string? Name { get; set; }

        public virtual ICollection<ApplicantProfilePoco> ApplicantProfiles { get; set; }
        public object? ApplicantWorkHistory { get; set; }
        //public virtual ICollection<ApplicantWorkHistoryPoco> ApplicantWorkHistories { get; set; }
        //public object ApplicantWorkHistorys { get; set; }
        public virtual ICollection<ApplicantWorkHistoryPoco> ApplicantWorkHistorys { get; set; }
    }
}


