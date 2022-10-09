using CareerCloud.DataAccessLayer;
using CareerCloud.Pocos;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;

namespace CareerCloud.ADODataAccessLayer
{
    public class SecurityLoginRepository : IDataRepository<SecurityLoginPoco>
    {
        public void Add(params SecurityLoginPoco[] items)
        {
            using (SqlConnection conn = new SqlConnection(Constants.connectionString))
            {
                conn.Open();

                foreach (var poco in items)
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = conn;
                    cmd.CommandText = @"INSERT INTO [dbo].[Security_Logins]
                                                        (
                                                           [Id]
                                                          ,[Login]
                                                          ,[Password]
                                                          ,[Created_Date]
                                                          ,[Password_Update_Date]
                                                          ,[Agreement_Accepted_Date]
                                                          ,[Is_Locked]
                                                          ,[Is_Inactive]
                                                          ,[Email_Address]
                                                          ,[Phone_Number]
                                                          ,[Full_Name]
                                                          ,[Force_Change_Password]
                                                          ,[Prefferred_Language]
                                                        )
                                                        VALUES
                                                        (
                                                           @Id
                                                          ,@Login
                                                          ,@Password
                                                          ,@Created_Date
                                                          ,@Password_Update_Date
                                                          ,@Agreement_Accepted_Date
                                                          ,@Is_Locked
                                                          ,@Is_Inactive
                                                          ,@Email_Address
                                                          ,@Phone_Number
                                                          ,@Full_Name
                                                          ,@Force_Change_Password
                                                          ,@Prefferred_Language
                                                        )";

                    cmd.Parameters.AddWithValue("@Id", poco.Id);
                    cmd.Parameters.AddWithValue("@Login", poco.Login);
                    cmd.Parameters.AddWithValue("@Password", poco.Password);
                    cmd.Parameters.AddWithValue("@Created_Date", poco.Created);
                    cmd.Parameters.AddWithValue("@Password_Update_Date", poco.PasswordUpdate);
                    cmd.Parameters.AddWithValue("@Agreement_Accepted_Date", poco.AgreementAccepted);
                    cmd.Parameters.AddWithValue("@Is_Locked", poco.IsLocked);
                    cmd.Parameters.AddWithValue("@Is_Inactive", poco.IsInactive);
                    cmd.Parameters.AddWithValue("@Email_Address", poco.EmailAddress);
                    cmd.Parameters.AddWithValue("@Phone_Number", poco.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Full_Name", poco.FullName);
                    cmd.Parameters.AddWithValue("@Force_Change_Password", poco.ForceChangePassword);
                    cmd.Parameters.AddWithValue("@Prefferred_Language", poco.PrefferredLanguage);
                    cmd.ExecuteNonQuery();
                }

                conn.Close();
            }
        }

        public void CallStoredProc(string name, params Tuple<string, string>[] parameters)
        {
            throw new NotImplementedException();
        }

