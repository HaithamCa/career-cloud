using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CareerCloud.BusinessLogicLayer;
using CareerCloud.EntityFrameworkDataAccess;
using CareerCloud.Pocos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CareerCloud.WebAPI.Controllers
{
    [Route("api/careercloud/security/v1")]
    [ApiController]
    public class SecurityLoginController : ControllerBase
    {
        private SecurityLoginLogic _securityLoginLogic;

        public SecurityLoginController()
        {
            var repo = new EFGenericRepository<SecurityLoginPoco>();
            _securityLoginLogic = new SecurityLoginLogic(repo);
        }

        [HttpGet]
        [Route("login/{SecurityLoginId}")]
        public ActionResult GetSecurityLogin(Guid securityLoginId)
        {
            SecurityLoginPoco securityLogin = _securityLoginLogic.Get(securityLoginId);
            if (securityLogin == null)
            {
                return NotFound();
            }

            return Ok(securityLogin);
        }

        [HttpGet]
        [Route("login")]

        public ActionResult GetSecurityLogin()
        {
            List<SecurityLoginPoco> SecurityLoginData = _securityLoginLogic.GetAll();
            return Ok(SecurityLoginData);
        }

        [HttpPost]
        [Route("login")]
        public ActionResult PostSecurityLogin([FromBody] SecurityLoginPoco[] pocos)
        {
            _securityLoginLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("login")]
        public ActionResult PutSecurityLogin([FromBody] SecurityLoginPoco[] pocos)
        {
            _securityLoginLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("login")]
        public ActionResult DeleteSecurityLogin([FromBody] SecurityLoginPoco[] pocos)
        {
            _securityLoginLogic.Delete(pocos);
            return Ok();
        }

        [HttpPost]
        [Route("login/authenticate")]
        public ActionResult Authenticate([FromBody] AuthenticateRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Login) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Login and password are required." });
            }

            bool isValid = _securityLoginLogic.Authenticate(request.Login, request.Password);
            var user = _securityLoginLogic.GetAll().FirstOrDefault(u =>
                string.Equals(u.Login, request.Login, StringComparison.OrdinalIgnoreCase));

            if (user != null)
            {
                var logRepo = new EFGenericRepository<SecurityLoginsLogPoco>();
                var logLogic = new SecurityLoginsLogLogic(logRepo);
                logLogic.Add(new[]
                {
                    new SecurityLoginsLogPoco
                    {
                        Id = Guid.NewGuid(),
                        Login = user.Id,
                        SourceIP = HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "127.0.0.1",
                        LogonDate = DateTime.UtcNow,
                        IsSuccesful = isValid
                    }
                });
            }

            if (!isValid || user == null)
            {
                return Unauthorized(new { message = "Invalid login or password." });
            }

            return Ok(new
            {
                user.Id,
                user.Login,
                user.FullName,
                user.EmailAddress,
                user.PhoneNumber,
                user.PrefferredLanguage,
                user.Created,
                user.PasswordUpdate,
                user.AgreementAccepted,
                user.IsLocked,
                user.IsInactive,
                user.ForceChangePassword
            });
        }
    }

    public class AuthenticateRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}










