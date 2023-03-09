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
    public class CompanyJobController : ControllerBase
    {
        private CompanyJobLogic _companyJobLogic;

        public CompanyJobController()
        {
            var repo = new EFGenericRepository<CompanyJobPoco>();
            _companyJobLogic = new CompanyJobLogic(repo);
        }

        [HttpGet]
        [Route("job/{CompanyJobId}")]
        public ActionResult GetCompanyJob(Guid companyJobId)
        {
            CompanyJobPoco companyJob = _companyJobLogic.Get(companyJobId);
            if (companyJob == null)
            {
                return NotFound();
            }

            return Ok(companyJob);
        }

        [HttpGet]
        [Route("job")]

        public ActionResult GetCompanyJob()
        {
            List<CompanyJobPoco> companyJobData = _companyJobLogic.GetAll();
            return Ok(companyJobData);
        }

        [HttpPost]
        [Route("job")]
        public ActionResult PostCompanyJob([FromBody] CompanyJobPoco[] pocos)
        {
            _companyJobLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("job")]
        public ActionResult PutCompanyJob([FromBody] CompanyJobPoco[] pocos)
        {
            _companyJobLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("job")]
        public ActionResult DeleteCompanyJob([FromBody] CompanyJobPoco[] pocos)
        {
            _companyJobLogic.Delete(pocos);
            return Ok();
        }
    }
}