using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CareerCloud.BusinessLogicLayer;
using CareerCloud.Pocos;
using CareerCloud.EntityFrameworkDataAccess;

namespace CareerCloud.WebAPI.Controllers
{
    [Route("api/careercloud/applicant/v1")]
    [ApiController]
    public class ApplicantEducationController : ControllerBase
    {
        //private ApplicantEducationLogic _applicantEducationLogic;
        //public ApplicantEducationController(ApplicantEducationLogic applicantEducationLogic)
        //{
        //    this._applicantEducationLogic = applicantEducationLogic;
        //}

        private ApplicantEducationLogic _applicantEducationLogic;

        public ApplicantEducationController()
        {
            var repo = new EFGenericRepository<ApplicantEducationPoco>();
            _applicantEducationLogic = new ApplicantEducationLogic(repo);
        }
        [HttpGet]
        [Route("education/{applicantEducationId}")]
        public ActionResult GetApplicantEducation(Guid applicantEducationId)
        {
            ApplicantEducationPoco applicantEducation = _applicantEducationLogic.Get(applicantEducationId);
            if (applicantEducation == null)
            {
                return NotFound();
            }

            return Ok(applicantEducation);
        }

        [HttpGet]
        [Route("education")]

        public ActionResult GetApplicantEducation()
        {
            List<ApplicantEducationPoco> applicantEducationData = _applicantEducationLogic.GetAll();
            return Ok(applicantEducationData);
        }

        [HttpPost]
        [Route("education")]
        public ActionResult PostApplicantEducation([FromBody] ApplicantEducationPoco[] pocos)
        {
            _applicantEducationLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("education")]
        public ActionResult PutApplicantEducation([FromBody] ApplicantEducationPoco[] pocos)
        {
            _applicantEducationLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("education")]
        public ActionResult DeleteApplicantEducation([FromBody] ApplicantEducationPoco[] pocos)
        {
            _applicantEducationLogic.Delete(pocos);
            return Ok();
        }
    }
}