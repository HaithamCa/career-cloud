using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Company_Job_Skills")]
    public class CompanyJobSkillPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK ===

        public Guid Job { get; set; } // FK====
        [Column("Skill")]
        public string? Skill { get; set; } // VArchar ==
        [Column("Skill_Level")]
        public string? SkillLevel { get; set; } // varchar==
        [Column("Start_Month")]
        public byte StartMonth { get; set; }
        [Column("Importance")]
        public int Importance { get; set; }
        [Column("Start_Year")]
        public Int32 StartYear { get; set; } // tinyint ==
        [Column("End_Month")]
        public byte EndMonth { get; set; }
        [Column("End_Year")]
        public Int32 EndYear { get; set; } // tinyint ==
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; } // rowversion
    }
}

