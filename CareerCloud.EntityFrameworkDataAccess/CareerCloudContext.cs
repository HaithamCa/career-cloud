using System;
using Microsoft.EntityFrameworkCore;
using CareerCloud.Pocos;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;


namespace CareerCloud.EntityFrameworkDataAccess
{
    public class CareerCloudContext : DbContext
    {
        public DbSet<ApplicantEducationPoco> ApplicantEducations { get; set; }
        public DbSet<ApplicantJobApplicationPoco> ApplicantJobApplications { get; set; }
        public DbSet<ApplicantProfilePoco> ApplicantProfiles { get; set; }
        public DbSet<ApplicantResumePoco> ApplicantResumes { get; set; }
        public DbSet<ApplicantSkillPoco> ApplicantSkills { get; set; }
        public DbSet<ApplicantWorkHistoryPoco> ApplicantWorkHistories { get; set; }
        public DbSet<CompanyDescriptionPoco> CompanyDescriptions { get; set; }
        public DbSet<CompanyJobDescriptionPoco> CompanyJobDescriptions { get; set; }
        public DbSet<CompanyJobEducationPoco> CompanyJobEducations { get; set; }
        public DbSet<CompanyJobPoco> CompanyJobs { get; set; }
        public DbSet<CompanyJobSkillPoco> CompanyJobSkills { get; set; }
        public DbSet<CompanyLocationPoco> CompanyLocations { get; set; }
        public DbSet<CompanyProfilePoco> CompanyProfiles { get; set; }
        public DbSet<SecurityLoginPoco> SecurityLogins { get; set; }
        public DbSet<SecurityLoginsLogPoco> SecurityLoginsLogs { get; set; }
        public DbSet<SecurityLoginsRolePoco> SecurityLoginsRoles { get; set; }
        public DbSet<SecurityRolePoco> SecurityRoles { get; set; }
        public DbSet<SystemCountryCodePoco> SystemCountryCodes { get; set; }
        public DbSet<SystemLanguageCodePoco> SystemLanguageCodes { get; set; }

        protected override void
            OnConfiguring(DbContextOptionsBuilder optionBuilder)
        {
            if (!optionBuilder.IsConfigured)
            {
                var connStr = Environment.GetEnvironmentVariable("CAREERCLOUD_CONNECTION_STRING")
                    ?? "Data Source=localhost;Initial Catalog=JOB_PORTAL_DB;Integrated Security=True;";
                optionBuilder.UseSqlServer(connStr);
            }
            //base.OnConfiguring(optionBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //#region SystemCountryCode
            //modelBuilder.Entity<SystemCountryCodePoco>().Ignore(x => x.ApplicantWorkHistory);
            //#endregion
            //builder.Entity<SystemLanguageCodePoco>()
            //    .HasMany(x => x.CompanyDescriptions)
            //    .WithOne(x => x.SystemLanguageCode)
            //    .HasForeignKey(x => x.LanguageId);

            modelBuilder.Entity<ApplicantEducationPoco>(entity =>
            {
                entity.HasOne(ap => ap.ApplicantProfile)
                .WithMany(ae => ae.ApplicantEducations)
                .HasForeignKey(f => f.Applicant);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<ApplicantJobApplicationPoco>(entity =>
            {
                entity.HasOne(ap => ap.ApplicantProfile)
                .WithMany(aja => aja.ApplicantJobApplications)
                .HasForeignKey(f => f.Applicant);
                entity.HasOne(cj => cj.CompanyJob)
                .WithMany(aja => aja.ApplicantJobApplications)
                .HasForeignKey(f => f.Job);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<ApplicantProfilePoco>(entity =>
            {
                entity.HasOne(sl => sl.SecurityLogin)
                .WithMany(ap => ap.ApplicantProfiles)
                .HasForeignKey(f => f.Login);
                entity.HasOne(scc => scc.SystemCountryCode)
                .WithMany(ap => ap.ApplicantProfiles)
                .HasForeignKey(f => f.Country);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<ApplicantResumePoco>(entity =>
            {
                entity.HasOne(ap => ap.ApplicantProfile)
                .WithMany(ar => ar.ApplicantResumes)
                .HasForeignKey(f => f.Applicant);
            });

            modelBuilder.Entity<ApplicantSkillPoco>(entity =>
            {
                entity.HasOne(ap => ap.ApplicantProfile)
                .WithMany(_as => _as.ApplicantSkills)
                .HasForeignKey(f => f.Applicant);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });


            modelBuilder.Entity<ApplicantWorkHistoryPoco>(entity =>
            {
                entity.HasOne(ap => ap.ApplicantProfile)
                .WithMany(awh => awh.ApplicantWorkHistorys)
                .HasForeignKey(f => f.Applicant);
                entity.HasOne(scc => scc.SystemCountryCode)
                .WithMany(awh => awh.ApplicantWorkHistorys)
                .HasForeignKey(f => f.CountryCode);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CompanyDescriptionPoco>(entity =>
            {
                entity.HasOne(cp => cp.CompanyProfile)
                .WithMany(cd => cd.CompanyDescriptions)
                .HasForeignKey(f => f.Company);
                entity.HasOne(slc => slc.SystemLanguageCode)
                .WithMany(cd => cd.CompanyDescriptions)
                .HasForeignKey(f => f.LanguageId);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CompanyJobDescriptionPoco>(entity =>
            {
                entity.HasOne(cj => cj.CompanyJob)
                .WithMany(cjd => cjd.CompanyJobDescriptions)
                .HasForeignKey(f => f.Job);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CompanyJobEducationPoco>(entity =>
            {
                entity.HasOne(cj => cj.CompanyJob)
                .WithMany(cje => cje.CompanyJobEducations)
                .HasForeignKey(f => f.Job);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CompanyJobPoco>(entity =>
            {
                entity.HasOne(cp => cp.CompanyProfile)
                .WithMany(cj => cj.CompanyJobs)
                .HasForeignKey(f => f.Company);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CompanyJobSkillPoco>(entity =>
            {
                entity.HasOne(cj => cj.CompanyJob)
                .WithMany(cjs => cjs.CompanyJobSkills)
                .HasForeignKey(f => f.Job);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CompanyLocationPoco>(entity =>
            {
                entity.HasOne(cp => cp.CompanyProfile)
                .WithMany(cl => cl.CompanyLocations)
                .HasForeignKey(f => f.Company);
                entity.HasOne(scc => scc.SystemCountryCode)
                .WithMany(cl => cl.CompanyLocations)
                .HasForeignKey(f => f.CountryCode);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<CompanyProfilePoco>(entity =>
            {
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<SecurityLoginPoco>(entity =>
            {
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            modelBuilder.Entity<SecurityLoginsLogPoco>(entity =>
            {
                entity.HasOne(sl => sl.SecurityLogin)
                .WithMany(sll => sll.SecurityLoginsLogs)
                .HasForeignKey(f => f.Login);
            });

            modelBuilder.Entity<SecurityLoginsRolePoco>(entity =>
            {
                entity.HasOne(sl => sl.SecurityLogin)
                .WithMany(slr => slr.SecurityLoginsRoles)
                .HasForeignKey(f => f.Login);
                entity.HasOne(sr => sr.SecurityRole)
                .WithMany(slr => slr.SecurityLoginsRoles)
                .HasForeignKey(f => f.Role);
                entity.Property(e => e.TimeStamp).IsRowVersion();
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
