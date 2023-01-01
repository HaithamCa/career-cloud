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
    public class CompanyJobsDescriptionController : ControllerBase
    {
        private CompanyJobDescriptionLogic _companyJobDescriptionLogic;

        public CompanyJobsDescriptionController()
        {
            var repo = new EFGenericRepository<CompanyJobDescriptionPoco>();
            _companyJobDescriptionLogic = new CompanyJobDescriptionLogic(repo);
        }
        [HttpGet]
        [Route("jobdescription/{CompanyJobsDescriptionId}")]
        public ActionResult GetCompanyJobsDescription(Guid companyJobsDescriptionId)
        {
            CompanyJobDescriptionPoco companyJobsDescription = _companyJobDescriptionLogic.Get(companyJobsDescriptionId);
            if (companyJobsDescription == null)
            {
                return NotFound();
            }

            return Ok(companyJobsDescription);
        }

        [HttpGet]
        [Route("jobdescription")]

        public ActionResult GetCompanyJobsDescription()
        {
            List<CompanyJobDescriptionPoco> companyJobsDescriptionData = _companyJobDescriptionLogic.GetAll();
            return Ok(companyJobsDescriptionData);
        }

        [HttpPost]
        [Route("jobdescription")]
        public ActionResult PostCompanyJobsDescription([FromBody] CompanyJobDescriptionPoco[] pocos)
        {
            _companyJobDescriptionLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("jobdescription")]
        public ActionResult PutCompanyJobsDescription([FromBody] CompanyJobDescriptionPoco[] pocos)
        {
            _companyJobDescriptionLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("jobdescription")]
        public ActionResult DeleteCompanyJobsDescription([FromBody] CompanyJobDescriptionPoco[] pocos)
        {
            _companyJobDescriptionLogic.Delete(pocos);
            return Ok();
        }
    }
}