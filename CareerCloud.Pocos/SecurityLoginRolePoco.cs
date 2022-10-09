using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Security_Logins_Roles")]
    public class SecurityLoginsRolePoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK ===

        public Guid Login { get; set; } 
        public Guid Role { get; set; } 
        [Column("Time_Stamp")]
        public byte[]? TimeStamp { get; set; }
    }
}

