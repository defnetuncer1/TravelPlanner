namespace backend.Models
{
    public class Plan
    {
        public int PlanID{get;set;}
        public int UserID{get;set;}
        public string PlanName{get;set;}="";
        public string DestinationCity{get;set;}="";
        public DateTime StartDate{get;set;}
        public DateTime EndDate{get;set;}
    }
}