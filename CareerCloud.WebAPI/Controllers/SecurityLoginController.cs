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
    [Route("api/careercloud/applicant/v1")]
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
    }
}










