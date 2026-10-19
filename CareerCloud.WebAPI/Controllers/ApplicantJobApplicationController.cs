using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CareerCloud.BusinessLogicLayer;
using CareerCloud.Pocos;
using CareerCloud.EntityFrameworkDataAccess;

namespace CareerCloud.WebAPI.Controllers
{
        [Route("api/careercloud/applicant/v1")]
    [ApiController]
    public class ApplicantJobApplicationController : ControllerBase
    {
        private ApplicantJobApplicationLogic _applicantJobApplicationLogic;

        public ApplicantJobApplicationController()
        {
            var repo = new EFGenericRepository<ApplicantJobApplicationPoco>();
            _applicantJobApplicationLogic = new ApplicantJobApplicationLogic(repo);
        }


        [HttpGet]
        [Route("jobapplication/{ApplicantJobApplicationId}")]
        public ActionResult GetApplicantJobApplication(Guid applicantJobApplicationId)
        {
            ApplicantJobApplicationPoco applicantJobApplication = _applicantJobApplicationLogic.Get(applicantJobApplicationId);
            if (applicantJobApplication == null)
            {
                return NotFound();
            }

            return Ok(applicantJobApplication);
        }

        [HttpGet]
        [Route("jobapplication")]

        public ActionResult GetApplicantJobApplication()
        {
            List<ApplicantJobApplicationPoco> applicantJobApplicationData = _applicantJobApplicationLogic.GetAll();
            return Ok(applicantJobApplicationData);
        }

        [HttpPost]
        [Route("jobapplication")]
        public ActionResult PostApplicantJobApplication([FromBody] ApplicantJobApplicationPoco[] pocos)
        {
            _applicantJobApplicationLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("jobapplication")]
        public ActionResult PutApplicantJobApplication([FromBody] ApplicantJobApplicationPoco[] pocos)
        {
            _applicantJobApplicationLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("jobapplication")]
        public ActionResult DeleteApplicantJobApplication([FromBody] ApplicantJobApplicationPoco[] pocos)
        {
            _applicantJobApplicationLogic.Delete(pocos);
            return Ok();
        }
    }
}