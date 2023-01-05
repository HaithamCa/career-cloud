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
    public class SystemLanguageCodeController : ControllerBase
    {
        private SystemLanguageCodeLogic _systemLanguageCodeLogic;

        public SystemLanguageCodeController()
        {
            var repo = new EFGenericRepository<SystemLanguageCodePoco>();
            _systemLanguageCodeLogic = new SystemLanguageCodeLogic(repo);
        }

        [HttpGet]
        [Route("education/{SystemLanguageCodeId}")]
        public ActionResult GetSystemLanguageCode(string systemLanguageCodeId)
        {
            SystemLanguageCodePoco systemLanguageCode = _systemLanguageCodeLogic.Get(systemLanguageCodeId);
            if (systemLanguageCode == null)
            {
                return NotFound();
            }

            return Ok(systemLanguageCode);
        }

        [HttpGet]
        [Route("education")]

        public ActionResult GetSystemLanguageCode()
        {
            List<SystemLanguageCodePoco> systemLanguageCodeData = _systemLanguageCodeLogic.GetAll();
            return Ok(systemLanguageCodeData);
        }

        [HttpPost]
        [Route("education")]
        public ActionResult PostSystemLanguageCode([FromBody] SystemLanguageCodePoco[] pocos)
        {
            _systemLanguageCodeLogic.Add(pocos);
            return Ok();
        }

        [HttpPut]
        [Route("education")]
        public ActionResult PutSystemLanguageCode([FromBody] SystemLanguageCodePoco[] pocos)
        {
            _systemLanguageCodeLogic.Update(pocos);
            return Ok();
        }

        [HttpDelete]
        [Route("education")]
        public ActionResult DeleteSystemLanguageCode([FromBody] SystemLanguageCodePoco[] pocos)
        {
            _systemLanguageCodeLogic.Delete(pocos);
            return Ok();
        }
    }
}











