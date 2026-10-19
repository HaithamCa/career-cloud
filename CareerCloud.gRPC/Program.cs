//using CareerCloud.gRPC.Services;
//using Grpc.Core;

//var builder = WebApplication.CreateBuilder(args);

//// Additional configuration is required to successfully run gRPC on macOS.
//// For instructions on how to configure Kestrel and gRPC clients on macOS, visit https://go.microsoft.com/fwlink/?linkid=2099682

//// Add services to the container.
//builder.Services.AddGrpc();

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//app.MapGrpcService<ApplicantEducationService>();
//app.MapGrpcService<ApplicantJobApplicationService>();
//app.MapGrpcService<ApplicantProfileService>();
//app.MapGrpcService<CompanyDescriptionService>();
//app.MapGrpcService<CompanyJobEducationService>();
//app.MapGrpcService<CompanyJobService>();
//app.MapGrpcService<SecurityLoginService>();
//app.MapGrpcService<SecurityLoginsLogService>();
//app.MapGrpcService<SystemLanguageCodeService>();

//app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

//app.Run();

using CareerCloud.gRPC.Services;
//using GrpcServer.Services;
using Grpc.Core;

namespace GrpcServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Additional configuration is required to successfully run gRPC on macOS.
            // For instructions on how to configure Kestrel and gRPC clients on macOS, visit https://go.microsoft.com/fwlink/?linkid=2099682

            // Add services to the container.
            builder.Services.AddGrpc();
            builder.Services.AddHttpClient("productApi", options =>
            {
                options.BaseAddress = new Uri(builder.Configuration
                    .GetSection("ApiOptions:BaseAddress").Value);
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.MapGrpcService<ApplicantEducationService>();
            app.MapGrpcService<ApplicantJobApplicationService>();
            app.MapGrpcService<ApplicantProfileService>();
            app.MapGrpcService<CompanyDescriptionService>();
            app.MapGrpcService<CompanyJobEducationService>();
            app.MapGrpcService<CompanyJobService>();
            app.MapGrpcService<SecurityLoginService>();
            app.MapGrpcService<SecurityLoginsLogService>();
            app.MapGrpcService<SystemLanguageCodeService>();

            app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

            app.Run();
        }
    }
}

