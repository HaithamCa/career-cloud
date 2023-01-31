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
    public class ApplicantResumeController : ControllerBase
    {
        private ApplicantResumeLogic _applicantResumeLogic;

        public ApplicantResumeController()
        {
            var repo = new EFGenericRepository<ApplicantResumePoco>();
            _applicantResumeLogic = new ApplicantResumeLogic(repo);
        }
        [HttpGet]
        [Route("resume/{ApplicantResumeId}")]
        public ActionResult GetApplicantResume(Guid applicantResumeId)
        {
            ApplicantResumePoco applicantResume = _applicantResumeLogic.Get(applicantResumeId);
            if (applicantResume == null)
            {
                return NotFound();
            }

            return Ok(applicantResume);
        }

        [HttpGet]
        [Route("resume")]

        public ActionResult GetApplicantResume()
        {
            List<ApplicantResumePoco> applicantResumeData = _applicantResumeLogic.GetAll();
            return Ok(applicantResumeData);
        }

        [HttpPost]
        [Route("resume")]
        public ActionResult PostApplicantResume([FromBody] ApplicantResumePoco[] pocos)
        {
            _applicantResumeLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("resume")]
        public ActionResult PutApplicantResume([FromBody] ApplicantResumePoco[] pocos)
        {
            _applicantResumeLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("resume")]
        public ActionResult DeleteApplicantResume([FromBody] ApplicantResumePoco[] pocos)
        {
            _applicantResumeLogic.Delete(pocos);
            return Ok();
        }
    }
}










