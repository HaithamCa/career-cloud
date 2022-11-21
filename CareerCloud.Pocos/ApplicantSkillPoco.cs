using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Applicant_Skills")]
    public class ApplicantSkillPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK ===

        public Guid Applicant { get; set; } // FK====
        [Column("Skill")]
        public string? Skill { get; set; } // VArchar ==
        [Column("Start_Month")]
        public byte StartMonth { get; set; } // VArchar ==
        [Column("Start_Year")]
        public int StartYear { get; set; } // VArchar ==
        [Column("End_Month")]
        public byte EndMonth { get; set; } // VArchar ==
        [Column("End_Year")]
        public int EndYear { get; set; } // VArchar ==
        [Column("Skill_Level")]
        public string? SkillLevel { get; set; } // varchar==
        [Column("Importance")]
        public Int32 Importance { get; set; }
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; } // rowversion

        public virtual ApplicantProfilePoco ApplicantProfile { get; set; }
    }
}

