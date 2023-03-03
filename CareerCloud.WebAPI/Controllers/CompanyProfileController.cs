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
    public class CompanyProfileController : ControllerBase
    {
        private CompanyProfileLogic _companyProfileLogic;

        public CompanyProfileController()
        {
            var repo = new EFGenericRepository<CompanyProfilePoco>();
            _companyProfileLogic = new CompanyProfileLogic(repo);
        }

        [HttpGet]
        [Route("profile/{CompanyProfileId}")]
        public ActionResult GetCompanyProfile(Guid companyProfileId)
        {
            CompanyProfilePoco companyProfile = _companyProfileLogic.Get(companyProfileId);
            if (companyProfile == null)
            {
                return NotFound();
            }

            return Ok(companyProfile);
        }

        [HttpGet]
        [Route("profile")]

        public ActionResult GetCompanyProfile()
        {
            List<CompanyProfilePoco> companyProfileData = _companyProfileLogic.GetAll();
            return Ok(companyProfileData);
        }

        [HttpPost]
        [Route("profile")]
        public ActionResult PostCompanyProfile([FromBody] CompanyProfilePoco[] pocos)
        {
            _companyProfileLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("profile")]
        public ActionResult PutCompanyProfile([FromBody] CompanyProfilePoco[] pocos)
        {
            _companyProfileLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("profile")]
        public ActionResult DeleteCompanyProfile([FromBody] CompanyProfilePoco[] pocos)
        {
            _companyProfileLogic.Delete(pocos);
            return Ok();
        }
    }
}











