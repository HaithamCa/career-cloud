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
    [Route("api/careercloud/company/v1")]
    [ApiController]
    public class CompanyDescriptionController : ControllerBase
    {
        private CompanyDescriptionLogic _companyDescriptionLogic;

        public CompanyDescriptionController()
        {
            var repo = new EFGenericRepository<CompanyDescriptionPoco>();
            _companyDescriptionLogic = new CompanyDescriptionLogic(repo);
        }
        [HttpGet]
        [Route("description/{CompanyDescriptionId}")]
        public ActionResult GetCompanyDescription(Guid companyDescriptionId)
        {
            CompanyDescriptionPoco companyDescription = _companyDescriptionLogic.Get(companyDescriptionId);
            if (companyDescription == null)
            {
                return NotFound();
            }

            return Ok(companyDescription);
        }

        [HttpGet]
        [Route("description")]

        public ActionResult GetCompanyDescription()
        {
            List<CompanyDescriptionPoco> companyDescriptionData = _companyDescriptionLogic.GetAll();
            return Ok(companyDescriptionData);
        }

        [HttpPost]
        [Route("description")]
        public ActionResult PostCompanyDescription([FromBody] CompanyDescriptionPoco[] pocos)
        {
            _companyDescriptionLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("description")]
        public ActionResult PutCompanyDescription([FromBody] CompanyDescriptionPoco[] pocos)
        {
            _companyDescriptionLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("description")]
        public ActionResult DeleteCompanyDescription([FromBody] CompanyDescriptionPoco[] pocos)
        {
            _companyDescriptionLogic.Delete(pocos);
            return Ok();
        }
    }
}