using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CareerCloud.BusinessLogicLayer;
using CareerCloud.EntityFrameworkDataAccess;
using CareerCloud.gRPC.Protos;
using CareerCloud.Pocos;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using static CareerCloud.gRPC.Protos.ApplicantEducation;

namespace CareerCloud.gRPC.Services
{
    public class ApplicantEducationService : ApplicantEducationBase
    {
        private readonly ApplicantEducationLogic _logic;

        public ApplicantEducationService()
        {
            _logic = new ApplicantEducationLogic(new EFGenericRepository<ApplicantEducationPoco>());
        }

        public override Task<ApplicantEducationPayload> ReadApplicantEducation(ApplicantEducationIdRequest request, ServerCallContext context)
        {
            var poco = _logic.Get(Guid.Parse(request.Id));
            return Task.FromResult(new ApplicantEducationPayload()
            {
                Id = poco.Id.ToString(),
                Applicant = poco.Applicant.ToString(),
                CertificateDiploma = poco.CertificateDiploma,
                CompletionDate = poco.CompletionDate is null ? null : Timestamp.FromDateTime(DateTime.SpecifyKind((DateTime)poco.CompletionDate, DateTimeKind.Utc)),
                CompletionPercent = poco.CompletionPercent is null ? 0 : (int)poco.CompletionPercent,
                Major = poco.Major,
                StartDate = poco.StartDate is null ? null : Timestamp.FromDateTime(DateTime.SpecifyKind((DateTime)poco.StartDate, DateTimeKind.Utc))
            });
        }

        public override Task<Empty> CreateApplicantEducation(ApplicantEducationPayload request, ServerCallContext context)
        {
            ApplicantEducationPoco[] pocos = { new ApplicantEducationPoco()
            {
                Id = Guid.Parse(request.Id),
                Applicant = Guid.Parse(request.Applicant),
                Major = request.Major,
                CertificateDiploma = request.CertificateDiploma,
                CompletionDate = request.CompletionDate.ToDateTime(),
                CompletionPercent = (byte?)request.CompletionPercent,
                StartDate = request.StartDate.ToDateTime()
            } };
            _logic.Add(pocos);
            return Task.FromResult(new Empty());
        }

        public override Task<Empty> UpdateApplicantEducation(ApplicantEducationPayload request, ServerCallContext context)
        {
            ApplicantEducationPoco[] pocos = { new ApplicantEducationPoco()
            {
                Id = Guid.Parse(request.Id),
                Applicant = Guid.Parse(request.Applicant),
                Major = request.Major,
                CertificateDiploma = request.CertificateDiploma,
                CompletionDate = request.CompletionDate.ToDateTime(),
                CompletionPercent = (byte?)request.CompletionPercent,
                StartDate = request.StartDate.ToDateTime()
            } };
            _logic.Update(pocos);
            return Task.FromResult(new Empty());
        }

        public override Task<Empty> DeleteApplicantEducation(ApplicantEducationPayload request, ServerCallContext context)
        {
            ApplicantEducationPoco poco = _logic.Get(Guid.Parse(request.Id));
            _logic.Delete(new ApplicantEducationPoco[] { poco });
            return Task.FromResult(new Empty());
        }
    }
}