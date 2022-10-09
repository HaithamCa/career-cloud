using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Security_Logins")]
    public class SecurityLoginPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK ===

        [Column("Login")]
        public string? Login { get; set; } // VArchar ==
        [Column("Password")]
        public string? Password { get; set; } // varchar==
        [Column("Created_Date")]
        public DateTime Created { get; set; }
        [Column("Password_Update_Date")]
        public DateTime? PasswordUpdate { get; set; } // tinyint ==
        [Column("Agreement_Accepted_Date")]
        public DateTime? AgreementAccepted { get; set; }
        [Column("Is_Locked")]
        public Boolean IsLocked { get; set; } // tinyint ==
        [Column("Is_Inactive")]
        public Boolean IsInactive { get; set; }
        [Column("Email_Address")]
        public string? EmailAddress { get; set; } // tinyint ==
        [Column("Phone_Number")]
        public string? PhoneNumber { get; set; }
        [Column("Full_Name")]
        public string? FullName { get; set; } // tinyint ==
        [Column("Force_Change_Password")]
        public Boolean ForceChangePassword { get; set; }
        [Column("Prefferred_Language")]
        public string? PrefferredLanguage { get; set; } // tinyint ==
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; }
    }
}

