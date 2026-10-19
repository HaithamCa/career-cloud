using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CareerCloud.BusinessLogicLayer;
using CareerCloud.Pocos;
using CareerCloud.EntityFrameworkDataAccess;

namespace CareerCloud.WebAPI.Controllers
{
    [Route("api/careercloud/applicant/v1")]
    [ApiController]
    public class ApplicantProfileController : ControllerBase
    {
        private ApplicantProfileLogic _applicantProfileLogic;

        public ApplicantProfileController()
        {
            var repo = new EFGenericRepository<ApplicantProfilePoco>();
            _applicantProfileLogic = new ApplicantProfileLogic(repo);
        }
        [HttpGet]
        [Route("profile/{ApplicantProfileId}")]
        public ActionResult GetApplicantProfile(Guid applicantProfileId)
        {
            ApplicantProfilePoco ApplicantProfile = _applicantProfileLogic.Get(applicantProfileId);
            if (ApplicantProfile == null)
            {
                return NotFound();
            }

            return Ok(ApplicantProfile);
        }

        [HttpGet]
        [Route("profile")]

        public ActionResult GetApplicantProfile()
        {
            List<ApplicantProfilePoco> applicantProfileData = _applicantProfileLogic.GetAll();
            return Ok(applicantProfileData);
        }

        [HttpPost]
        [Route("profile")]
        public ActionResult PostApplicantProfile([FromBody] ApplicantProfilePoco[] pocos)
        {
            _applicantProfileLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("profile")]
        public ActionResult PutApplicantProfile([FromBody] ApplicantProfilePoco[] pocos)
        {
            _applicantProfileLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("profile")]
        public ActionResult DeleteApplicantProfile([FromBody] ApplicantProfilePoco[] pocos)
        {
            _applicantProfileLogic.Delete(pocos);
            return Ok();
        }
    }
}










