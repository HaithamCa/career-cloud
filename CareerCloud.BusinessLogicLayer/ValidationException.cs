using System;
namespace CareerCloud.BusinessLogicLayer
{
    public class ValidationException : Exception
    {
        public object Code { get; set; }
        public ValidationException(int code, string message) : base(message)
        {
            Code = code;
        }
    }
}

