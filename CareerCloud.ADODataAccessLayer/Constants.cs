using System;
namespace CareerCloud.ADODataAccessLayer
{
    public static class Constants
    {
        public static readonly string connectionString =
            Environment.GetEnvironmentVariable("CAREERCLOUD_CONNECTION_STRING")
            ?? "Data Source=localhost;Initial Catalog=JOB_PORTAL_DB;Integrated Security=True;";
    }
}

