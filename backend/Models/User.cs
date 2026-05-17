namespace backend.Models
{
    public class User
    {
        public int UserID{get; set;}
        public string FullName{get; set;}="";
        public string Email{get; set;}="";
        public string Password{get;set;}="";
    }
}