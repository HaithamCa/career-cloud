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
    public class ApplicantSkillController : ControllerBase
    {
        private ApplicantSkillLogic _applicantSkillLogic;

        public ApplicantSkillController()
        {
            var repo = new EFGenericRepository<ApplicantSkillPoco>();
            _applicantSkillLogic = new ApplicantSkillLogic(repo);
        }
        [HttpGet]
        [Route("skill/{ApplicantSkillId}")]
        public ActionResult GetApplicantSkill(Guid applicantSkillId)
        {
            ApplicantSkillPoco applicantSkill = _applicantSkillLogic.Get(applicantSkillId);
            if (applicantSkill == null)
            {
                return NotFound();
            }

            return Ok(applicantSkill);
        }

        [HttpGet]
        [Route("skill")]

        public ActionResult GetApplicantSkill()
        {
            List<ApplicantSkillPoco> ApplicantSkillData = _applicantSkillLogic.GetAll();
            return Ok(ApplicantSkillData);
        }

        [HttpPost]
        [Route("skill")]
        public ActionResult PostApplicantSkill([FromBody] ApplicantSkillPoco[] pocos)
        {
            _applicantSkillLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("skill")]
        public ActionResult PutApplicantSkill([FromBody] ApplicantSkillPoco[] pocos)
        {
            _applicantSkillLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("skill")]
        public ActionResult DeleteApplicantSkill([FromBody] ApplicantSkillPoco[] pocos)
        {
            _applicantSkillLogic.Delete(pocos);
            return Ok();
        }
    }
}











