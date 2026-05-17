namespace backend.Models
{
    public class Review
    {
        public int ReviewID{get;set;}
        public int UserID{get;set;}
        public int PlaceID{get;set;}
        public int Rating{get;set;}
        public string Comment{get;set;}="";
        public DateTime ReviewDate{get;set;}
    }
}