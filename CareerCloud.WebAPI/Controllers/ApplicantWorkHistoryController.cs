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
    public class ApplicantWorkHistoryController : ControllerBase
    {
        private ApplicantWorkHistoryLogic _applicantWorkHistoryLogic;

        public ApplicantWorkHistoryController()
        {
            var repo = new EFGenericRepository<ApplicantWorkHistoryPoco>();
            _applicantWorkHistoryLogic = new ApplicantWorkHistoryLogic(repo);
        }
        [HttpGet]
        [Route("workhistory/{ApplicantWorkHistoryId}")]
        public ActionResult GetApplicantWorkHistory(Guid applicantWorkHistoryId)
        {
            ApplicantWorkHistoryPoco applicantWorkHistory = _applicantWorkHistoryLogic.Get(applicantWorkHistoryId);
            if (applicantWorkHistory == null)
            {
                return NotFound();
            }

            return Ok(applicantWorkHistory);
        }

        [HttpGet]
        [Route("workhistory")]

        public ActionResult GetApplicantWorkHistory()
        {
            List<ApplicantWorkHistoryPoco> applicantWorkHistoryData = _applicantWorkHistoryLogic.GetAll();
            return Ok(applicantWorkHistoryData);
        }

        [HttpPost]
        [Route("workhistory")]
        public ActionResult PostApplicantWorkHistory([FromBody] ApplicantWorkHistoryPoco[] pocos)
        {
            _applicantWorkHistoryLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("workhistory")]
        public ActionResult PutApplicantWorkHistory([FromBody] ApplicantWorkHistoryPoco[] pocos)
        {
            _applicantWorkHistoryLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("workhistory")]
        public ActionResult DeleteApplicantWorkHistory([FromBody] ApplicantWorkHistoryPoco[] pocos)
        {
            _applicantWorkHistoryLogic.Delete(pocos);
            return Ok();
        }
    }
}











