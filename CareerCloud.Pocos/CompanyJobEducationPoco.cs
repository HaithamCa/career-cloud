using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Company_Job_Educations")]
    public class CompanyJobEducationPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK
        public Guid Job { get; set; } // FK

        public string? Major { get; set; } // VArchar
        [Column("Importance")]
        public Int16 Importance { get; set; } // tinyint
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; } // rowversion
    }
}