        public IList<SecurityLoginPoco> GetAll(params Expression<Func<SecurityLoginPoco, object>>[] navigationProperties)
        {
            SecurityLoginPoco[] result = new SecurityLoginPoco[100];

            using (SqlConnection conn = new SqlConnection(Constants.connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand();
                cmd.Connection = conn;
                cmd.CommandText = @"SELECT [Id]
                                                ,[Login]
                                                ,[Password]
                                                ,[Created_Date]
                                                ,[Password_Update_Date]
                                                ,[Agreement_Accepted_Date]
                                                ,[Is_Locked]
                                                ,[Is_Inactive]
                                                ,[Email_Address]
                                                ,[Phone_Number]
                                                ,[Full_Name]
                                                ,[Force_Change_Password]
                                                ,[Prefferred_Language]
                                                ,[Time_Stamp]
                                                FROM [JOB_PORTAL_DB].[dbo].[Security_Logins]";

                SqlDataReader rdr = cmd.ExecuteReader();

                int i = 0;
                while (rdr.Read())
                {
                    SecurityLoginPoco poco = new SecurityLoginPoco();
                    poco.Id = rdr.GetGuid(0);
                    poco.Login = rdr.GetString(1);
                    poco.Password = rdr.GetString(2);
                    poco.Created = rdr.GetDateTime(3);
                    poco.PasswordUpdate = rdr.IsDBNull(4) ? null : (DateTime?)rdr.GetDateTime(4);
                    poco.AgreementAccepted = rdr.IsDBNull(5) ? null : (DateTime?)rdr.GetDateTime(5);
                    poco.IsLocked = rdr.GetBoolean(6);
                    poco.IsInactive = rdr.GetBoolean(7);
                    poco.EmailAddress = rdr.GetString(8);
                    poco.PhoneNumber = rdr.IsDBNull(9) ? null : rdr.GetString(9);
                    poco.FullName = rdr.IsDBNull(10) ? null : rdr.GetString(10);
                    poco.ForceChangePassword = rdr.GetBoolean(11);
                    poco.PrefferredLanguage = rdr.IsDBNull(12) ? null : rdr.GetString(12);

                    int bufferSize = (int)rdr.GetBytes(13, 0, null, 0, 0);
                    poco.TimeStamp = new byte[bufferSize];
                    rdr.GetBytes(13, 0, poco.TimeStamp, 0, bufferSize);

                    result[i++] = poco;
                }

                conn.Close();
            }

            return result.Where(t => t != null).ToList();
        }

        public IList<SecurityLoginPoco> GetList(Func<SecurityLoginPoco, bool> where, params Expression<Func<SecurityLoginPoco, object>>[] navigationProperties)
        {
            throw new NotImplementedException();
        }

        public IList<SecurityLoginPoco> GetList(Expression<Func<SecurityLoginPoco, bool>> where, params Expression<Func<SecurityLoginPoco, object>>[] navigationProperties)
        {
            throw new NotImplementedException();
        }

        public SecurityLoginPoco GetSingle(Expression<Func<SecurityLoginPoco, bool>> where, params Expression<Func<SecurityLoginPoco, object>>[] navigationProperties)
        {
            IQueryable<SecurityLoginPoco> pocos = GetAll().AsQueryable();

            return pocos.Where(where).FirstOrDefault();
        }

        public void Remove(params SecurityLoginPoco[] items)
        {
            using (SqlConnection conn = new SqlConnection(Constants.connectionString))
            {
                conn.Open();

                foreach (var poco in items)
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = conn;
                    cmd.CommandText = @"DELETE FROM [dbo].[Security_Logins]
                                                      WHERE [Id] = @Id";

                    cmd.Parameters.AddWithValue("@Id", poco.Id);

                    cmd.ExecuteNonQuery();
                }

                conn.Close();
            }
        }

        public void Update(params SecurityLoginPoco[] items)
        {
            using (SqlConnection conn = new SqlConnection(Constants.connectionString))
            {
                conn.Open();

                foreach (var poco in items)
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = conn;
                    cmd.CommandText = @"UPDATE [dbo].[Security_Logins]
                                                 SET [Login] = @Login
                                                    ,[Password] = @Password
                                                    ,[Created_Date] = @Created_Date
                                                    ,[Password_Update_Date] = @Password_Update_Date
                                                    ,[Agreement_Accepted_Date] = @Agreement_Accepted_Date
                                                    ,[Is_Locked] = @Is_Locked
                                                    ,[Is_Inactive] = @Is_Inactive
                                                    ,[Email_Address] = @Email_Address
                                                    ,[Phone_Number] = @Phone_Number
                                                    ,[Full_Name] = @Full_Name
                                                    ,[Force_Change_Password] = @Force_Change_Password
                                                    ,[Prefferred_Language] = @Prefferred_Language
                                               WHERE [Id] = @Id";

                    cmd.Parameters.AddWithValue("@Id", poco.Id);
                    cmd.Parameters.AddWithValue("@Login", poco.Login);
                    cmd.Parameters.AddWithValue("@Password", poco.Password);
                    cmd.Parameters.AddWithValue("@Created_Date", poco.Created);
                    cmd.Parameters.AddWithValue("@Password_Update_Date", poco.PasswordUpdate);
                    cmd.Parameters.AddWithValue("@Agreement_Accepted_Date", poco.AgreementAccepted);
                    cmd.Parameters.AddWithValue("@Is_Locked", poco.IsLocked);
                    cmd.Parameters.AddWithValue("@Is_Inactive", poco.IsInactive);
                    cmd.Parameters.AddWithValue("@Email_Address", poco.EmailAddress);
                    cmd.Parameters.AddWithValue("@Phone_Number", poco.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Full_Name", poco.FullName);
                    cmd.Parameters.AddWithValue("@Force_Change_Password", poco.ForceChangePassword);
                    cmd.Parameters.AddWithValue("@Prefferred_Language", poco.PrefferredLanguage);

                    cmd.ExecuteNonQuery();
                }

                conn.Close();
            }
        }
    }
}