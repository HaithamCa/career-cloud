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
using static CareerCloud.gRPC.Protos.SecurityLogin;

namespace CareerCloud.gRPC.Services
{
    public class SecurityLoginService : SecurityLoginBase
    {
        private readonly SecurityLoginLogic _logic;

        public SecurityLoginService()
        {
            _logic = new SecurityLoginLogic(new EFGenericRepository<SecurityLoginPoco>());
        }

        public override Task<SecurityLoginPayload> ReadSecurityLogin(SecurityLoginIdRequest request, ServerCallContext context)
        {
            var poco = _logic.Get(Guid.Parse(request.Id));
            return Task.FromResult(new SecurityLoginPayload()
            {
                Id = poco.Id.ToString(),
                Login = poco.Login,
                Password = poco.Password,
                Created = Timestamp.FromDateTime(DateTime.SpecifyKind(poco.Created, DateTimeKind.Utc)),
                PasswordUpdate = poco.PasswordUpdate is null ? null : Timestamp.FromDateTime(DateTime.SpecifyKind((DateTime)poco.PasswordUpdate, DateTimeKind.Utc)),
                AgreementAccepted = poco.AgreementAccepted is null ? null : Timestamp.FromDateTime(DateTime.SpecifyKind((DateTime)poco.AgreementAccepted, DateTimeKind.Utc)),
                IsLocked = poco.IsLocked,
                IsInactive = poco.IsInactive,
                EmailAddress = poco.EmailAddress,
                PhoneNumber = poco.PhoneNumber,
                FullName = poco.FullName,
                ForceChangePassword = poco.ForceChangePassword,
                PrefferredLanguage = poco.PrefferredLanguage
            });
        }

        public override Task<Empty> CreateSecurityLogin(SecurityLoginPayload request, ServerCallContext context)
        {
            SecurityLoginPoco[] pocos = { new SecurityLoginPoco()
            {
                Id = Guid.Parse(request.Id),
                Login = request.Login,
                Password = request.Password,
                Created = request.Created.ToDateTime(),
                PasswordUpdate = request.Created.ToDateTime(),
                AgreementAccepted = request.AgreementAccepted.ToDateTime(),
                IsLocked = request.IsLocked,
                IsInactive = request.IsInactive,
                EmailAddress = request.EmailAddress,
                PhoneNumber = request.PhoneNumber,
                FullName = request.FullName,
                ForceChangePassword = request.ForceChangePassword,
                PrefferredLanguage = request.PrefferredLanguage
            } };
            _logic.Add(pocos);
            return Task.FromResult(new Empty());
        }

        public override Task<Empty> UpdateSecurityLogin(SecurityLoginPayload request, ServerCallContext context)
        {
            SecurityLoginPoco[] pocos = { new SecurityLoginPoco()
            {
                Id = Guid.Parse(request.Id),
                Login = request.Login,
                Password = request.Password,
                Created = request.Created.ToDateTime(),
                PasswordUpdate = request.Created.ToDateTime(),
                AgreementAccepted = request.AgreementAccepted.ToDateTime(),
                IsLocked = request.IsLocked,
                IsInactive = request.IsInactive,
                EmailAddress = request.EmailAddress,
                PhoneNumber = request.PhoneNumber,
                FullName = request.FullName,
                ForceChangePassword = request.ForceChangePassword,
                PrefferredLanguage = request.PrefferredLanguage
            } };
            _logic.Update(pocos);
            return Task.FromResult(new Empty());
        }

        public override Task<Empty> DeleteSecurityLogin(SecurityLoginPayload request, ServerCallContext context)
        {
            SecurityLoginPoco poco = _logic.Get(Guid.Parse(request.Id));
            _logic.Delete(new SecurityLoginPoco[] { poco });
            return Task.FromResult(new Empty());
        }
    }
}