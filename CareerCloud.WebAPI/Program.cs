using CareerCloud.BusinessLogicLayer;
using CareerCloud.EntityFrameworkDataAccess;
using CareerCloud.Pocos;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var db = new CareerCloudContext())
{
    db.Database.EnsureCreated();
    SeedDefaultReferenceData(db);
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        if (feature?.Error is AggregateException aggEx)
        {
            var validationErrors = aggEx.Flatten().InnerExceptions
                .OfType<ValidationException>()
                .Select(v => new { code = v.Code, message = v.Message })
                .ToList();

            if (validationErrors.Count > 0)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new
                {
                    message = validationErrors.First().message,
                    errors = validationErrors
                });
                return;
            }
        }

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            message = feature?.Error?.Message ?? "An unexpected server error occurred."
        });
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");
app.UseRouting();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();

static void SeedDefaultReferenceData(CareerCloudContext db)
{
    if (!db.SystemCountryCodes.Any())
    {
        db.SystemCountryCodes.AddRange(
            new SystemCountryCodePoco { Code = "CAN", Name = "Canada" },
            new SystemCountryCodePoco { Code = "USA", Name = "United States" },
            new SystemCountryCodePoco { Code = "GBR", Name = "United Kingdom" }
        );
        db.SaveChanges();
    }

    if (!db.SystemLanguageCodes.Any())
    {
        db.SystemLanguageCodes.AddRange(
            new SystemLanguageCodePoco { LanguageID = "EN", Name = "English", NativeName = "English" },
            new SystemLanguageCodePoco { LanguageID = "FR", Name = "French", NativeName = "Français" },
            new SystemLanguageCodePoco { LanguageID = "ES", Name = "Spanish", NativeName = "Español" }
        );
        db.SaveChanges();
    }

    if (!db.SecurityRoles.Any())
    {
        db.SecurityRoles.AddRange(
            new SecurityRolePoco { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Role = "Applicant", IsInactive = false },
            new SecurityRolePoco { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Role = "Employer", IsInactive = false }
        );
        db.SaveChanges();
    }

    if (!db.CompanyProfiles.Any())
    {
        var company1Id = Guid.Parse("33333333-3333-3333-3333-333333333333");
        var company2Id = Guid.Parse("44444444-4444-4444-4444-444444444444");

        db.CompanyProfiles.AddRange(
            new CompanyProfilePoco
            {
                Id = company1Id,
                CompanyWebsite = "https://maplecloud.ca",
                ContactPhone = "416-555-0199",
                ContactName = "Sarah Jenkins",
                RegistrationDate = DateTime.UtcNow.AddMonths(-8)
            },
            new CompanyProfilePoco
            {
                Id = company2Id,
                CompanyWebsite = "https://northstarfin.com",
                ContactPhone = "647-555-0142",
                ContactName = "David Chen",
                RegistrationDate = DateTime.UtcNow.AddMonths(-5)
            }
        );

        db.CompanyDescriptions.AddRange(
            new CompanyDescriptionPoco
            {
                Id = Guid.NewGuid(),
                Company = company1Id,
                LanguageId = "EN",
                CompanyName = "MapleCloud Technologies",
                CompanyDescription = "Enterprise cloud infrastructure and distributed data platform provider headquartered in Toronto."
            },
            new CompanyDescriptionPoco
            {
                Id = Guid.NewGuid(),
                Company = company2Id,
                LanguageId = "EN",
                CompanyName = "NorthStar Financial Systems",
                CompanyDescription = "Modern payment rails, treasury analytics, and core banking APIs for North American institutions."
            }
        );

        db.CompanyLocations.AddRange(
            new CompanyLocationPoco
            {
                Id = Guid.NewGuid(),
                Company = company1Id,
                CountryCode = "CAN",
                Province = "ON",
                Street = "100 King Street West",
                City = "Toronto",
                PostalCode = "M5X 1A9"
            },
            new CompanyLocationPoco
            {
                Id = Guid.NewGuid(),
                Company = company2Id,
                CountryCode = "CAN",
                Province = "BC",
                Street = "455 Granville Street",
                City = "Vancouver",
                PostalCode = "V6C 1T1"
            }
        );

        var job1Id = Guid.Parse("55555555-5555-5555-5555-555555555555");
        var job2Id = Guid.Parse("66666666-6666-6666-6666-666666666666");
        var job3Id = Guid.Parse("77777777-7777-7777-7777-777777777777");

        db.CompanyJobs.AddRange(
            new CompanyJobPoco
            {
                Id = job1Id,
                Company = company1Id,
                ProfileCreated = DateTime.UtcNow.AddDays(-6),
                IsInactive = false,
                IsCompanyHidden = false
            },
            new CompanyJobPoco
            {
                Id = job2Id,
                Company = company1Id,
                ProfileCreated = DateTime.UtcNow.AddDays(-2),
                IsInactive = false,
                IsCompanyHidden = false
            },
            new CompanyJobPoco
            {
                Id = job3Id,
                Company = company2Id,
                ProfileCreated = DateTime.UtcNow.AddDays(-1),
                IsInactive = false,
                IsCompanyHidden = false
            }
        );

        db.CompanyJobDescriptions.AddRange(
            new CompanyJobDescriptionPoco
            {
                Id = Guid.NewGuid(),
                Job = job1Id,
                JobName = "Senior .NET & Cloud Platform Engineer",
                JobDescriptions = "Design and scale high-throughput ASP.NET Core microservices, EF Core data pipelines, and gRPC APIs supporting enterprise workloads."
            },
            new CompanyJobDescriptionPoco
            {
                Id = Guid.NewGuid(),
                Job = job2Id,
                JobName = "Full-Stack Angular & TypeScript Engineer",
                JobDescriptions = "Build accessible, responsive recruitment and analytics applications using Angular standalone components, Reactive Forms, and REST APIs."
            },
            new CompanyJobDescriptionPoco
            {
                Id = Guid.NewGuid(),
                Job = job3Id,
                JobName = "Backend Systems Architect (Fintech)",
                JobDescriptions = "Lead payment ledger architecture, SQL Server optimization, and API security across NorthStar's core financial platform."
            }
        );

        db.CompanyJobSkills.AddRange(
            new CompanyJobSkillPoco { Id = Guid.NewGuid(), Job = job1Id, Skill = "C# / ASP.NET Core", SkillLevel = "Expert", Importance = 10 },
            new CompanyJobSkillPoco { Id = Guid.NewGuid(), Job = job1Id, Skill = "Entity Framework Core & SQL", SkillLevel = "Advanced", Importance = 9 },
            new CompanyJobSkillPoco { Id = Guid.NewGuid(), Job = job2Id, Skill = "Angular & TypeScript", SkillLevel = "Advanced", Importance = 10 },
            new CompanyJobSkillPoco { Id = Guid.NewGuid(), Job = job2Id, Skill = "REST APIs & RxJS", SkillLevel = "Intermediate", Importance = 8 },
            new CompanyJobSkillPoco { Id = Guid.NewGuid(), Job = job3Id, Skill = "Distributed Systems & C#", SkillLevel = "Expert", Importance = 10 }
        );

        db.CompanyJobEducations.AddRange(
            new CompanyJobEducationPoco { Id = Guid.NewGuid(), Job = job1Id, Major = "Computer Science", Importance = 8 },
            new CompanyJobEducationPoco { Id = Guid.NewGuid(), Job = job2Id, Major = "Software Engineering", Importance = 7 },
            new CompanyJobEducationPoco { Id = Guid.NewGuid(), Job = job3Id, Major = "Computer Engineering", Importance = 9 }
        );

        db.SaveChanges();
    }
}
