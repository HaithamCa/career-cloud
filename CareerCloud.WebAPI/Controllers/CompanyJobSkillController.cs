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
    public class CompanyJobSkillController : ControllerBase
    {
        private CompanyJobSkillLogic _companyJobSkillLogic;

        public CompanyJobSkillController()
        {
            var repo = new EFGenericRepository<CompanyJobSkillPoco>();
            _companyJobSkillLogic = new CompanyJobSkillLogic(repo);
        }
        [HttpGet]
        [Route("jobskill/{CompanyJobSkillId}")]
        public ActionResult GetCompanyJobSkill(Guid companyJobSkillId)
        {
            CompanyJobSkillPoco companyJobSkill = _companyJobSkillLogic.Get(companyJobSkillId);
            if (companyJobSkill == null)
            {
                return NotFound();
            }

            return Ok(companyJobSkill);
        }

        [HttpGet]
        [Route("jobskill")]

        public ActionResult GetCompanyJobSkill()
        {
            List<CompanyJobSkillPoco> CompanyJobSkillData = _companyJobSkillLogic.GetAll();
            return Ok(CompanyJobSkillData);
        }

        [HttpPost]
        [Route("jobskill")]
        public ActionResult PostCompanyJobSkill([FromBody] CompanyJobSkillPoco[] pocos)
        {
            _companyJobSkillLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("jobskill")]
        public ActionResult PutCompanyJobSkill([FromBody] CompanyJobSkillPoco[] pocos)
        {
            _companyJobSkillLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("jobskill")]
        public ActionResult DeleteCompanyJobSkill([FromBody] CompanyJobSkillPoco[] pocos)
        {
            _companyJobSkillLogic.Delete(pocos);
            return Ok();
        }
    }
}











