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
using static CareerCloud.gRPC.Protos.CompanyJobEducation;

namespace CareerCloud.gRPC.Services
{
    public class CompanyJobEducationService : CompanyJobEducationBase
    {
        private readonly CompanyJobEducationLogic _logic;

        public CompanyJobEducationService()
        {
            _logic = new CompanyJobEducationLogic(new EFGenericRepository<CompanyJobEducationPoco>());
        }

        public override Task<CompanyJobEducationPayload> ReadCompanyJobEducation(CompanyJobEducationIdRequest request, ServerCallContext context)
        {
            var poco = _logic.Get(Guid.Parse(request.Id));
            return Task.FromResult(new CompanyJobEducationPayload()
            {
                Id = poco.Id.ToString(),
                Job = poco.Job.ToString(),
                Importance = poco.Importance,
                Major = poco.Major
            });
        }

        public override Task<Empty> CreateCompanyJobEducation(CompanyJobEducationPayload request, ServerCallContext context)
        {
            CompanyJobEducationPoco[] pocos = { new CompanyJobEducationPoco()
            {
                Id = Guid.Parse(request.Id),
                Job = Guid.Parse(request.Job),
                Importance = (short)request.Importance,
                Major = request.Major
            } };
            _logic.Add(pocos);
            return Task.FromResult(new Empty());
        }

        public override Task<Empty> UpdateCompanyJobEducation(CompanyJobEducationPayload request, ServerCallContext context)
        {
            CompanyJobEducationPoco[] pocos = { new CompanyJobEducationPoco()
            {
                Id = Guid.Parse(request.Id),
                Job = Guid.Parse(request.Job),
                Importance = (short)request.Importance,
                Major = request.Major
            } };
            _logic.Update(pocos);
            return Task.FromResult(new Empty());
        }

        public override Task<Empty> DeleteCompanyJobEducation(CompanyJobEducationPayload request, ServerCallContext context)
        {
            CompanyJobEducationPoco poco = _logic.Get(Guid.Parse(request.Id));
            _logic.Delete(new CompanyJobEducationPoco[] { poco });
            return Task.FromResult(new Empty());
        }
    }
}