using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace CareerCloud.Pocos
{
    [Table("Company_Locations")]
    public class CompanyLocationPoco : IPoco
    {
        [Key]
        public Guid Id { get; set; } // id PK ===
        public Guid Company { get; set; }

        [Column("Country_Code")]
        public string? CountryCode { get; set; } // varchar==
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
    }
}

