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
    public class SecurityRoleController : ControllerBase
    {
        private SecurityRoleLogic _securityRoleLogic;

        public SecurityRoleController()
        {
            var repo = new EFGenericRepository<SecurityRolePoco>();
            _securityRoleLogic = new SecurityRoleLogic(repo);
        }

        [HttpGet]
        [Route("role/{SecurityRoleId}")]
        public ActionResult GetSecurityRole(Guid securityRoleId)
        {
            SecurityRolePoco securityRole = _securityRoleLogic.Get(securityRoleId);
            if (securityRole == null)
            {
                return NotFound();
            }

            return Ok(securityRole);
        }

        [HttpGet]
        [Route("role")]

        public ActionResult GetSecurityRole()
        {
            List<SecurityRolePoco> securityRoleData = _securityRoleLogic.GetAll();
            return Ok(securityRoleData);
        }

        [HttpPost]
        [Route("role")]
        public ActionResult PostSecurityRole([FromBody] SecurityRolePoco[] pocos)
        {
            _securityRoleLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("role")]
        public ActionResult PutSecurityRole([FromBody] SecurityRolePoco[] pocos)
        {
            _securityRoleLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("role")]
        public ActionResult DeleteSecurityRole([FromBody] SecurityRolePoco[] pocos)
        {
            _securityRoleLogic.Delete(pocos);
            return Ok();
        }
    }
}










