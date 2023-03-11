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
    public class CompanyJobEducationController : ControllerBase
    {
        private CompanyJobEducationLogic _companyJobEducationLogic;

        public CompanyJobEducationController()
        {
            var repo = new EFGenericRepository<CompanyJobEducationPoco>();
            _companyJobEducationLogic = new CompanyJobEducationLogic(repo);
        }
        [HttpGet]
        [Route("jobeducation/{CompanyJobEducationId}")]
        public ActionResult GetCompanyJobEducation(Guid companyJobEducationId)
        {
            CompanyJobEducationPoco companyJobEducation = _companyJobEducationLogic.Get(companyJobEducationId);
            if (companyJobEducation == null)
            {
                return NotFound();
            }

            return Ok(companyJobEducation);
        }

        [HttpGet]
        [Route("jobeducation")]

        public ActionResult GetCompanyJobEducation()
        {
            List<CompanyJobEducationPoco> companyJobEducationData = _companyJobEducationLogic.GetAll();
            return Ok(companyJobEducationData);
        }

        [HttpPost]
        [Route("jobeducation")]
        public ActionResult PostCompanyJobEducation([FromBody] CompanyJobEducationPoco[] pocos)
        {
            _companyJobEducationLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("jobeducation")]
        public ActionResult PutCompanyJobEducation([FromBody] CompanyJobEducationPoco[] pocos)
        {
            _companyJobEducationLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("jobeducation")]
        public ActionResult DeleteCompanyJobEducation([FromBody] CompanyJobEducationPoco[] pocos)
        {
            _companyJobEducationLogic.Delete(pocos);
            return Ok();
        }
    }
}