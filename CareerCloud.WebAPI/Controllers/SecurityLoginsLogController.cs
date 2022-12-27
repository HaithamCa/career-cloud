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
    public class SecurityLoginsLogController : ControllerBase
    {
        private SecurityLoginsLogLogic _securityLoginsLogLogic;

        public SecurityLoginsLogController()
        {
            var repo = new EFGenericRepository<SecurityLoginsLogPoco>();
            _securityLoginsLogLogic = new SecurityLoginsLogLogic(repo);
        }

        [HttpGet]
        [Route("loginslog/{SecurityLoginsLogId}")]
        public ActionResult GetSecurityLoginLog(Guid securityLoginsLogId)
        {
            SecurityLoginsLogPoco securityLoginsLog = _securityLoginsLogLogic.Get(securityLoginsLogId);
            if (securityLoginsLog == null)
            {
                return NotFound();
            }

            return Ok(securityLoginsLog);
        }

        [HttpGet]
        [Route("loginslog")]

        public ActionResult GetSecurityLoginLog()
        {
            List<SecurityLoginsLogPoco> securityLoginsLogData = _securityLoginsLogLogic.GetAll();
            return Ok(securityLoginsLogData);
        }

        [HttpPost]
        [Route("loginslog")]
        public ActionResult PostSecurityLoginLog([FromBody] SecurityLoginsLogPoco[] pocos)
        {
            _securityLoginsLogLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("loginslog")]
        public ActionResult PutSecurityLoginLog([FromBody] SecurityLoginsLogPoco[] pocos)
        {
            _securityLoginsLogLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("loginslog")]
        public ActionResult DeleteSecurityLoginLog([FromBody] SecurityLoginsLogPoco[] pocos)
        {
            _securityLoginsLogLogic.Delete(pocos);
            return Ok();
        }
    }
}