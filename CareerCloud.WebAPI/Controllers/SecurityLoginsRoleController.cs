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
    public class SecurityLoginsRoleController : ControllerBase
    {
        private SecurityLoginsRoleLogic _securityLoginsRoleLogic;

        public SecurityLoginsRoleController()
        {
            var repo = new EFGenericRepository<SecurityLoginsRolePoco>();
            _securityLoginsRoleLogic = new SecurityLoginsRoleLogic(repo);
        }

        [HttpGet]
        [Route("loginsrole/{securityLoginsRoleId}")]
        public ActionResult GetSecurityLoginsRole(Guid securityLoginsRoleId)
        {
            SecurityLoginsRolePoco securityLoginsRole = _securityLoginsRoleLogic.Get(securityLoginsRoleId);
            if (securityLoginsRole == null)
            {
                return NotFound();
            }

            return Ok(securityLoginsRole);
        }

        [HttpGet]
        [Route("loginsrole")]

        public ActionResult GetSecurityLoginsRole()
        {
            List<SecurityLoginsRolePoco> securityLoginsRoleData = _securityLoginsRoleLogic.GetAll();
            return Ok(securityLoginsRoleData);
        }

        [HttpPost]
        [Route("loginsrole")]
        public ActionResult PostSecurityLoginRole([FromBody] SecurityLoginsRolePoco[] pocos)
        {
            _securityLoginsRoleLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("loginsrole")]
        public ActionResult PutSecurityLoginsRole([FromBody] SecurityLoginsRolePoco[] pocos)
        {
            _securityLoginsRoleLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("loginsrole")]
        public ActionResult DeleteSecurityLoginRole([FromBody] SecurityLoginsRolePoco[] pocos)
        {
            _securityLoginsRoleLogic.Delete(pocos);
            return Ok();
        }
    }
}











